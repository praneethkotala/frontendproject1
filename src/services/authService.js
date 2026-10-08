const sendAuthRequest = async ({ endpoint, method = 'GET', body = null }) => {
  const response = await fetch(endpoint, {
    method,
    headers: {
      'content-type': 'application/json',
    },
    credentials: 'same-origin',
    ...(body === null ? {} : { body: JSON.stringify(body) }),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data?.error || `Authentication request failed (${response.status}).`)
  }

  return data
}

export const loginUser = async ({ email, password }) => {
  const { user } = await sendAuthRequest({
    endpoint: '/api/auth/login',
    method: 'POST',
    body: { email, password },
  })
  return user
}

export const getCurrentUser = async () => {
  const { user } = await sendAuthRequest({ endpoint: '/api/auth/session' })
  return user
}

export const logoutUser = async () => {
  await sendAuthRequest({
    endpoint: '/api/auth/logout',
    method: 'POST',
  })
}
