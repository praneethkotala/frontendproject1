import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoaderView } from '../components/common/LoaderView/LoaderView'

export const ProtectedRoute = () => {
  const { authUser, authLoading } = useAuth()

  if (authLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoaderView message="Verifying authentication session..." />
      </div>
    )
  }

  if (!authUser) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
