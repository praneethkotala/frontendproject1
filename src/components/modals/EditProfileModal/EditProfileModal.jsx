import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import './EditProfileModal.css'

export const EditProfileModal = ({
  profile,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(profile?.name || '')
  const [email, setEmail] = useState(profile?.email || '')
  const [dob, setDob] = useState(profile?.date_of_birth || '')
  const [presentAddress, setPresentAddress] = useState(profile?.present_address || '')
  const [permanentAddress, setPermanentAddress] = useState(profile?.permanent_address || '')
  const [city, setCity] = useState(profile?.city || '')
  const [postalCode, setPostalCode] = useState(profile?.postal_code || '')
  const [country, setCountry] = useState(profile?.country || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave({
        ...profile,
        name,
        email,
        date_of_birth: dob,
        present_address: presentAddress,
        permanent_address: permanentAddress,
        city,
        postal_code: postalCode,
        country,
      })
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container edit-profile-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Profile</h2>
            <p className="modal-subtitle">Update your personal and contact information.</p>
          </div>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-profile-name" className="form-label">Your Name</label>
              <input
                id="edit-profile-name"
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-profile-email" className="form-label">Email</label>
              <input
                id="edit-profile-email"
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-profile-dob" className="form-label">Date of Birth</label>
              <input
                id="edit-profile-dob"
                type="date"
                className="form-input"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-profile-country" className="form-label">Country</label>
              <input
                id="edit-profile-country"
                type="text"
                className="form-input"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-profile-city" className="form-label">City</label>
              <input
                id="edit-profile-city"
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-profile-postal" className="form-label">Postal Code</label>
              <input
                id="edit-profile-postal"
                type="text"
                className="form-input"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-profile-present" className="form-label">Present Address</label>
            <input
              id="edit-profile-present"
              type="text"
              className="form-input"
              value={presentAddress}
              onChange={(e) => setPresentAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="edit-profile-perm" className="form-label">Permanent Address</label>
            <input
              id="edit-profile-perm"
              type="text"
              className="form-input"
              value={permanentAddress}
              onChange={(e) => setPermanentAddress(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="modal-cancel-button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="button-spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
