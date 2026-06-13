import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = response.status === 204 ? null : await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data?.error || 'Request failed.')
    error.status = response.status
    throw error
  }
  return data
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [csrfToken, setCsrfToken] = useState('')
  const [initialized, setInitialized] = useState(null)
  const [loading, setLoading] = useState(true)

  async function refreshSession() {
    setLoading(true)
    try {
      const status = await request('/api/auth/status')
      setInitialized(status.initialized)
      if (status.initialized) {
        const session = await request('/api/auth/me')
        setUser(session.user)
        setCsrfToken(session.csrfToken)
      }
    } catch {
      setUser(null)
      setCsrfToken('')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { refreshSession() }, [])

  async function setup(values) {
    await request('/api/auth/setup', { method: 'POST', body: JSON.stringify(values) })
    setInitialized(true)
  }

  async function login(values) {
    const session = await request('/api/auth/login', { method: 'POST', body: JSON.stringify(values) })
    setUser(session.user)
    setCsrfToken(session.csrfToken)
  }

  async function logout() {
    await request('/api/auth/logout', { method: 'POST', headers: { 'x-csrf-token': csrfToken } })
    setUser(null)
    setCsrfToken('')
  }

  async function apiRequest(path, options = {}) {
    const method = String(options.method || 'GET').toUpperCase()
    const headers = { ...options.headers }
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) headers['x-csrf-token'] = csrfToken
    try {
      return await request(path, { ...options, headers })
    } catch (error) {
      if ([401, 403].includes(error.status)) await refreshSession()
      throw error
    }
  }

  return <AuthContext.Provider value={{ user, initialized, loading, login, logout, setup, refreshSession, apiRequest }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
