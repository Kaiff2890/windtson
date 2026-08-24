import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminDashboard(){
  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-slate-500">Admin view</div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-sky-50 rounded">Users: <strong>—</strong></div>
        <div className="p-4 bg-sky-50 rounded">Open Jobs: <strong>—</strong></div>
        <div className="p-4 bg-sky-50 rounded">Applications: <strong>—</strong></div>
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
