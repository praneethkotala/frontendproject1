import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Header } from '../../components/common/Header/Header'
import { ProfileView } from '../../components/profile/ProfileView/ProfileView'
import { EditProfileModal } from '../../components/modals/EditProfileModal/EditProfileModal'
import './ProfilePage.css'

export const ProfilePage = () => {
  const { authUser, userProfile, setUserProfile } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handleSaveProfile = (updatedProfile) => {
    setUserProfile(updatedProfile)
  }

  return (
    <div className="profile-page-container">
      <Header
        title="Profile"
        onEditProfileClick={handleOpenEditModal}
      />

      <div className="profile-content-body">
        <ProfileView
          profile={userProfile}
          user={authUser}
        />
      </div>

      {isEditModalOpen && (
        <EditProfileModal
          profile={userProfile}
          onClose={handleCloseEditModal}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  )
}
