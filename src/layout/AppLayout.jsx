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
  const navigate = useNavigate()

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true)
  }

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false)
  }

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false)
    logout()
    navigate('/login')
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
        />
      )}
    </div>
  )
}
