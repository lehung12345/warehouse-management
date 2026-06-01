import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, user, isLoading } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Nếu đã đăng nhập thì redirect ngay
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/admin', { replace: true })
    }
  }, [user, isLoading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ Username, Email và Mật khẩu')
      return
    }
    setError('')
    setIsSubmitting(true)
    try {
      await login(username.trim(), email.trim().toLowerCase(), password)
      // redirect sẽ xảy ra qua useEffect
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (err as Error).message ||
        'Đăng nhập thất bại. Vui lòng thử lại.'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-root">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-orb orb-1" />
        <div className="login-bg-orb orb-2" />
        <div className="login-bg-orb orb-3" />
        <div className="login-grid" />
      </div>

      <div className="login-container">
        {/* Left panel – branding */}
        <div className="login-brand">
          <div className="brand-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="14" fill="url(#brandGrad)" />
              <path d="M10 18L24 10L38 18V30L24 38L10 30V18Z" stroke="white" strokeWidth="2.5" fill="none" />
              <path d="M24 10V38M10 18L38 30M38 18L10 30" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
              <defs>
                <linearGradient id="brandGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366F1" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="brand-name">WareFlow</h1>
          <p className="brand-tagline">Hệ thống quản lý kho thông minh</p>

          <div className="brand-features">
            <div className="brand-feature">
              <span className="feature-icon">📦</span>
              <span>Quản lý tồn kho real-time</span>
            </div>
            <div className="brand-feature">
              <span className="feature-icon">📱</span>
              <span>Quét QR & RFID tức thì</span>
            </div>
            <div className="brand-feature">
              <span className="feature-icon">📊</span>
              <span>Báo cáo & biểu đồ trực quan</span>
            </div>
            <div className="brand-feature">
              <span className="feature-icon">🔐</span>
              <span>Bảo mật JWT, phân quyền rõ ràng</span>
            </div>
          </div>
        </div>

        {/* Right panel – form */}
        <div className="login-form-panel">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Đăng nhập</h2>
              <p>Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              {/* Username */}
              <div className={`form-group ${username ? 'has-value' : ''}`}>
                <label htmlFor="username">Username <span className="required">*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập username"
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              {/* Email */}
              <div className={`form-group ${email ? 'has-value' : ''}`}>
                <label htmlFor="email">Email <span className="required">*</span></label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`form-group ${password ? 'has-value' : ''}`}>
                <label htmlFor="password">Mật khẩu</label>
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="error-banner">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`btn-login ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
                id="login-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Footer info */}
            <div className="login-footer">
              <div className="role-badges">
                <span className="role-badge admin-badge">
                  <span className="badge-dot" />
                  Admin → Web
                </span>
              </div>
              <p className="login-hint">
                Tài khoản nhân viên được tạo bởi Admin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
