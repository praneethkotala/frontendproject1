import { TRANSACTION_TABS } from '../../../constants/AppConstants'
import './TransactionTabs.css'

export const TransactionTabs = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="transaction-tabs-bar">
      <ul className="transaction-tabs-list" role="tablist">
        {TRANSACTION_TABS.map((tab) => {
          const isActive = activeTab === tab.type
          return (
            <li key={tab.id} className="transaction-tab-item" role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`transaction-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(tab.type)}
              >
                {tab.label}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
