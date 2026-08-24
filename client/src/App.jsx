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
    <AuthProvider>
      <div className="site-shell">
        <header className="site-header">
          <Link to="/" className="brand"><span className="brand-mark">W</span><span>WINSTON <small>/ TECH</small></span></Link>
          <nav className="main-nav"><Link to="/">Home</Link><Link to="/careers">Careers</Link><Link to="/what-we-do">Business</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link></nav>
          <AuthLinks />
        </header>

        <main className="site-main">
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
        </main>

        <footer className="site-footer"><div><Link to="/" className="brand"><span className="brand-mark">W</span><span>WINSTON <small>/ TECH</small></span></Link><p>Where ambition meets success.</p></div><div className="footer-nav"><Link to="/careers">Careers</Link><Link to="/what-we-do">Business</Link><Link to="/about">Why Winston</Link><Link to="/contact">Enquiry</Link></div><small>© 2026 Winston Technologies</small></footer>
      </div>
    </AuthProvider>
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
  return <section className="landing"><div className="hero-copy"><span className="eyebrow">INDEPENDENT TECHNOLOGY PARTNER / 2026</span><h1>Where ambition<br /><em>meets success.</em></h1><p>Connecting people, opportunities, businesses and technology.</p><div className="hero-actions"><Link to="/what-we-do" className="primary-button">Explore Winston <span>↗</span></Link><Link to="/contact" className="secondary-button">General enquiry <span>→</span></Link></div></div><div className="hero-art"><div className="orbit orbit-one"></div><div className="orbit orbit-two"></div><div className="art-label">PEOPLE<br />+<br />POSSIBILITY</div></div><section className="intro-band"><span className="eyebrow dark">01 / WHY WINSTON</span><div><h2>Ambition is a direction.<br /><span>We help you find the way.</span></h2><p>We bring people, opportunities, business and technology together to create meaningful growth. Practical solutions designed to move you forward.</p><Link to="/about" className="inline-link">More about Winston ↗</Link></div></section><section className="services-band"><span className="eyebrow">02 / EXPLORE WHAT WE DO</span><h2>Pick your <em>direction.</em></h2><div className="service-cards"><Link to="/careers"><small>01</small><h3>Careers</h3><p>Find opportunities that fit your ambition.</p><span>Explore ↗</span></Link><Link to="/what-we-do"><small>02</small><h3>Business</h3><p>Practical solutions for meaningful growth.</p><span>Explore ↗</span></Link><Link to="/what-we-do"><small>03</small><h3>Technology</h3><p>Digital systems built for what’s next.</p><span>Explore ↗</span></Link></div></section></section>
}

