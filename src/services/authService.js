import Cookies from 'js-cookie'
import { sendApiRequest } from './apiClient'
import { USER_ROLES, STORAGE_KEYS } from '../constants/AppConstants'

export const loginUser = async ({ email, password }) => {
  const result = await sendApiRequest({
    endpoint: '/get-user-id',
    method: 'POST',
    body: { email, password },
    role: USER_ROLES.ADMIN,
  })

  const usersList = result?.get_user_id || []
  if (usersList.length === 0) {
    throw new Error('Invalid email or password. Please try again.')
  }

  const userId = usersList[0].id
  const isAdminEmail = email.toLowerCase().includes('admin')
  const assignedRole = isAdminEmail ? USER_ROLES.ADMIN : USER_ROLES.USER

  const authUser = {
    id: userId,
    email,
    role: assignedRole,
  }

  setStoredUser({ user: authUser })
  return authUser
}

export const getStoredUser = () => {
  const cookieValue = Cookies.get(STORAGE_KEYS.AUTH_USER)
  if (cookieValue) {
    try {
      return JSON.parse(cookieValue)
    } catch {
      return null
    }
  }

  const localValue = localStorage.getItem(STORAGE_KEYS.AUTH_USER)
  if (localValue) {
    try {
      return JSON.parse(localValue)
    } catch {
      return null
    }
  }

  return null
}

export const setStoredUser = ({ user }) => {
  const serialized = JSON.stringify(user)
  Cookies.set(STORAGE_KEYS.AUTH_USER, serialized, { expires: 7 })
  localStorage.setItem(STORAGE_KEYS.AUTH_USER, serialized)
}

export const removeStoredUser = () => {
  Cookies.remove(STORAGE_KEYS.AUTH_USER)
  localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
}
