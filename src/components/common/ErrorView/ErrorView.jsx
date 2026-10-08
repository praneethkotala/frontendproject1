import { AlertTriangle, RotateCcw } from 'lucide-react'
import './ErrorView.css'

export const ErrorView = ({
  message = 'Something went wrong while fetching data. Please try again.',
  onRetry,
}) => {
  return (
    <div className="error-view-container" role="alert">
      <div className="error-icon-box">
        <AlertTriangle size={32} />
      </div>
      <h3 className="error-title">Unable to Load Data</h3>
      <p className="error-description">{message}</p>
      {onRetry && (
        <button type="button" className="retry-action-button" onClick={onRetry}>
          <RotateCcw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}
