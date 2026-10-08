import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import {
  TRANSACTION_TYPE_OPTIONS,
  TRANSACTION_CATEGORIES,
  VALIDATION_LIMITS,
} from '../../../constants/AppConstants'
import './AddTransactionModal.css'

export const AddTransactionModal = ({
  onClose,
  onSubmit,
}) => {
  const [transactionName, setTransactionName] = useState('')
  const [transactionType, setTransactionType] = useState('debit')
  const [category, setCategory] = useState('shopping')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
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
      // Format to ISO 8601 string
      const isoDate = new Date(date).toISOString()
      await onSubmit({
        name: trimmedName,
        type: transactionType,
        category,
        amount: numericAmount,
        date: isoDate,
      })
      onClose()
    } catch (err) {
      setErrorMessage(err.message || 'Failed to add transaction.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Add Transaction</h2>
            <p className="modal-subtitle">Enter details to record a new transaction.</p>
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
            <label htmlFor="add-tx-name" className="form-label">
              Transaction Name
            </label>
            <input
              id="add-tx-name"
              type="text"
              className="form-input"
              placeholder="e.g. Grocery Store"
              value={transactionName}
              maxLength={VALIDATION_LIMITS.TRANSACTION_NAME_MAX_LENGTH}
              onChange={(e) => setTransactionName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="add-tx-type" className="form-label">
                Transaction Type
              </label>
              <select
                id="add-tx-type"
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
              <label htmlFor="add-tx-category" className="form-label">
                Category
              </label>
              <select
                id="add-tx-category"
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
              <label htmlFor="add-tx-amount" className="form-label">
                Amount ($)
              </label>
              <input
                id="add-tx-amount"
                type="number"
                step="any"
                min="0.01"
                className="form-input"
                placeholder="100.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="add-tx-date" className="form-label">
                Date
              </label>
              <input
                id="add-tx-date"
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
                  <span>Adding...</span>
                </>
              ) : (
                'Add Transaction'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
