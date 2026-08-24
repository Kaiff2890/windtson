import React, { createContext, useContext, useState, useEffect } from 'react'
import API, { setAuthToken } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
      // try to fetch profile
      API.get('/users/me')
        .then((res) => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token')
          setAuthToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const register = async (payload) => {
    const res = await API.post('/auth/register', payload)
    const { token, user } = res.data
    localStorage.setItem('token', token)
    setAuthToken(token)
    setUser(user)
    return user
  }

  const login = async (payload) => {
    const res = await API.post('/auth/login', payload)
    const { token, user } = res.data
    localStorage.setItem('token', token)
    setAuthToken(token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAuthToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
