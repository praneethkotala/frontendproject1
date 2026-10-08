import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import {
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_CATEGORIES,
  VALIDATION_LIMITS,
} from '../../../constants/AppConstants'
import './UpdateTransactionModal.css'

export const UpdateTransactionModal = ({
  transaction,
  onClose,
  onSubmit,
}) => {
  const [transactionName, setTransactionName] = useState(
    transaction?.transaction_name || transaction?.name || ''
  )
  const [transactionType, setTransactionType] = useState(
    transaction?.type || 'debit'
  )
  const [category, setCategory] = useState(
    transaction?.category || 'shopping'
  )
  const [amount, setAmount] = useState(
    transaction?.amount ? String(transaction.amount) : ''
  )
  const [date, setDate] = useState(() => {
    if (transaction?.date) {
      try {
        return new Date(transaction.date).toISOString().split('T')[0]
      } catch {
        // fallback
      }
    }
    return new Date().toISOString().split('T')[0]
  })

  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const trimmedName = transactionName.trim()
    if (!trimmedName) {
      setErrorMessage('Transaction name is required.')
      return
    }

    if (trimmedName.length > VALIDATION_LIMITS.TRANSACTION_NAME_MAX_LENGTH) {
      setErrorMessage(`Transaction name cannot exceed ${VALIDATION_LIMITS.TRANSACTION_NAME_MAX_LENGTH} characters.`)
      return
    }

    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than zero.')
      return
    }

    if (!date) {
      setErrorMessage('Date is required.')
      return
    }

    try {
      setIsSubmitting(true)
      const isoDate = new Date(date).toISOString()
      await onSubmit({
        id: transaction.id,
        name: trimmedName,
        type: transactionType,
        category,
        amount: numericAmount,
        date: isoDate,
      })
      onClose()
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update transaction.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Transaction</h2>
            <p className="modal-subtitle">Update details for this transaction.</p>
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

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="edit-tx-name" className="form-label">
              Transaction Name
            </label>
            <input
              id="edit-tx-name"
              type="text"
              className="form-input"
              value={transactionName}
              maxLength={VALIDATION_LIMITS.TRANSACTION_NAME_MAX_LENGTH}
              onChange={(e) => setTransactionName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-tx-type" className="form-label">
                Transaction Type
              </label>
              <select
                id="edit-tx-type"
                className="form-select"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                {TRANSACTION_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-tx-category" className="form-label">
                Category
              </label>
              <select
                id="edit-tx-category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {TRANSACTION_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-tx-amount" className="form-label">
                Amount ($)
              </label>
              <input
                id="edit-tx-amount"
                type="number"
                step="any"
                min="0.01"
                className="form-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-tx-date" className="form-label">
                Date
              </label>
              <input
                id="edit-tx-date"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
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
                  <span>Updating...</span>
                </>
              ) : (
                'Update Transaction'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
