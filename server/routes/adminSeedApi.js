import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

dotenv.config()
const router = express.Router()

// Protect this endpoint with a one-time secret header X-SEED-TOKEN
const ONE_TIME_TOKEN = process.env.SEED_API_TOKEN

router.post('/', async (req, res) => {
  if (!ONE_TIME_TOKEN) return res.status(403).json({ message: 'Seed API disabled' })
  if (req.headers['x-seed-token'] !== ONE_TIME_TOKEN) return res.status(403).json({ message: 'Forbidden' })

  const { email, password, name = 'Arbiya', mobile = '0000000000' } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Missing email or password' })

  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/windtson')

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const existing = await User.findOne({ $or: [{ email }, { mobile }] })
    if (existing) {
      existing.name = name
      existing.email = email
      existing.passwordHash = passwordHash
      existing.role = 'ADMIN'
      existing.mobile = existing.mobile || mobile
      await existing.save()
      return res.json({ message: 'Admin updated', email })
    }

    const admin = new User({ name, email, mobile, passwordHash, role: 'ADMIN' })
    await admin.save()
    return res.json({ message: 'Admin created', email })
  } catch (err) {
    console.error('Seed error', err)
    return res.status(500).json({ message: 'Server error', error: err.message })
  }
})

export default router
