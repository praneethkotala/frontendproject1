const getProfilePhotoKey = (email) =>
  `money-matters:profile-photo:${email.trim().toLowerCase()}`

export const getStoredProfilePhoto = (email) => {
  if (!email) {
    return null
  }

  try {
    return localStorage.getItem(getProfilePhotoKey(email))
  } catch (error) {
    console.error('Failed to load the saved profile photo:', error)
    return null
  }
}

export const saveProfilePhoto = (email, photo) => {
  if (!email) {
    throw new Error('A signed-in email is required to save a profile photo.')
  }

  try {
    const key = getProfilePhotoKey(email)
    if (photo) {
      localStorage.setItem(key, photo)
    } else {
      localStorage.removeItem(key)
    }
  } catch (error) {
    console.error('Failed to save the profile photo in this browser:', error)
    throw new Error('Could not save the profile photo in this browser. Check available storage and try again.')
  }
}
