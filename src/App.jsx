import { useMemo, useState } from 'react'
import './App.css'

const featureCards = [
  {
    title: 'People First',
    description: 'Solutions built around real people and real needs.',
  },
  {
    title: 'Technology Driven',
    description: 'Modern technology to solve practical problems.',
  },
  {
    title: 'Growth Focused',
    description: 'Helping individuals and businesses move forward.',
  },
  {
    title: 'Future Ready',
    description: 'Building solutions for what\'s next.',
  },
]

const serviceGroups = [
  {
    label: 'Careers',
    items: ['Find a Job', 'Internships', 'Remote Jobs', 'Overseas Jobs'],
  },
  {
    label: 'Business',
    items: ['Business Consulting', 'Hiring Talent'],
  },
  {
    label: 'Technology',
    items: ['Website Development', 'Software Development', 'AI & Automation'],
  },
  {
    label: 'Company',
    items: ['Why Winston', 'Enquiry', 'Contact'],
  },
]

const userCredentials = {
  phone: '8151910971',
  password: '123456',
}

const adminCredentials = {
  email: 'admin@winston.com',
  password: 'admin123',
}

const initialCandidateForm = {
  name: '',
  phone: '',
  email: '',
  password: '',
  role: '',
  location: '',
}

const users = [
  {
    id: 1,
    name: 'Ava Thompson',
    email: 'ava.thompson@winston.com',
    role: 'Business Consultant',
    status: 'Active',
    joined: '12 Jan 2026',
    location: 'New York',
  },
  {
    id: 2,
    name: 'Marcus Lee',
    email: 'marcus.lee@winston.com',
    role: 'Frontend Developer',
    status: 'Active',
    joined: '04 Mar 2026',
    location: 'London',
  },
  {
    id: 3,
    name: 'Priya Nair',
    email: 'priya.nair@winston.com',
    role: 'AI Specialist',
    status: 'Pending',
    joined: '18 Apr 2026',
    location: 'Singapore',
  },
  {
    id: 4,
    name: 'Daniel Brooks',
    email: 'daniel.brooks@winston.com',
    role: 'HR Manager',
    status: 'Active',
    joined: '09 Feb 2026',
    location: 'Toronto',
  },
  {
    id: 5,
    name: 'Sofia Martinez',
    email: 'sofia.martinez@winston.com',
    role: 'Product Strategist',
    status: 'Inactive',
    joined: '25 May 2026',
    location: 'Madrid',
  },
  {
    id: 6,
    name: 'Noah Patel',
    email: 'noah.patel@winston.com',
    role: 'Software Engineer',
    status: 'Active',
    joined: '03 Jun 2026',
    location: 'Dubai',
  },
]

