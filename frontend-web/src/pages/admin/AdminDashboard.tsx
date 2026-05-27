import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dashboard-root">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="url(#sideGrad)" />
            <path d="M10 18L24 10L38 18V30L24 38L10 30V18Z" stroke="white" strokeWidth="2.5" fill="none" />
            <defs>
              <linearGradient id="sideGrad" x1="0" y1="0" x2="48" y2="48">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <span>WareFlow</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Quản lý</div>
          <a className="nav-item active" href="/admin">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            Dashboard
          </a>
          <a className="nav-item" href="/admin/users">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Nhân viên
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <div>
              <p className="user-name">{user?.username}</p>
              <p className="user-role-badge">ADMIN</p>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} id="logout-btn">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h1>Dashboard</h1>
            <p>Xin chào, <strong>{user?.username}</strong>! Đây là tổng quan hệ thống kho.</p>
          </div>
        </header>

        {/* Stats cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon icon-blue">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="stat-label">Tổng sản phẩm</p>
              <p className="stat-value">—</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon icon-green">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="stat-label">Tổng tồn kho</p>
              <p className="stat-value">—</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon icon-purple">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="stat-label">Đơn nhập</p>
              <p className="stat-value">—</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon icon-orange">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 20l-8-8 8-8" />
              </svg>
            </div>
            <div>
              <p className="stat-label">Đơn xuất</p>
              <p className="stat-value">—</p>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="quick-actions">
          <h2>Thao tác nhanh</h2>
          <div className="action-grid">
            <button className="action-card" onClick={() => navigate('/admin/users')} id="goto-users-btn">
              <span className="action-icon">👨‍💼</span>
              <span>Quản lý nhân viên</span>
            </button>
            {/* <button className="action-card" id="goto-products-btn">
              <span className="action-icon">📦</span>
              <span>Quản lý sản phẩm</span>
            </button> */}
            <button
              className="action-card"
              id="goto-products-btn"
              onClick={() => navigate("/admin/products")}
            >
              <span className="action-icon">📦</span>
              <span>Quản lý sản phẩm</span>
            </button>
            <button
              className="action-card"
              onClick={() => navigate("/admin/inventory")}
            >
              <span className="action-icon">🏬</span>
              <span>Tồn kho</span>
            </button>
            <button
              className="action-card"
              onClick={() => navigate("/admin/orders")}
            >
              <span className="action-icon">📑</span>
              <span>Đơn hàng</span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/admin/locations")}
            >
              <span className="action-icon">📍</span>
              <span>Vị trí kho</span>
            </button>

            <button
              className="action-card"
              onClick={() => navigate("/admin/reports")}
            >
              <span className="action-icon">📈</span>
              <span>Báo cáo</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
