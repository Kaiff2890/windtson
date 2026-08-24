import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'

export default function AdminDashboard(){
  const [stats, setStats] = useState({ users: null, jobs: null, applications: null })
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([API.get('/users'), API.get('/jobs'), API.get('/applications')])
      .then(([users, jobs, applications]) => setStats({
        users: users.data.users.length,
        jobs: jobs.data.jobs.length,
        applications: applications.data.applications.length,
      }))
      .catch(() => setError('Unable to load admin metrics. Please try again.'))
  }, [])

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-slate-500">Admin view</div>
      </div>

      {error && <p className="mt-4 text-red-600">{error}</p>}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-sky-50 rounded">Users: <strong>{stats.users ?? '...'}</strong></div>
        <div className="p-4 bg-sky-50 rounded">Open Jobs: <strong>{stats.jobs ?? '...'}</strong></div>
        <div className="p-4 bg-sky-50 rounded">Applications: <strong>{stats.applications ?? '...'}</strong></div>
      </div>

      <section className="mt-6">
        <h2 className="font-semibold">Quick Links</h2>
        <div className="mt-3 flex gap-3">
          <Link to="/admin/applications" className="px-4 py-2 bg-white border rounded">View Applications</Link>
          <Link to="/admin/users" className="px-4 py-2 bg-white border rounded">View Users</Link>
        </div>
      </section>
    </div>
  )
}
