import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Tự động gắn JWT token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Tự động redirect về login khi token hết hạn (401)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    role: string
    created_at: string
  }
}

export interface StaffUser {
  id: number
  username: string
  email: string
  role: string
  created_at: string
}

// ─── Auth ───────────────────────────────────────
export const loginAPI = (data: { username: string; email: string; password: string }) =>
  api.post<LoginResponse>('/auth/login', data)

// ─── Admin – User Management ────────────────────
export const getStaffListAPI = () =>
  api.get<{ users: StaffUser[]; total: number }>('/admin/users')

export const createStaffAPI = (data: {
  username: string
  email: string
  password: string
}) => api.post<{ message: string; user: StaffUser }>('/admin/users', data)

export const editStaffAPI = (id: number, data: {
  username: string
  email: string
}) => api.put<{ message: string; user: StaffUser }>(`/admin/users/${id}`, data)

export const deleteStaffAPI = (id: number) =>
  api.delete(`/admin/users/${id}`)

export const resetPasswordAPI = (id: number, new_password: string) =>
  api.put(`/admin/users/${id}/reset-password`, { new_password })

export default api
