import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Home, ArrowLeftRight, User, LogOut, ShieldCheck } from 'lucide-react'
import { APP_ASSETS, DEMO_USER, USER_ROLES } from '../../../constants/AppConstants'
import './MobileNavbar.css'

export const MobileNavbar = ({
  user,
  userProfile,
  onLogoutClick,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isAdmin = user?.role === USER_ROLES.ADMIN
  const displayName = userProfile?.name || (isAdmin ? 'Administrator' : DEMO_USER.USERNAME)
  const displayEmail = userProfile?.email || user?.email || (isAdmin ? 'admin@gmail.com' : DEMO_USER.EMAIL)

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogoutFromMobile = () => {
    closeMenu()
    onLogoutClick()
  }

  return (
    <div className="mobile-navbar-container">
      <div className="mobile-navbar-bar">
        <NavLink to="/dashboard" className="mobile-brand-link" onClick={closeMenu}>
          <div className="mobile-logo-icon">
            <span>$</span>
          </div>
          <span className="mobile-brand-name">Money Matters</span>
        </NavLink>

        <button
          type="button"
          className="mobile-hamburger-btn"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu-drawer">
          <nav className="mobile-nav-list">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <Home size={20} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/transactions"
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <ArrowLeftRight size={20} />
              <span>{isAdmin ? 'All Transactions' : 'Transactions'}</span>
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <User size={20} />
              <span>Profile</span>
            </NavLink>
          </nav>

          <div className="mobile-user-profile-section">
            <div className="mobile-user-info">
              <img
                src={APP_ASSETS.USER_AVATAR}
                alt={displayName}
                className="mobile-user-avatar"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
                }}
              />
              <div className="mobile-user-details">
                <div className="mobile-user-name-row">
                  <p className="mobile-user-name">{displayName}</p>
                  {isAdmin && (
                    <span className="mobile-admin-tag">
                      <ShieldCheck size={12} /> Admin
                    </span>
                  )}
                </div>
                <p className="mobile-user-email">{displayEmail}</p>
              </div>
            </div>

            <button
              type="button"
              className="mobile-logout-button"
              onClick={handleLogoutFromMobile}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
