import { ProfileField } from '../ProfileField/ProfileField'
import { APP_ASSETS, DEMO_USER, USER_ROLES } from '../../../constants/AppConstants'
import './ProfileView.css'

export const ProfileView = ({
  profile,
  user,
}) => {
  const isAdmin = user?.role === USER_ROLES.ADMIN
  const name = profile?.name || (isAdmin ? 'Admin' : DEMO_USER.USERNAME)
  const email = profile?.email || user?.email || (isAdmin ? 'admin@gmail.com' : DEMO_USER.EMAIL)
  const userName = profile?.username || name.toLowerCase().replace(/\s+/g, '.')
  const dob = profile?.date_of_birth || '1996-06-12'
  const presentAddress = profile?.present_address || 'San Jose, California, USA'
  const permanentAddress = profile?.permanent_address || 'San Jose, California, USA'
  const city = profile?.city || 'San Jose'
  const postalCode = profile?.postal_code ? String(profile.postal_code) : '45962'
  const country = profile?.country || 'USA'

  return (
    <div className="profile-view-card">
      <div className="profile-avatar-column">
        <div className="profile-photo-wrapper">
          <img
            src={profile?.avatar_url || APP_ASSETS.USER_AVATAR}
            alt={name}
            className="profile-photo-img"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png'
            }}
          />
        </div>
        <div className="profile-summary-header">
          <h2 className="profile-full-name">{name}</h2>
          <p className="profile-badge-pill">{isAdmin ? 'Administrator' : 'Standard User'}</p>
        </div>
      </div>

      <div className="profile-details-grid">
        <ProfileField label="Your Name" value={name} />
        <ProfileField label="User Name" value={userName} />
        <ProfileField label="Email" value={email} />
        <ProfileField label="Password" isMasked />
        <ProfileField label="Date of Birth" value={dob} />
        <ProfileField label="Present Address" value={presentAddress} />
        <ProfileField label="Permanent Address" value={permanentAddress} />
        <ProfileField label="City" value={city} />
        <ProfileField label="Postal Code" value={postalCode} />
        <ProfileField label="Country" value={country} />
      </div>
    </div>
  )
}
