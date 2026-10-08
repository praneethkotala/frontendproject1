import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppLayout } from '../layout/AppLayout'
import { LoginPage } from '../pages/Login/LoginPage'
import { DashboardPage } from '../pages/Dashboard/DashboardPage'
import { TransactionsPage } from '../pages/Transactions/TransactionsPage'
import { ProfilePage } from '../pages/Profile/ProfilePage'
import { NotFoundPage } from '../pages/NotFound/NotFoundPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated Application */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
