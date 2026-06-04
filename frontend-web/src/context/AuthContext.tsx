import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { loginAPI } from '../api/auth'

interface User {
  id: number
  username: string
  email: string
  role: 'ADMIN' | 'STAFF'
  created_at: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Khôi phục session từ localStorage khi app khởi động
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser) as User
        // Set token and user regardless of role check - role validation happens at backend
        setToken(savedToken)
        setUser(parsedUser)
      } catch (e) {
        console.error('Error parsing user from localStorage:', e)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, email: string, password: string) => {
    const res = await loginAPI({ username, email, password, platform: 'web' })
    const { token: newToken, user: newUser } = res.data

    if (newUser.role !== 'ADMIN') {
      throw new Error('Thông tin bị sai yêu cầu nhập lại')
    }

    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))

    setToken(newToken)
    setUser(newUser as User)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isAdmin = () => user?.role === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải dùng trong AuthProvider')
  return ctx
}