function App() {
  const [showLogin, setShowLogin] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const [showCandidateForm, setShowCandidateForm] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [loginData, setLoginData] = useState({
    identifier: userCredentials.phone,
    password: '',
  })
  const [candidateForm, setCandidateForm] = useState(initialCandidateForm)
  const [allUsers, setAllUsers] = useState(users)
  const [error, setError] = useState('')

  const stats = useMemo(() => {
    const activeUsers = allUsers.filter((user) => user.status === 'Active').length
    const pendingUsers = allUsers.filter((user) => user.status === 'Pending').length
    const inactiveUsers = allUsers.filter((user) => user.status === 'Inactive').length

    return {
      total: allUsers.length,
      active: activeUsers,
      pending: pendingUsers,
      inactive: inactiveUsers,
    }
  }, [allUsers])

  const handleChange = (event) => {
    const { name, value } = event.target
    setError('')
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCandidateFormChange = (event) => {
    const { name, value } = event.target
    setCandidateForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = (event) => {
    event.preventDefault()

    const enteredIdentifier = loginData.identifier.trim()
    const enteredPassword = loginData.password.trim()

    const isAdminLogin =
      enteredIdentifier.toLowerCase() === adminCredentials.email &&
      enteredPassword === adminCredentials.password

    const isUserLogin =
      enteredIdentifier.length > 0 && enteredPassword.length > 0

    if (isAdminLogin) {
      setError('')
      setIsAuthenticated(true)
      setIsAdminUser(true)
      setShowLogin(false)
      setShowCandidateForm(false)
      setSubmitSuccess(false)
      return
    }

    if (isUserLogin) {
      setError('')
      setIsAuthenticated(true)
      setIsAdminUser(false)
      setShowLogin(false)
      setShowCandidateForm(true)
      setSubmitSuccess(false)
      return
    }

    setError('Invalid credentials. Please try again.')
  }

  const handleCandidateSubmit = (event) => {
    event.preventDefault()

    const newCandidate = {
      id: Date.now(),
      name: candidateForm.name,
      email: candidateForm.email,
      phone: candidateForm.phone,
      password: candidateForm.password,
      role: candidateForm.role,
      status: 'Active',
      joined: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      location: candidateForm.location || 'Not specified',
    }

    setAllUsers((prev) => [newCandidate, ...prev])
    setCandidateForm(initialCandidateForm)
    setShowCandidateForm(false)
    setSubmitSuccess(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsAdminUser(false)
    setShowCandidateForm(false)
    setSubmitSuccess(false)
    setLoginData({ identifier: userCredentials.phone, password: '' })
    setCandidateForm(initialCandidateForm)
    setError('')
  }

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand" aria-label="Winston Technologies logo">
          <div className="brand-mark">WT</div>
          <div className="brand-copy">
            <span>WINSTON</span>
            <span>TECHNOLOGIES</span>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#">Home</a>
          <a href="#why-winston">Why Winston</a>
          <a href="#explore">Explore</a>
          <a href="#contact">Contact</a>
        </nav>

        {isAuthenticated ? (
          <button type="button" className="nav-cta" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button
            type="button"
            className="nav-cta"
            onClick={() => {
              setLoginData({ identifier: userCredentials.phone, password: '' })
              setError('')
              setShowLogin(true)
            }}
          >
            Login
          </button>
        )}
      </header>

      {showLogin && !isAuthenticated && (
        <div className="modal-backdrop" onClick={() => setShowLogin(false)}>
          <div className="login-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <p className="eyebrow eyebrow-dark">Secure Portal</p>
                <h2>Login</h2>
              </div>
              <button
                type="button"
                className="close-btn"
                onClick={() => {
                  setLoginData({ identifier: userCredentials.phone, password: '' })
                  setError('')
                  setShowLogin(false)
                }}
              >
                ×
              </button>
            </div>

            <form className="login-form" onSubmit={handleLogin}>
              <label>
                <span>Phone Number / Email</span>
                <input
                  type="text"
                  name="identifier"
                  value={loginData.identifier}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  required
                />
              </label>

              {error && <p className="login-error">{error}</p>}

              <button type="submit" className="login-btn">
                Sign in
              </button>
            </form>
          </div>
        </div>
      )}

      {!isAuthenticated ? (
        <main>
          <section className="hero-section">
            <div className="hero-content">
              <p className="eyebrow">Where Ambition Meets Success.</p>
              <h1>Because ambition deserves the right direction.</h1>
              <p className="lead">
                At Winston Technologies, we bring people, opportunities, business and
                technology together to create meaningful growth. Whether you&apos;re
                pursuing your next career opportunity or growing your business, we
                provide practical solutions designed to move you forward.
              </p>

              <div className="hero-actions">
                <a href="#explore" className="primary-btn">
                  Explore Winston
                </a>
                <a href="#contact" className="secondary-btn">
                  General Enquiry
                </a>
              </div>
            </div>
          </section>

          <section className="value-section" id="why-winston">
            {featureCards.map((card) => (
              <article key={card.title} className="value-card">
                <div className="card-icon" aria-hidden="true"></div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </article>
            ))}
          </section>

          <section className="explore-section" id="explore">
            <div className="section-intro">
              <p className="eyebrow eyebrow-dark">Explore what we do</p>
              <h2>
                Careers, business solutions and technology — pick the direction that
                matches your ambition.
              </h2>
            </div>

            <div className="service-grid">
              {serviceGroups.map((group) => (
                <article key={group.label} className="service-card">
                  <h3>{group.label}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>
                        <a href="#">{item}</a>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="cta-section" id="contact">
            <div className="cta-copy">
              <p className="eyebrow">Let&apos;s build what&apos;s next.</p>
              <h2>
                Whether you&apos;re looking for your next opportunity or looking to grow
                your business, Winston Technologies is ready to help.
              </h2>
            </div>

            <a href="#explore" className="cta-btn">
              Get Started
            </a>
          </section>
        </main>
      ) : isAdminUser ? (
        <main className="admin-dashboard">
          <section className="dashboard-topbar">
            <div>
              <p className="eyebrow eyebrow-dark">Operations Overview</p>
              <h2>Admin dashboard</h2>
            </div>
            <button type="button" className="outline-btn" onClick={handleLogout}>
              Sign out
            </button>
          </section>

          <section className="stats-grid">
            <article className="stat-card primary">
              <span>Total Users</span>
              <strong>{stats.total}</strong>
            </article>
            <article className="stat-card success">
              <span>Active Users</span>
              <strong>{stats.active}</strong>
            </article>
            <article className="stat-card warning">
              <span>Pending</span>
              <strong>{stats.pending}</strong>
            </article>
            <article className="stat-card neutral">
              <span>Inactive</span>
              <strong>{stats.inactive}</strong>
            </article>
          </section>

          <section className="users-panel">
            <div className="panel-header">
              <h3>User information</h3>
              <span>{stats.total} members</span>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.phone || '—'}</td>
                      <td>{user.email}</td>
                      <td>{user.password || '—'}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className={`status-badge ${user.status.toLowerCase()}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>{user.location}</td>
                      <td>{user.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      ) : (
        <main className="user-dashboard">
          <section className="dashboard-topbar user-topbar">
            <div>
              <p className="eyebrow eyebrow-dark">Welcome back</p>
              <h2>User dashboard</h2>
            </div>
            <button type="button" className="outline-btn" onClick={handleLogout}>
              Sign out
            </button>
          </section>

          {showCandidateForm ? (
            <section className="candidate-form-section">
              <div className="user-welcome-card">
                <h3>Please fill the form</h3>
                <p>
                  Complete the candidate profile below. Your details will be displayed
                  in the admin dashboard along with your login credentials.
                </p>
              </div>

              <form className="candidate-form" onSubmit={handleCandidateSubmit}>
                <div className="field-grid">
                  <label>
                    <span>Full Name</span>
                    <input
                      type="text"
                      name="name"
                      value={candidateForm.name}
                      onChange={handleCandidateFormChange}
                      required
                    />
                  </label>

                  <label>
                    <span>Phone Number</span>
                    <input
                      type="tel"
                      name="phone"
                      value={candidateForm.phone}
                      onChange={handleCandidateFormChange}
                      required
                    />
                  </label>

                  <label>
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      value={candidateForm.email}
                      onChange={handleCandidateFormChange}
                      required
                    />
                  </label>

                  <label>
                    <span>Password</span>
                    <input
                      type="password"
                      name="password"
                      value={candidateForm.password}
                      onChange={handleCandidateFormChange}
                      required
                    />
                  </label>

                  <label>
                    <span>Role / Position</span>
                    <input
                      type="text"
                      name="role"
                      value={candidateForm.role}
                      onChange={handleCandidateFormChange}
                      required
                    />
                  </label>

                  <label>
                    <span>Location</span>
                    <input
                      type="text"
                      name="location"
                      value={candidateForm.location}
                      onChange={handleCandidateFormChange}
                    />
                  </label>
                </div>

                <button type="submit" className="submit-btn">
                  Submit Candidate Form
                </button>
              </form>
            </section>
          ) : submitSuccess ? (
            <section className="user-welcome-card success-card">
              <h3>Application submitted</h3>
              <p>
                Your candidate information has been submitted successfully and is now
                visible in the admin dashboard with your login credentials.
              </p>
            </section>
          ) : (
            <section className="user-welcome-card">
              <h3>Hello, Winston Member</h3>
              <p>
                You are logged in successfully. Your profile is active and ready to use
                the application.
              </p>
            </section>
          )}
        </main>
      )}

      {!isAuthenticated && (
        <footer className="site-footer">
          <div className="footer-brand">
            <div className="brand-mark small">WT</div>
            <div>
              <p>Winston Technologies</p>
              <span>Where Ambition Meets Success.</span>
            </div>
          </div>

          <div className="footer-links">
            {serviceGroups.map((group) => (
              <div key={group.label} className="footer-column">
                <h4>{group.label}</h4>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>
                      <a href="#">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </footer>
      )}
    </div>
  )
}

export default App
