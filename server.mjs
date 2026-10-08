import { randomBytes } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const localEnvPath = resolve(projectRoot, '.env.local')
if (existsSync(localEnvPath)) {
  process.loadEnvFile(localEnvPath)
}

const hasuraBaseUrl = (
  process.env.HASURA_API_BASE_URL || 'https://bursting-gelding-24.hasura.app/api/rest'
).replace(/\/+$/, '')
const adminSecret = process.env.HASURA_ADMIN_SECRET
const adminEmails = new Set(
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
)
const port = Number(process.env.PORT || 4177)
const sessionCookieName = 'money_matters_session'
const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000
const maxBodySize = 1024 * 1024
const sessions = new Map()
const loginAttempts = new Map()
const distPath = resolve(projectRoot, 'dist')
const host = process.env.HOST || (process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1')

const restRoutes = new Map([
  ['/profile', new Set(['GET'])],
  ['/all-transactions', new Set(['GET'])],
  ['/credit-debit-totals', new Set(['GET'])],
  ['/transaction-totals-admin', new Set(['GET'])],
  ['/daywise-totals-7-days', new Set(['GET'])],
  ['/daywise-totals-last-7-days-admin', new Set(['GET'])],
  ['/add-transaction', new Set(['POST'])],
  ['/update-transaction', new Set(['POST'])],
  ['/delete-transaction', new Set(['DELETE'])],
])

const adminOnlyRoutes = new Set([
  '/transaction-totals-admin',
  '/daywise-totals-last-7-days-admin',
])

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

const writeJson = (response, statusCode, value, headers = {}) => {
  response.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...headers,
  })
  response.end(JSON.stringify(value))
}

const readJsonBody = async (request) => {
  const chunks = []
  let size = 0

  for await (const chunk of request) {
    size += chunk.length
    if (size > maxBodySize) {
      const error = new Error('Request body is too large.')
      error.statusCode = 413
      throw error
    }
    chunks.push(chunk)
  }

  if (size === 0) {
    return {}
  }

  let body
  try {
    body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  } catch {
    const error = new Error('Request body must be valid JSON.')
    error.statusCode = 400
    throw error
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    const error = new Error('Request body must be a JSON object.')
    error.statusCode = 400
    throw error
  }
  return body
}

const getSession = (request) => {
  const cookieHeader = request.headers.cookie || ''
  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${sessionCookieName}=`))

  if (!cookie) {
    return null
  }

  let sessionId
  try {
    sessionId = decodeURIComponent(cookie.slice(sessionCookieName.length + 1))
  } catch {
    return null
  }
  const session = sessions.get(sessionId)
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(sessionId)
    return null
  }

  return { sessionId, ...session }
}

const setSessionCookie = (sessionId) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${sessionCookieName}=${encodeURIComponent(sessionId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${sessionLifetimeMs / 1000}${secure}`
}

