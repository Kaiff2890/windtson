import mongoose from 'mongoose'
import dotenv from 'dotenv'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

dotenv.config()

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/windtson')
  const adminEmail = process.env.ADMIN_EMAIL || 'arbiya@windtson.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'arbiya123'

  // Check for existing admin by email or the seeded mobile and update if found
  const existing = await User.findOne({ $or: [{ email: adminEmail }, { mobile: '0000000000' }] })
  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(adminPassword, salt)

  if (existing) {
    existing.name = 'Arbiya'
    existing.email = adminEmail
    existing.passwordHash = passwordHash
    existing.role = 'ADMIN'
    existing.mobile = existing.mobile || '0000000000'
    await existing.save()
    console.log('Admin updated:', adminEmail)
    return process.exit(0)
  }

  const admin = new User({ name: 'Arbiya', email: adminEmail, mobile: '0000000000', passwordHash, role: 'ADMIN' })
  await admin.save()
  console.log('Admin created:', adminEmail)
  process.exit(0)
}

run().catch((err) => console.error(err))
