import { API_BASE_URL, USER_ROLES } from '../constants/AppConstants'

export const sendApiRequest = async ({ endpoint, method = 'GET', body = null, role = USER_ROLES.USER, userId = null }) => {
  const url = `${API_BASE_URL}${endpoint}`

  const headers = {
    'content-type': 'application/json',
    'x-hasura-role': role,
  }

  if (role === USER_ROLES.USER && userId !== null) {
    headers['x-hasura-user-id'] = String(userId)
  }

  const options = {
    method,
    headers,
  }

  if (body !== null && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorText = await response.text()
      let parsedError = errorText
      try {
        parsedError = JSON.parse(errorText)
      } catch {
        // Keep string format
      }
      const message = parsedError?.error || parsedError?.message || `Request failed with status ${response.status}`
      throw new Error(message)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API Error on ${method} ${endpoint}:`, error)
    throw error
  }
}
