import { Link } from 'react-router-dom'
import { FileQuestion, Home } from 'lucide-react'
import './NotFoundPage.css'

export const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="not-found-icon-wrapper">
          <FileQuestion size={48} />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page Not Found</h2>
        <p className="not-found-description">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/dashboard" className="not-found-home-btn">
          <Home size={18} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  )
}
