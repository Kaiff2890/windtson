import express from 'express'
import Application from '../models/Application.js'
import { authenticate, authorizeAdmin } from '../middleware/auth.js'

const router = express.Router()

router.post('/', authenticate, async (req, res) => {
  const { resumeUrl, resumeFilename, resumeSize, ...rest } = req.body
  const payload = { userId: req.user._id, resumeUrl, resumeFilename, resumeSize, ...rest }
  const app = new Application(payload)
  await app.save()
  res.json({ application: app })
})

router.get('/', authenticate, authorizeAdmin, async (req, res) => {
  const applications = await Application.find().populate('userId', 'name email mobile')
  res.json({ applications })
})

router.get('/me', authenticate, async (req, res) => {
  const applications = await Application.find({ userId: req.user._id })
  res.json({ applications })
})

router.put('/:id/status', authenticate, authorizeAdmin, async (req, res) => {
  const { status } = req.body
  const app = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true })
  res.json({ application: app })
})

export default router
