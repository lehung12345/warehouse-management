import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function StaffDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="staff-root">
      <div className="staff-bg">
        <div className="login-bg-orb orb-1" />
        <div className="login-bg-orb orb-2" />
      </div>

      <div className="staff-container">
        {/* Header */}
        <header className="staff-header">
          <div className="staff-brand">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="url(#staffGrad)" />
              <path d="M10 18L24 10L38 18V30L24 38L10 30V18Z" stroke="white" strokeWidth="2.5" fill="none" />
              <defs>
                <linearGradient id="staffGrad" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#10B981" />
                  <stop offset="1" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <span>WareFlow Staff</span>
          </div>
          <div className="staff-user-info">
            <div className="staff-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <div>
              <p>{user?.username}</p>
              <span className="role-tag staff-tag">STAFF</span>
            </div>
            <button className="btn-logout" onClick={handleLogout} id="staff-logout-btn">
              Đăng xuất
            </button>
          </div>
        </header>

        {/* Welcome */}
        <div className="staff-welcome">
          <h1>Xin chào, {user?.username}! 👋</h1>
          <p>Bạn đã đăng nhập thành công vào hệ thống kho WareFlow.</p>
          <p className="staff-note">
            📱 Để thao tác nhập/xuất kho, vui lòng sử dụng <strong>ứng dụng di động</strong>.
          </p>
        </div>

        {/* Quick info */}
        <div className="staff-cards">
          <div className="staff-info-card">
            <span className="staff-card-icon">📋</span>
            <h3>Đơn hàng</h3>
            <p>Xem danh sách đơn nhập/xuất được giao</p>
          </div>
          <div className="staff-info-card">
            <span className="staff-card-icon">📷</span>
            <h3>Quét QR</h3>
            <p>Quét mã QR sản phẩm để xử lý nhanh</p>
          </div>
          <div className="staff-info-card">
            <span className="staff-card-icon">📍</span>
            <h3>Vị trí kho</h3>
            <p>Chọn kho → kệ → ô để lưu sản phẩm</p>
          </div>
        </div>
      </div>
    </div>
  )
}
