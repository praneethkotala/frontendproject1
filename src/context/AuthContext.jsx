import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getCurrentUser, loginUser, logoutUser } from '../services/authService'
import { fetchProfileDetails } from '../services/profileService'
import { getStoredProfilePhoto } from '../services/profilePhotoStorage'
import { USER_ROLES } from '../constants/AppConstants'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null)
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

      const profile = user.role === USER_ROLES.ADMIN && Array.isArray(profileData)
        ? profileData.find((item) => item.id === user.id) || profileData[0]
        : profileData
      const savedPhoto = getStoredProfilePhoto(user.email)
      setUserProfile(
        profile
          ? { ...profile, avatar_url: savedPhoto || profile.avatar_url }
          : profile,
      )
    } catch (error) {
      console.error('Failed to load user profile in AuthContext:', error)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        const user = await getCurrentUser()
        if (isMounted && user) {
          setAuthUser(user)
          await loadProfile(user)
        }
      } catch (error) {
        console.error('Failed to restore the server session:', error)
      } finally {
        if (isMounted) {
          setAuthLoading(false)
        }
      }
    }

    initializeAuth()

    return () => {
      isMounted = false
    }
  }, [loadProfile])

  const handleLogin = async ({ email, password }) => {
    const user = await loginUser({ email, password })
    setAuthUser(user)
    await loadProfile(user)
    return user
  }

  const handleLogout = async () => {
    await logoutUser()
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
