import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' })

  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Unauthorized' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    req.user = await User.findById(payload.id).select('-passwordHash')
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' })
  next()
}
