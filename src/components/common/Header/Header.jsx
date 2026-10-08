import { Plus, Edit3 } from 'lucide-react'
import './Header.css'

export const Header = ({
  title,
  onAddTransactionClick,
  onEditProfileClick,
}) => {
  return (
    <header className="page-header">
      <div className="page-header-title-container">
        <h1 className="page-header-title">{title}</h1>
      </div>

      <div className="page-header-actions">
        {onAddTransactionClick && (
          <button
            type="button"
            className="primary-action-button"
            onClick={onAddTransactionClick}
            aria-label="Add Transaction"
          >
            <Plus size={18} className="button-icon" />
            <span>Add Transaction</span>
          </button>
        )}

        {onEditProfileClick && (
          <button
            type="button"
            className="secondary-action-button"
            onClick={onEditProfileClick}
            aria-label="Edit Profile"
          >
            <Edit3 size={16} className="button-icon" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>
    </header>
  )
}
