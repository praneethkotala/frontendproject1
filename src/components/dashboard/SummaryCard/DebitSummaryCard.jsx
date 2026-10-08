import { ArrowDownLeft } from 'lucide-react'
import './SummaryCard.css'

export const DebitSummaryCard = ({ amount }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount || 0)

  return (
    <div className="summary-card debit-card">
      <div className="summary-card-content">
        <p className="summary-card-amount debit-text">{formattedAmount}</p>
        <p className="summary-card-label">Debit</p>
      </div>
      <div className="summary-card-icon-container debit-icon-bg">
        <ArrowDownLeft size={32} className="debit-arrow-icon" />
      </div>
    </div>
  )
}
