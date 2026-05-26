import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ReactNode } from 'react'

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

  // Chưa đăng nhập
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Sai role
  if (requiredRole && user.role !== requiredRole) {
    // ADMIN có thể xem cả staff page, nhưng STAFF không thể vào admin
    if (requiredRole === 'ADMIN') {
      return <Navigate to="/staff" replace />
    }
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
