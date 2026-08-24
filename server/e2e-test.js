import fs from 'fs'
import path from 'path'

const BASE = process.env.BASE_URL || 'http://localhost:5000/api'
let __dirname = path.dirname(decodeURI(new URL(import.meta.url).pathname))
if (process.platform === 'win32' && __dirname.startsWith('/')) __dirname = __dirname.slice(1)

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  // unique identifiers
  const timestamp = Date.now()
  const email = `e2e${timestamp}@example.com`
  const mobile = `${('' + timestamp).slice(-10)}`
  const password = 'Test1234!'

  console.log('Registering user', email, mobile)
  let res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'E2E User', email, mobile, password }),
  })
  const reg = await res.json()
  if (!res.ok) { console.error('Register failed', reg); return }
  console.log('Registered:', reg.user?.id)

  console.log('Logging in user')
  res = await fetch(`${BASE}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: mobile, password })
  })
  const login = await res.json()
  if (!res.ok) { console.error('Login failed', login); return }
  const token = login.token
  console.log('User token obtained')

  // upload resume
  console.log('Uploading resume')
  const fd = new FormData()
  const testPath = path.join(__dirname, 'test-resume.txt')
  if (!fs.existsSync(testPath)) fs.writeFileSync(testPath, 'e2e test')
  const fileBuf = fs.readFileSync(testPath)
  const blob = new Blob([fileBuf])
  fd.append('resume', blob, 'test-resume.txt')
  res = await fetch(`${BASE}/uploads/resume`, { method: 'POST', body: fd })
  const up = await res.json()
  if (!res.ok) { console.error('Upload failed', up); return }
  console.log('Uploaded to', up.url)

  // submit application
  console.log('Submitting application')
  const appPayload = {
    personalInformation: { fullName: 'E2E User', email, mobile },
    education: { qualification: 'BSc' },
    jobPreferences: { role: 'Developer' },
    skills: { technical: 'JS' },
    experience: { years: 1 },
    resumeUrl: up.url,
    resumeFilename: up.filename || up.key || up.originalname,
    resumeSize: up.size || 0,
  }
  res = await fetch(`${BASE}/applications`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(appPayload)
  })
  const appRes = await res.json()
  if (!res.ok) { console.error('Application submit failed', appRes); return }
  console.log('Application submitted:', appRes.application._id)

  // small delay for DB propagation
  await wait(500)

  // admin login
  const adminEmail = process.env.ADMIN_EMAIL || 'arbiya@windtson.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'arbiya123'
  console.log('Logging in as admin', adminEmail)
  res = await fetch(`${BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier: adminEmail, password: adminPassword }) })
  const adminLogin = await res.json()
  if (!res.ok) { console.error('Admin login failed', adminLogin); return }
  const adminToken = adminLogin.token

  // fetch applications as admin
  res = await fetch(`${BASE}/applications`, { headers: { 'Authorization': `Bearer ${adminToken}` } })
  const apps = await res.json()
  if (!res.ok) { console.error('Fetch apps failed', apps); return }
  console.log('Admin applications count:', apps.applications.length)
  const found = apps.applications.find(a => a.resumeUrl === up.url || (a.userId && (a.userId.email === email || a.userId.mobile === mobile)))
  console.log('Application found in admin list:', Boolean(found))
  if (found) console.log('Found application id:', found._id)
}

run().catch(e=>{ console.error('E2E error', e); process.exit(1) })
