import { NavLink } from 'react-router-dom'
import { Home, ArrowLeftRight, User, LogOut, ShieldCheck } from 'lucide-react'
import { APP_ASSETS, DEMO_USER, USER_ROLES } from '../../../constants/AppConstants'
import './Sidebar.css'

export const Sidebar = ({
  user,
  userProfile,
  onLogoutClick,
}) => {
  const isAdmin = user?.role === USER_ROLES.ADMIN
  const displayName = userProfile?.name || (isAdmin ? 'Administrator' : DEMO_USER.USERNAME)
  const displayEmail = userProfile?.email || user?.email || (isAdmin ? 'admin@gmail.com' : DEMO_USER.EMAIL)

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand-section">
        <NavLink to="/dashboard" className="sidebar-brand-link">
          <div className="sidebar-logo-icon">
            <span className="logo-symbol">$</span>
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-name">Money</span>
            <span className="brand-suffix">Matters</span>
          </div>
        </NavLink>
      </div>

      <nav className="sidebar-navigation">
        <ul className="sidebar-nav-list">
          <li className="sidebar-nav-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            >
              <Home size={20} className="nav-icon" />
              <span className="nav-label">Dashboard</span>
            </NavLink>
          </li>

          <li className="sidebar-nav-item">
            <NavLink
              to="/transactions"
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            >
              <ArrowLeftRight size={20} className="nav-icon" />
              <span className="nav-label">
                {isAdmin ? 'All Transactions' : 'Transactions'}
              </span>
            </NavLink>
          </li>

          <li className="sidebar-nav-item">
            <NavLink
              to="/profile"
              className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
            >
              <User size={20} className="nav-icon" />
              <span className="nav-label">Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-pill">
          <div className="user-avatar-container">
            <img
              src={APP_ASSETS.USER_AVATAR}
              alt={displayName}
              className="user-avatar"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
              }}
            />
            {isAdmin && (
              <span className="admin-badge-indicator" title="Admin User">
                <ShieldCheck size={12} />
              </span>
            )}
          </div>

          <div className="user-info-text">
            <p className="user-name">{displayName}</p>
            <p className="user-email">{displayEmail}</p>
          </div>

          <button
            type="button"
            className="sidebar-logout-button"
            onClick={onLogoutClick}
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}
