import express from 'express'
import User from '../models/User.js'
import { authenticate, authorizeAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user })
})

router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  const users = await User.find().select('-passwordHash')
  res.json({ users })
})

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

export default router
