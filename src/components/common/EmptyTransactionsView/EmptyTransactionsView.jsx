import { Receipt, Plus } from 'lucide-react'
import './EmptyTransactionsView.css'

export const EmptyTransactionsView = ({
  message = 'No transactions found',
  description = 'You have not added any transactions in this view yet.',
  onAddTransactionClick,
}) => {
  return (
    <div className="empty-view-container">
      <div className="empty-view-icon-wrapper">
        <Receipt size={40} className="empty-icon" />
      </div>
      <h3 className="empty-view-title">{message}</h3>
      <p className="empty-view-description">{description}</p>
      {onAddTransactionClick && (
        <button
          type="button"
          className="empty-view-add-button"
          onClick={onAddTransactionClick}
        >
          <Plus size={16} />
          <span>Add Transaction</span>
        </button>
      )}
    </div>
  )
}
