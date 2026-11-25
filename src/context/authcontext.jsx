import { createContext, useContext, useState, useEffect } from 'react'
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await getMe()
      if (res.success) {
        setUser(res.data.user)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const res = await apiLogin({ email, password })
    if (res.success) {
      setUser(res.data.user)
    }
    return res
  }

  async function register(name, email, password, password_confirmation) {
    const res = await apiRegister({ name, email, password, password_confirmation })
    if (res.success) {
      setUser(res.data.user)
    }
    return res
  }

  async function logout() {
    try {
      await apiLogout()
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
