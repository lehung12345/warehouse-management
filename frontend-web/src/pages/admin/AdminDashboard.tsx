import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminLayout from './AdminLayout'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalImports: 0,
    totalExports: 0
  })
  const [loading, setLoading] = useState(true)

  const getAuthHeader = () => {
    const token = localStorage.getItem("token")
    return { headers: { Authorization: `Bearer ${token}` } }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080"

      // Fetch products count
      const productsRes = await axios.get(`${baseURL}/api/products`, getAuthHeader())
      const totalProducts = Array.isArray(productsRes.data) ? productsRes.data.length : 0

      // Fetch inventory total (dùng cùng endpoint với ReportPage để đảm bảo số liệu nhất quán)
      const stockRes = await axios.get(`${baseURL}/api/reports/stock`, getAuthHeader())
      const stockData = Array.isArray(stockRes.data) ? stockRes.data : []
      const totalStock = stockData.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0)

      // Fetch imports count
      const importsRes = await axios.get(`${baseURL}/api/orders/import`, getAuthHeader())
      const totalImports = Array.isArray(importsRes.data) ? importsRes.data.length : 0

      // Fetch exports count
      const exportsRes = await axios.get(`${baseURL}/api/orders/export`, getAuthHeader())
      const totalExports = Array.isArray(exportsRes.data) ? exportsRes.data.length : 0

      setStats({
        totalProducts,
        totalStock,
        totalImports,
        totalExports
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      {/* Main content */}
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
              <p className="stat-value">{loading ? "..." : stats.totalProducts}</p>
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
              <p className="stat-value">{loading ? "..." : stats.totalStock}</p>
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
              <p className="stat-value">{loading ? "..." : stats.totalImports}</p>
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
              <p className="stat-value">{loading ? "..." : stats.totalExports}</p>
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
    </AdminLayout>
  )
}