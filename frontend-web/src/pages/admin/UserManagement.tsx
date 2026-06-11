import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  getStaffListAPI,
  createStaffAPI,
  editStaffAPI,
  deleteStaffAPI,
  resetPasswordAPI,
  type StaffUser,
} from '../../api/auth'
import AdminLayout from './AdminLayout'

type ModalMode = 'create' | 'edit' | 'reset-password' | null

export default function UserManagement() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [staffList, setStaffList] = useState<StaffUser[]>([])
  const [total, setTotal] = useState(0)
  const [isLoadingList, setIsLoadingList] = useState(true)

  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null)

  const [formUsername, setFormUsername] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [showFormPassword, setShowFormPassword] = useState(false)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<StaffUser | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchStaff = useCallback(async () => {
    setIsLoadingList(true)
    try {
      const res = await getStaffListAPI()
      setStaffList(res.data.users ?? [])
      setTotal(res.data.total ?? 0)
    } catch {
      setStaffList([])
    } finally {
      setIsLoadingList(false)
    }
  }, [])

  const filteredStaffList = (() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) return staffList
    return staffList.filter((s) => {
      const username = (s.username || '').toLowerCase()
      const email = (s.email || '').toLowerCase()
      return username.includes(q) || email.includes(q)
    })
  })()

  useEffect(() => { fetchStaff() }, [fetchStaff])

  const openCreateModal = () => {
    setFormUsername(''); setFormEmail(''); setFormPassword('')
    setFormError(''); setFormSuccess(''); setShowFormPassword(false)
    setModalMode('create')
  }

  const openEditModal = (staff: StaffUser) => {
    setSelectedUser(staff); setFormUsername(staff.username); setFormEmail(staff.email)
    setFormPassword(''); setFormError(''); setFormSuccess('')
    setModalMode('edit')
  }

  const openResetModal = (staff: StaffUser) => {
    setSelectedUser(staff); setFormPassword('')
    setFormError(''); setFormSuccess(''); setShowFormPassword(false)
    setModalMode('reset-password')
  }

  const closeModal = () => {
    setModalMode(null); setSelectedUser(null)
    setFormError(''); setFormSuccess('')
  }

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(''); setFormSuccess('')
    if (!formUsername.trim() || !formEmail.trim() || !formPassword.trim()) { setFormError('Vui lòng điền đầy đủ thông tin'); return }
    if (formPassword.length < 6) { setFormError('Mật khẩu tối thiểu 6 ký tự'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formEmail.trim())) { setFormError('Email không hợp lệ'); return }
    setIsFormSubmitting(true)
    try {
      await createStaffAPI({ username: formUsername.trim(), email: formEmail.trim().toLowerCase(), password: formPassword })
      setFormSuccess('✅ Tạo tài khoản nhân viên thành công!')
      fetchStaff(); setTimeout(() => closeModal(), 1500)
    } catch (err: unknown) {
      setFormError((err as any)?.response?.data?.error || 'Tạo tài khoản thất bại')
    } finally { setIsFormSubmitting(false) }
  }

  const handleEditStaff = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(''); setFormSuccess('')
    if (!formUsername.trim() || !formEmail.trim()) { setFormError('Vui lòng điền đầy đủ thông tin'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formEmail.trim())) { setFormError('Email không hợp lệ'); return }
    setIsFormSubmitting(true)
    try {
      await editStaffAPI(selectedUser!.id, { username: formUsername.trim(), email: formEmail.trim().toLowerCase() })
      setFormSuccess('✅ Cập nhật thông tin thành công!')
      fetchStaff(); setTimeout(() => closeModal(), 1500)
    } catch (err: unknown) {
      setFormError((err as any)?.response?.data?.error || 'Cập nhật thất bại')
    } finally { setIsFormSubmitting(false) }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setFormError(''); setFormSuccess('')
    if (!formPassword.trim() || formPassword.length < 6) { setFormError('Mật khẩu mới tối thiểu 6 ký tự'); return }
    setIsFormSubmitting(true)
    try {
      await resetPasswordAPI(selectedUser!.id, formPassword)
      setFormSuccess('✅ Reset mật khẩu thành công!')
      setTimeout(() => closeModal(), 1500)
    } catch { setFormError('Reset mật khẩu thất bại') }
    finally { setIsFormSubmitting(false) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteStaffAPI(deleteTarget.id)
      setDeleteTarget(null); fetchStaff()
    } catch (err: unknown) {
      alert((err as any)?.response?.data?.error || 'Xóa thất bại')
    }
  }

  return (
    <AdminLayout>
      <style>{`
        .staff-table-scroll::-webkit-scrollbar { width: 5px; }
        .staff-table-scroll::-webkit-scrollbar-track { background: transparent; }
        .staff-table-scroll::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
        .staff-table-scroll::-webkit-scrollbar-thumb:hover { background: #4B5563; }
        .staff-table-scroll { scrollbar-width: thin; scrollbar-color: #374151 transparent; }
      `}</style>

      <header className="dashboard-header">
        <div>
          <h1>Quản lý nhân viên</h1>
          <p>Tạo và quản lý tài khoản nhân viên kho</p>
        </div>
        <button className="btn-primary" onClick={openCreateModal}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tạo tài khoản
        </button>
      </header>

      {/* Stats */}
      <div className="users-stats">
        <div className="user-stat-chip">
          <span className="chip-icon">👥</span>
          <span>Tổng nhân viên: <strong>{total}</strong></span>
        </div>
        <div className="user-stat-chip">
          <span className="chip-icon">🟢</span>
          <span>Đang hoạt động: <strong>{total}</strong></span>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'var(--bg-overlay)', border: '1px solid #1f2937',
          borderRadius: '12px', padding: '4px 16px',
        }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm nhân viên theo username hoặc email..."
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#f3f4f6', fontSize: '14px', height: '44px',
            }}
          />
          {searchTerm.trim() && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                background: '#1f2937', color: '#9ca3af', border: 'none',
                padding: '6px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
              }}
            >
              ✕ Xóa lọc
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-container" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoadingList ? (
          <div className="table-loading">
            <div className="loading-spinner" />
            <p>Đang tải danh sách...</p>
          </div>
        ) : staffList.length === 0 ? (
          <div className="table-empty">
            <span>👥</span>
            <p>Chưa có nhân viên nào</p>
            <button className="btn-primary" onClick={openCreateModal}>Tạo nhân viên đầu tiên</button>
          </div>
        ) : filteredStaffList.length === 0 ? (
          <div className="table-empty">
            <span>👤</span>
            <p>Không tìm thấy nhân viên phù hợp với từ khóa "{searchTerm}"</p>
            <button className="btn-primary" onClick={() => setSearchTerm('')}>Xóa bộ lọc tìm kiếm</button>
          </div>
        ) : (
          /* Scroll wrapper */
          <div className="staff-table-scroll" style={{ maxHeight: '520px', overflowY: 'auto' }}>
            <table className="data-table" style={{ width: '100%' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaffList.map((s, idx) => (
                  <tr key={s.id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div className="td-user">
                        <div className="td-avatar">{(s.username || '?')[0]?.toUpperCase()}</div>
                        <span>{s.username}</span>
                      </div>
                    </td>
                    <td>{s.email}</td>
                    <td><span className="role-tag staff-tag">STAFF</span></td>
                    <td>{s.created_at}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-icon btn-reset" title="Sửa thông tin" onClick={() => openEditModal(s)} style={{ color: '#10B981' }}>
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="btn-icon btn-reset" title="Reset mật khẩu" onClick={() => openResetModal(s)}>
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                        <button className="btn-icon btn-delete" title="Xóa" onClick={() => setDeleteTarget(s)}>
                          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create */}
      {modalMode === 'create' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Tạo tài khoản nhân viên</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleCreateStaff} className="modal-form" noValidate>
              <div className="form-group">
                <label>Username <span className="required">*</span></label>
                <input type="text" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} placeholder="Tối thiểu 3 ký tự" autoFocus />
              </div>
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="example@company.com" />
              </div>
              <div className="form-group">
                <label>Mật khẩu <span className="required">*</span></label>
                <div className="input-wrapper">
                  <input type={showFormPassword ? 'text' : 'password'} value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" />
                  <button type="button" className="toggle-password" onClick={() => setShowFormPassword(!showFormPassword)} tabIndex={-1}>
                    {showFormPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="modal-role-info">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Tài khoản sẽ được gán role <strong>STAFF</strong> tự động
              </div>
              {formError && <div className="error-banner"><span>{formError}</span></div>}
              {formSuccess && <div className="success-banner"><span>{formSuccess}</span></div>}
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={isFormSubmitting}>
                  {isFormSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit */}
      {modalMode === 'edit' && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Sửa tài khoản nhân viên</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <form onSubmit={handleEditStaff} className="modal-form" noValidate>
              <div className="form-group">
                <label>Username <span className="required">*</span></label>
                <input type="text" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} placeholder="Tối thiểu 3 ký tự" autoFocus />
              </div>
              <div className="form-group">
                <label>Email <span className="required">*</span></label>
                <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="example@company.com" />
              </div>
              {formError && <div className="error-banner"><span>{formError}</span></div>}
              {formSuccess && <div className="success-banner"><span>{formSuccess}</span></div>}
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={isFormSubmitting}>
                  {isFormSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Reset Password */}
      {modalMode === 'reset-password' && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reset mật khẩu</h3>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>
            <p className="modal-subtitle">Đặt lại mật khẩu cho nhân viên <strong>{selectedUser.username}</strong></p>
            <form onSubmit={handleResetPassword} className="modal-form">
              <div className="form-group">
                <label>Mật khẩu mới <span className="required">*</span></label>
                <div className="input-wrapper">
                  <input type={showFormPassword ? 'text' : 'password'} value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="Tối thiểu 6 ký tự" autoFocus />
                  <button type="button" className="toggle-password" onClick={() => setShowFormPassword(!showFormPassword)} tabIndex={-1}>
                    {showFormPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              {formError && <div className="error-banner"><span>{formError}</span></div>}
              {formSuccess && <div className="success-banner"><span>{formSuccess}</span></div>}
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>Hủy</button>
                <button type="submit" className="btn-primary" disabled={isFormSubmitting}>
                  {isFormSubmitting ? 'Đang reset...' : 'Xác nhận reset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="modal-box modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Xác nhận xóa</h3>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div className="delete-confirm-body">
              <span className="delete-icon">⚠️</span>
              <p>Bạn có chắc muốn xóa tài khoản nhân viên <strong>{deleteTarget.username}</strong> không?</p>
              <p className="delete-warning">Hành động này không thể hoàn tác!</p>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setDeleteTarget(null)}>Hủy</button>
              <button className="btn-danger" onClick={handleDelete}>Xóa tài khoản</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}