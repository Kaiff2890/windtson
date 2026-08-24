import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [adminMode, setAdminMode] = useState(false)
  const [error, setError] = useState('')
  const { login, logout } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await login({ identifier, password })
      if (adminMode && user.role !== 'ADMIN') {
        logout()
        throw new Error('This account does not have admin access')
      }
      navigate(adminMode ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{adminMode ? 'Admin Login' : 'Login'}</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Mobile or Email</label>
          <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="mt-1 block w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border rounded p-2" required />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex items-center justify-between">
          <button className="px-4 py-2 bg-sky-600 text-white rounded">Login</button>
          <Link to="/register" className="text-sm text-sky-600">Create Account</Link>
        </div>
        <div className="mt-4">
          <button type="button" onClick={() => { setAdminMode(!adminMode); setError('') }} className="w-full px-4 py-2 bg-gray-800 text-white rounded">
            {adminMode ? 'Login as User' : 'Login as Admin'}
          </button>
        </div>
      </form>
    </div>
  )
}
