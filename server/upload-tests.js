import fs from 'fs'
import path from 'path'

const BASE = process.env.BASE_URL || 'http://localhost:5000/api'

async function run() {
  console.log('Running upload tests')

  // test invalid type (.exe)
  const exeBuf = Buffer.from('MZ')
  const fd1 = new FormData()
  fd1.append('resume', new Blob([exeBuf]), 'malware.exe')
  const r1 = await fetch(`${BASE}/uploads/resume`, { method: 'POST', body: fd1 })
  console.log('Invalid type status:', r1.status)
  console.log('Body:', await r1.text())

  // test oversized file (6MB)
  const big = Buffer.alloc(6 * 1024 * 1024, 'a')
  const fd2 = new FormData()
  fd2.append('resume', new Blob([big]), 'big.pdf')
  const r2 = await fetch(`${BASE}/uploads/resume`, { method: 'POST', body: fd2 })
  console.log('Oversize status:', r2.status)
  console.log('Body:', await r2.text())

  // test valid small txt
  const small = Buffer.from('hello')
  const fd3 = new FormData()
  fd3.append('resume', new Blob([small]), 'ok.txt')
  const r3 = await fetch(`${BASE}/uploads/resume`, { method: 'POST', body: fd3 })
  console.log('Valid txt status:', r3.status)
  const body3 = await r3.json()
  console.log('Body:', body3)
  if (r3.ok) {
    console.log('Filename:', body3.filename || body3.key || body3.originalname, 'Size:', body3.size)
  }
}

run().catch(e=>{ console.error(e); process.exit(1) })
