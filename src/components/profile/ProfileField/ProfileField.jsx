import './ProfileField.css'

export const ProfileField = ({
  label,
  value,
  isMasked = false,
}) => {
  const displayValue = isMasked ? '••••••••' : (value || 'Not provided')

  return (
    <div className="profile-field-item">
      <label className="profile-field-label">{label}</label>
      <div className="profile-field-value-box">
        <span className="profile-field-value-text">{displayValue}</span>
      </div>
    </div>
  )
}
