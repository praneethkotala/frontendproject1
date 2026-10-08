import { ArrowUpRight } from 'lucide-react'
import './SummaryCard.css'

export const CreditSummaryCard = ({ amount }) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount || 0)

  return (
    <div className="summary-card credit-card">
      <div className="summary-card-content">
        <p className="summary-card-amount credit-text">{formattedAmount}</p>
        <p className="summary-card-label">Credit</p>
      </div>
      <div className="summary-card-icon-container credit-icon-bg">
        <ArrowUpRight size={32} className="credit-arrow-icon" />
      </div>
    </div>
  )
}
