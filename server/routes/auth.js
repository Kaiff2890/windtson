import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body
    if (!name || !mobile || !email || !password) return res.status(400).json({ message: 'Missing fields' })

    const exists = await User.findOne({ $or: [{ email }, { mobile }] })
    if (exists) return res.status(409).json({ message: 'User already exists' })

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const user = new User({ name, mobile, email, passwordHash })
    await user.save()

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body
    if (!identifier || !password) return res.status(400).json({ message: 'Missing fields' })

    const user = await User.findOne({ $or: [{ email: identifier }, { mobile: identifier }] })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
