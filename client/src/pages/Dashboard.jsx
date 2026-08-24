import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user, logout } = useAuth()
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {user?.name || 'User'}</h1>
        <button onClick={logout} className="px-3 py-2 border rounded">Logout</button>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Profile completion: <strong>50%</strong></div>
        <div className="p-4 bg-white rounded shadow">Available jobs: <strong>12</strong></div>
        <div className="p-4 bg-white rounded shadow">Applications: <strong>3</strong></div>
      </div>
    </div>
  )
}
