import { LogOut, X } from 'lucide-react'
import './LogoutConfirmationModal.css'

export const LogoutConfirmationModal = ({
  onClose,
  onConfirm,
}) => {
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container logout-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="logout-modal-icon-header">
            <div className="logout-icon-wrapper">
              <LogOut size={24} />
            </div>
            <div>
              <h2 className="modal-title">Are you sure you want to Logout?</h2>
              <p className="modal-subtitle">
                You will be logged out of your session and redirected to the login screen.
              </p>
            </div>
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

        <div className="modal-actions logout-modal-actions">
          <button
            type="button"
            className="modal-cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="danger-action-button"
            onClick={onConfirm}
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  )
}
