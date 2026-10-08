import './LoaderView.css'

export const LoaderView = ({ message = 'Loading financial data...' }) => {
  return (
    <div className="loader-container" role="status" aria-live="polite">
      <div className="loader-spinner" />
      <p className="loader-message">{message}</p>
    </div>
  )
}
