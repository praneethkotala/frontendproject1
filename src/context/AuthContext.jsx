import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getStoredUser, loginUser, removeStoredUser } from '../services/authService'
import { fetchProfileDetails } from '../services/profileService'
import { USER_ROLES } from '../constants/AppConstants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => getStoredUser())
  const [userProfile, setUserProfile] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const loadProfile = useCallback(async (user) => {
    if (!user) {
      setUserProfile(null)
      return
    }

    try {
      const profileData = await fetchProfileDetails({
        role: user.role,
        userId: user.id,
      })

      if (user.role === USER_ROLES.ADMIN && Array.isArray(profileData)) {
        const found = profileData.find((u) => u.id === user.id) || profileData[0]
        setUserProfile(found)
      } else {
        setUserProfile(profileData)
      }
    } catch (error) {
      console.error('Failed to load user profile in AuthContext:', error)
    }
  }, [])

  useEffect(() => {
    const initializeAuth = async () => {
      const stored = getStoredUser()
      if (stored) {
        setAuthUser(stored)
        await loadProfile(stored)
      }
      setAuthLoading(false)
    }

    initializeAuth()
  }, [loadProfile])

  const handleLogin = async ({ email, password }) => {
    const user = await loginUser({ email, password })
    setAuthUser(user)
    await loadProfile(user)
    return user
  }

  const handleLogout = () => {
    removeStoredUser()
    setAuthUser(null)
    setUserProfile(null)
  }

  const refreshProfile = async () => {
    if (authUser) {
      await loadProfile(authUser)
    }
  }

  const value = {
    authUser,
    userProfile,
    authLoading,
    login: handleLogin,
    logout: handleLogout,
    refreshProfile,
    setUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
