import { format } from 'date-fns'
import { ArrowUpCircle, ArrowDownCircle, Edit2, Trash2 } from 'lucide-react'
import './RecentTransactionsTable.css'

export const RecentTransactionsTable = ({
  transactions,
  onEditClick,
  onDeleteClick,
}) => {
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
    <div className="recent-transactions-card">
      <div className="recent-transactions-header">
        <h3 className="recent-transactions-title">Last Transactions</h3>
      </div>

      <div className="recent-transactions-table-wrapper">
        <table className="recent-transactions-table">
          <thead>
            <tr>
              <th>Transaction Name</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th className="actions-column-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const isDebit = tx.type === 'debit'
              const displayName = tx.transaction_name || tx.name || 'Transaction'

              return (
                <tr key={tx.id} className="recent-tx-row">
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
