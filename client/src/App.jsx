import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import GetStarted from './pages/GetStarted'
import Applications from './pages/Applications'
import Careers from './pages/Careers'
import AdminApplications from './pages/AdminApplications'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">Windtson Info</div>
            <nav className="hidden md:flex gap-6 ml-8">
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/what-we-do">What We Do</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/contact">Contact</Link>
            </nav>
          </div>

          <AuthProvider>
            <AuthLinks />
          </AuthProvider>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 py-10">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/get-started" element={<ProtectedRoute><GetStarted /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </AuthProvider>
      </main>

      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-6 text-sm text-slate-600">© 2026 Windtson Info</div>
      </footer>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please <Link to="/login">login</Link></div>
  return children
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please <Link to="/login">login</Link></div>
  if (user.role !== 'ADMIN') return <div>Administrator access required. <Link to="/dashboard">Return to dashboard</Link></div>
  return children
}

function AuthLinks() {
  const { user } = useAuth()
  return (
    <div className="flex items-center gap-3">
      <Link to="/careers" className="hidden md:inline">Careers</Link>
      {user?.role === 'ADMIN' && <Link to="/admin" className="px-4 py-2 border rounded">Admin</Link>}
      {!user && <Link to="/login" className="px-4 py-2 border rounded">Login</Link>}
      {!user && <Link to="/register" className="px-4 py-2 bg-sky-600 text-white rounded">Get Started</Link>}
      {user && <Link to="/dashboard" className="px-4 py-2 border rounded">Dashboard</Link>}
    </div>
  )
}

function Landing() {
  return (
    <section className="grid gap-8">
      <div className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h1 className="text-4xl md:text-6xl font-extrabold">Build Your Career With Windtson Info</h1>
          <p className="mt-4 text-lg text-slate-600">Connecting candidates with the right opportunities and helping companies find great talent.</p>
          <div className="mt-6 flex gap-4">
            <Link to="/register" className="px-6 py-3 bg-sky-600 text-white rounded">Get Started</Link>
            <Link to="/what-we-do" className="px-6 py-3 border rounded">Learn More</Link>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="h-64 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-lg shadow-lg" />
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold">What We Do</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <Card title="Recruitment" />
          <Card title="Career Opportunities" />
          <Card title="Candidate Registration" />
          <Card title="Job Matching" />
          <Card title="Career Support" />
          <Card title="Employer Services" />
        </div>
      </section>
    </section>
  )
}

function Card({ title }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">Professional {title.toLowerCase()} services.</p>
    </div>
  )
}

