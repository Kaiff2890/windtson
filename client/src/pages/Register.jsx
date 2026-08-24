import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Passwords do not match')
    try {
      await register({ name, mobile, email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full border p-2 rounded" required />
        <input value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile Number" className="w-full border p-2 rounded" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border p-2 rounded" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full border p-2 rounded" required />
        <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm Password" className="w-full border p-2 rounded" required />
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-sky-600 text-white rounded">Create Account</button>
        </div>
      </form>
    </div>
  )
}
