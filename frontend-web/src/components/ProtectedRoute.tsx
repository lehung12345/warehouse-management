import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'ADMIN' | 'STAFF'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, token, isLoading } = useAuth()

  // Đang khôi phục session – chờ
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
      </div>
    )
  }

  // Chưa đăng nhập hoặc không có quyền
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
