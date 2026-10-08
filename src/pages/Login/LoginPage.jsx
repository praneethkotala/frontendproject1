import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Lock, Mail, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { DEMO_USER } from '../../constants/AppConstants'
import './LoginPage.css'

export const LoginPage = () => {
  const { authUser, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (authUser) {
      navigate('/dashboard', { replace: true })
    }
  }, [authUser, navigate])

  const validateEmail = (inputEmail) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(inputEmail)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setErrorMessage('Email address is required.')
      return
    }

    if (!validateEmail(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    if (!password) {
      setErrorMessage('Password is required.')
      return
    }

    try {
      setIsLoading(true)
      await login({ email: trimmedEmail, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickFillUser = () => {
    setEmail(DEMO_USER.EMAIL)
    setErrorMessage('')
  }

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo-circle">
            <span>$</span>
          </div>
          <h1 className="login-brand-title">Money Matters</h1>
          <p className="login-brand-tagline">Sign in to manage and track your finances</p>
        </div>

        {errorMessage && (
          <div className="login-error-alert" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <label htmlFor="login-email" className="login-label">
              Email Address
            </label>
            <div className="login-input-wrapper">
              <Mail size={18} className="login-field-icon" />
              <input
                id="login-email"
                type="email"
                className="login-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="login-input-group">
            <label htmlFor="login-password" className="login-label">
              Password
            </label>
            <div className="login-input-wrapper">
              <Lock size={18} className="login-field-icon" />
              <input
                id="login-password"
                type="password"
                className="login-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="login-spinner" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="login-demo-accounts">
          <p className="demo-accounts-title">Quick fill account email:</p>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="demo-pill-btn user-demo"
              onClick={handleQuickFillUser}
            >
              {DEMO_USER.USERNAME}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
