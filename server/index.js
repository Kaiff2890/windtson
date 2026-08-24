import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import jobRoutes from './routes/jobs.js'
import applicationRoutes from './routes/applications.js'
import uploadRoutes from './routes/uploads.js'
import adminSeedApi from './routes/adminSeedApi.js'
import path from 'path'

dotenv.config()

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true }))
app.use(express.json())

const PORT = process.env.PORT || 5000

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/uploads', uploadRoutes)

// Temporary protected admin seed endpoint (mount only when SEED_API_TOKEN is set)
if (process.env.SEED_API_TOKEN) {
  app.use('/internal/seed-admin', adminSeedApi)
}

// serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

app.get('/', (req, res) => res.json({ message: 'Windtson Info API' }))

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/windtson')
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on ${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection error', err)
  })
