import puppeteer from 'puppeteer'

async function run() {
  const API = 'http://localhost:5000/api'
  const APP = 'http://localhost:5173'
  // login to get token
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: 'arbiya@windtson.com', password: 'arbiya123' })
  })
  if (!res.ok) {
    console.error('Login failed', await res.text())
    process.exit(1)
  }
  const j = await res.json()
  const token = j.token
  console.log('Got token')

  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] })
  const page = await browser.newPage()
  await page.goto(APP, { waitUntil: 'networkidle2' })
  // set token and go to dashboard
  await page.evaluate((t) => { localStorage.setItem('token', t) }, token)
  await page.goto(APP + '/dashboard', { waitUntil: 'networkidle2' })
  await page.screenshot({ path: 'admin-dashboard.png', fullPage: true })
  console.log('Screenshot saved: admin-dashboard.png')
  await browser.close()
}

run().catch(e=>{ console.error(e); process.exit(1) })
