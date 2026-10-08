import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Sidebar } from '../components/common/Sidebar/Sidebar'
import { MobileNavbar } from '../components/common/MobileNavbar/MobileNavbar'
import { LogoutConfirmationModal } from '../components/modals/LogoutConfirmationModal/LogoutConfirmationModal'
import './AppLayout.css'

export const AppLayout = () => {
  const { authUser, userProfile, logout } = useAuth()
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const navigate = useNavigate()

  const handleOpenLogoutModal = () => {
    setLogoutError('')
    setIsLogoutModalOpen(true)
  }

  const handleCloseLogoutModal = () => {
    setLogoutError('')
    setIsLogoutModalOpen(false)
  }

  const handleConfirmLogout = async () => {
    try {
      await logout()
      setIsLogoutModalOpen(false)
      navigate('/login')
    } catch (error) {
      console.error('Failed to end the server session:', error)
      setLogoutError(error.message || 'Could not log out. Please try again.')
    }
  }

  return (
    <div className="app-layout">
      <Sidebar
        user={authUser}
        userProfile={userProfile}
        onLogoutClick={handleOpenLogoutModal}
      />

      <div className="app-main-wrapper">
        <MobileNavbar
          user={authUser}
          userProfile={userProfile}
          onLogoutClick={handleOpenLogoutModal}
        />

        <main className="app-content-area">
          <Outlet />
        </main>
      </div>

      {isLogoutModalOpen && (
        <LogoutConfirmationModal
          onClose={handleCloseLogoutModal}
          onConfirm={handleConfirmLogout}
          errorMessage={logoutError}
        />
      )}
    </div>
  )
}
