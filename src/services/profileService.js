import { sendApiRequest } from './apiClient'
import { USER_ROLES } from '../constants/AppConstants'

export const fetchProfileDetails = async ({ role = USER_ROLES.USER, userId = null }) => {
  const data = await sendApiRequest({
    endpoint: '/profile',
    method: 'GET',
    role,
    userId,
  })

  const users = data?.users || []
  if (role === USER_ROLES.ADMIN) {
    return users
  }

  return users[0] || null
}
