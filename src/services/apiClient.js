import { API_BASE_URL } from '../constants/AppConstants'

export const sendApiRequest = async ({ endpoint, method = 'GET', body = null }) => {
  const url = `${API_BASE_URL}${endpoint}`

  const headers = {
    'content-type': 'application/json',
  }

  const options = {
    method,
    headers,
    credentials: 'same-origin',
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