const clearSessionCookie = () => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  return `${sessionCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
}

const checkLoginRateLimit = (request) => {
  const key = request.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const entry = loginAttempts.get(key)

  if (!entry || entry.resetAt <= now) {
    loginAttempts.set(key, { count: 0, resetAt: now + 15 * 60 * 1000 })
    return { key, blocked: false }
  }

  return { key, blocked: entry.count >= 10 }
}

const requestHasura = async ({ path, method, role, userId, body }) => {
  if (!adminSecret) {
    const error = new Error('Backend configuration is incomplete: set HASURA_ADMIN_SECRET in .env.local.')
    error.statusCode = 503
    throw error
  }
  if (!hasuraBaseUrl) {
    const error = new Error('Backend configuration is incomplete: set HASURA_API_BASE_URL in .env.local.')
    error.statusCode = 503
    throw error
  }

  const headers = {
    'content-type': 'application/json',
    'x-hasura-admin-secret': adminSecret,
    'x-hasura-role': role,
  }
  if (role === 'user' && userId !== null) {
    headers['x-hasura-user-id'] = String(userId)
  }

  let response
  try {
    response = await fetch(`${hasuraBaseUrl}${path}`, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    const error = new Error('Could not reach the Hasura service. Check the backend URL and network connection.')
    error.statusCode = 502
    throw error
  }
  const responseBody = await response.text()
  return { status: response.status, contentType: response.headers.get('content-type'), body: responseBody }
}

const handleLogin = async (request, response) => {
  const rateLimit = checkLoginRateLimit(request)
  if (rateLimit.blocked) {
    return writeJson(response, 429, { error: 'Too many sign-in attempts. Please wait 15 minutes and try again.' })
  }

  const { email, password } = await readJsonBody(request)
  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return writeJson(response, 400, { error: 'Email and password are required.' })
  }

  const result = await requestHasura({
    path: '/get-user-id',
    method: 'POST',
    role: 'admin',
    userId: null,
    body: { email: email.trim(), password },
  })
  if (result.status < 200 || result.status >= 300) {
    return writeJson(response, 502, { error: 'The authentication service is unavailable. Please try again later.' })
  }

  let data
  try {
    data = JSON.parse(result.body)
  } catch {
    throw new Error('The authentication service returned an invalid response.')
  }

  const account = data?.get_user_id?.[0]
  if (!account || account.id === undefined || account.id === null) {
    const attempt = loginAttempts.get(rateLimit.key)
    if (attempt) {
      attempt.count += 1
    }
    return writeJson(response, 401, { error: 'Invalid email or password. Please try again.' })
  }

  loginAttempts.delete(rateLimit.key)
  const normalizedEmail = email.trim().toLowerCase()
  const user = {
    id: account.id,
    email: email.trim(),
    role: adminEmails.has(normalizedEmail) ? 'admin' : 'user',
  }
  const sessionId = randomBytes(32).toString('hex')
  for (const [id, session] of sessions) {
    if (session.expiresAt <= Date.now()) {
      sessions.delete(id)
    }
  }
  sessions.set(sessionId, { user, expiresAt: Date.now() + sessionLifetimeMs })

  return writeJson(response, 200, { user }, { 'set-cookie': setSessionCookie(sessionId) })
}

const handleRestRequest = async (request, response, requestUrl, session) => {
  const endpoint = requestUrl.pathname.slice('/api/rest'.length)
  const allowedMethods = restRoutes.get(endpoint)
  if (!allowedMethods || !allowedMethods.has(request.method)) {
    return writeJson(response, 404, { error: 'API route not found.' })
  }
  if (adminOnlyRoutes.has(endpoint) && session.user.role !== 'admin') {
    return writeJson(response, 403, { error: 'Administrator access is required.' })
  }

  let body
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    body = await readJsonBody(request)
    if (endpoint === '/add-transaction' && session.user.role === 'user') {
      body.user_id = session.user.id
    }
  }

  const result = await requestHasura({
    path: `${endpoint}${requestUrl.search}`,
    method: request.method,
    role: session.user.role,
    userId: session.user.id,
    body,
  })
  response.writeHead(result.status, {
    'cache-control': 'no-store',
    'content-type': result.contentType || 'application/json; charset=utf-8',
  })
  response.end(result.body)
}

const serveStaticFile = async (request, response, requestUrl) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return writeJson(response, 405, { error: 'Method not allowed.' })
  }

  let pathname
  try {
    pathname = decodeURIComponent(requestUrl.pathname)
  } catch {
    return writeJson(response, 400, { error: 'Invalid URL path.' })
  }

  let filePath = resolve(distPath, `.${pathname}`)
  if (!filePath.startsWith(`${distPath}${sep}`) && filePath !== distPath) {
    return writeJson(response, 403, { error: 'Forbidden.' })
  }

  if (!existsSync(filePath) || pathname.endsWith('/')) {
    if (extname(pathname)) {
      return writeJson(response, 404, { error: 'Not found.' })
    }
    filePath = resolve(distPath, 'index.html')
  }

  try {
    const content = await readFile(filePath)
    response.writeHead(200, {
      'content-type': contentTypes[extname(filePath)] || 'application/octet-stream',
      'cache-control': extname(filePath) === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
    })
    if (request.method === 'HEAD') {
      return response.end()
    }
    return response.end(content)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return writeJson(response, 503, { error: 'Build the frontend with npm run build before starting production mode.' })
    }
    throw error
  }
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url, 'http://localhost')

    if (requestUrl.pathname === '/api/health' && request.method === 'GET') {
      return writeJson(response, 200, {
        status: 'ok',
        hasuraConfigured: Boolean(adminSecret && hasuraBaseUrl),
      })
    }

    if (requestUrl.pathname === '/api/auth/login' && request.method === 'POST') {
      return await handleLogin(request, response)
    }

    if (requestUrl.pathname === '/api/auth/session' && request.method === 'GET') {
      const session = getSession(request)
      return writeJson(response, 200, { user: session?.user || null })
    }

    if (requestUrl.pathname === '/api/auth/logout' && request.method === 'POST') {
      const session = getSession(request)
      if (session) {
        sessions.delete(session.sessionId)
      }
      return writeJson(response, 200, { ok: true }, { 'set-cookie': clearSessionCookie() })
    }

    if (requestUrl.pathname.startsWith('/api/rest/')) {
      const session = getSession(request)
      if (!session) {
        return writeJson(response, 401, { error: 'Please sign in to continue.' })
      }
      return await handleRestRequest(request, response, requestUrl, session)
    }

    if (requestUrl.pathname.startsWith('/api/')) {
      return writeJson(response, 404, { error: 'API route not found.' })
    }

    return await serveStaticFile(request, response, requestUrl)
  } catch (error) {
    console.error('Request failed:', error)
    if (!response.headersSent) {
      return writeJson(response, error.statusCode || 500, {
        error: error.statusCode ? error.message : 'An internal server error occurred.',
      })
    }
    response.destroy(error)
  }
})

server.listen(port, host, () => {
  console.log(`Money Matters API server listening on http://${host}:${port}`)
  if (!adminSecret) {
    console.warn('HASURA_ADMIN_SECRET is not configured. Add a newly rotated secret to .env.local before signing in.')
  }
})
