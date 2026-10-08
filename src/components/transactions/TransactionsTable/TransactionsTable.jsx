import { format } from 'date-fns'
import { ArrowUpCircle, ArrowDownCircle, Edit2, Trash2 } from 'lucide-react'
import { USER_ROLES } from '../../../constants/AppConstants'
import './TransactionsTable.css'

export const TransactionsTable = ({
  transactions,
  userRole,
  onEditClick,
  onDeleteClick,
}) => {
  const isAdmin = userRole === USER_ROLES.ADMIN

  const formatDateString = (rawDate) => {
    try {
      return format(new Date(rawDate), 'dd MMM, hh:mm a')
    } catch {
      return rawDate || '-'
    }
  }

  const formatAmountString = (amount, type) => {
    const formatted = `$${Number(amount || 0).toLocaleString()}`
    return type === 'debit' ? `-${formatted}` : `+${formatted}`
  }

  return (
    <div className="full-transactions-table-card">
      <div className="full-transactions-table-wrapper">
        <table className="full-transactions-table">
          <thead>
            <tr>
              {isAdmin && <th>User ID</th>}
              <th>Transaction Name</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th className="action-col-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isDebit = tx.type === 'debit'
              const displayName = tx.transaction_name || tx.name || 'Transaction'

              return (
                <tr key={tx.id} className="tx-table-row">
                  {isAdmin && (
                    <td className="tx-userid-cell">
                      <span className="user-id-badge">User #{tx.user_id}</span>
                    </td>
                  )}
                  <td className="tx-name-cell">
                    <div className="tx-name-wrapper">
                      {isDebit ? (
                        <ArrowDownCircle size={20} className="icon-debit" />
                      ) : (
                        <ArrowUpCircle size={20} className="icon-credit" />
                      )}
                      <span className="tx-name-text">{displayName}</span>
                    </div>
                  </td>
                  <td className="tx-category-cell">
                    <span className="category-pill">{tx.category || '-'}</span>
                  </td>
                  <td className="tx-date-cell">{formatDateString(tx.date)}</td>
                  <td className={`tx-amount-cell ${isDebit ? 'debit' : 'credit'}`}>
                    {formatAmountString(tx.amount, tx.type)}
                  </td>
                  <td className="tx-actions-cell">
                    <div className="tx-action-buttons">
                      <button
                        type="button"
                        className="tx-action-btn edit-btn"
                        onClick={() => onEditClick(tx)}
                        title="Edit transaction"
                        aria-label="Edit transaction"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        className="tx-action-btn delete-btn"
                        onClick={() => onDeleteClick(tx)}
                        title="Delete transaction"
                        aria-label="Delete transaction"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
