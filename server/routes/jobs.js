import express from 'express'
import Job from '../models/Job.js'
import { authenticate, authorizeAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const jobs = await Job.find({ status: 'ACTIVE' })
  res.json({ jobs })
})

router.post('/', authenticate, authorizeAdmin, async (req, res) => {
  const job = new Job(req.body)
  await job.save()
  res.json({ job })
})

router.put('/:id', authenticate, authorizeAdmin, async (req, res) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json({ job })
})

router.delete('/:id', authenticate, authorizeAdmin, async (req, res) => {
  await Job.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

export default router
