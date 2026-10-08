import { useState } from 'react'
import { AlertTriangle, X, Loader2 } from 'lucide-react'
import './DeleteConfirmationModal.css'

export const DeleteConfirmationModal = ({
  transaction,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleConfirm = async () => {
    try {
      setIsDeleting(true)
      setErrorMessage('')
      await onConfirm({ id: transaction.id })
      onClose()
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete transaction.')
      setIsDeleting(false)
    }
  }

  const transactionName = transaction?.transaction_name || transaction?.name || 'this transaction'

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container delete-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="delete-modal-icon-header">
            <div className="warning-icon-wrapper">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="modal-title">Are you sure you want to Delete?</h2>
              <p className="modal-subtitle">
                &ldquo;{transactionName}&rdquo; will be deleted immediately. You cannot undo this action.
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

        {errorMessage && (
          <div className="modal-error-banner" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="modal-actions delete-modal-actions">
          <button
            type="button"
            className="modal-cancel-button"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="danger-action-button"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="button-spinner" />
                <span>Deleting...</span>
              </>
            ) : (
              'Yes, Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
