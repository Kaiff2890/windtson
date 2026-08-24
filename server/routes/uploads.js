import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = express.Router()

const uploadDir = path.join(process.cwd(), 'uploads', 'resumes')
fs.mkdirSync(uploadDir, { recursive: true })

// restrict size and types: 5 MB limit, accept PDF/DOC/DOCX/TXT
const MAX_BYTES = 5 * 1024 * 1024 // 5MB
const allowedMimes = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
])
const useS3 = Boolean(process.env.S3_BUCKET)

const storage = useS3
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, uploadDir)
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_')
        cb(null, `${Date.now()}_${base}${ext}`)
      }
    })

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES },
  fileFilter: (req, file, cb) => {
    // validate mimetype first
    if (allowedMimes.has(file.mimetype)) return cb(null, true)
    // fallback: check extension
    const ext = path.extname(file.originalname).toLowerCase()
    if (['.pdf', '.doc', '.docx', '.txt'].includes(ext)) return cb(null, true)
    cb(null, false)
    const useS3 = Boolean(process.env.S3_BUCKET)
  },
})

// POST /api/uploads/resume
router.post('/resume', (req, res, next) => {
  upload.single('resume')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'File too large (max 5MB)' })
      return res.status(400).json({ message: err.message || 'Upload error' })
    }
    if (!req.file) return res.status(400).json({ message: 'Invalid file type or no file uploaded' })
    try {
      // basic validation (size + extension/mimetype) to be safe even if multer allowed
      const ext = path.extname(req.file.originalname).toLowerCase()
      let size = 0
      if (req.file.path) {
        try { size = fs.statSync(req.file.path).size } catch (e) { size = req.file.size || (req.file.buffer && req.file.buffer.length) || 0 }
      } else {
        size = req.file.size || (req.file.buffer && req.file.buffer.length) || 0
      }
      const mime = req.file.mimetype || ''
      console.log('Upload debug:', { originalname: req.file.originalname, ext, mime, size, path: req.file.path })
      console.log('useS3 env present:', typeof process.env.S3_BUCKET !== 'undefined', 'S3_BUCKET=', process.env.S3_BUCKET)

      if (size > MAX_BYTES) {
        // delete local file if any
        if (req.file.path) try { fs.unlinkSync(req.file.path) } catch(e){}
        return res.status(400).json({ message: 'File too large (max 5MB)' })
      }
      const allowedExt = ['.pdf', '.doc', '.docx', '.txt']
      if (!allowedMimes.has(mime) && !allowedExt.includes(ext)) {
        if (req.file.path) try { fs.unlinkSync(req.file.path) } catch(e){}
        return res.status(400).json({ message: 'Invalid file type' })
      }

      if (useS3) {
        const bucket = process.env.S3_BUCKET
        const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
        import('@aws-sdk/client-s3').then(async (mod) => {
          const { S3Client, PutObjectCommand, GetObjectCommand } = mod
          const { getSignedUrl } = (await import('@aws-sdk/s3-request-presigner'))
          const client = new S3Client({ region })
          const base = path.basename(req.file.originalname, ext).replace(/[^a-z0-9_-]/gi, '_')
          const key = `resumes/${Date.now()}_${base}${ext}`
          const put = new PutObjectCommand({ Bucket: bucket, Key: key, Body: req.file.buffer, ContentType: req.file.mimetype })
          await client.send(put)
          const getCmd = new GetObjectCommand({ Bucket: bucket, Key: key })
          const signedUrl = await getSignedUrl(client, getCmd, { expiresIn: parseInt(process.env.S3_SIGNED_EXPIRES || '900', 10) })
          return res.json({ url: signedUrl, filename: key, originalname: req.file.originalname, size: req.file.buffer.length })
        }).catch((e)=>{
          console.error('S3 dynamic import/upload error', e)
          return res.status(500).json({ message: 'Upload failed' })
        })
        return
      }

      const origin = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`
      console.log('req.file details before response:', req.file)
      const url = `${origin}/uploads/resumes/${req.file.filename}`
      const sizeLocal = req.file.path ? (fs.statSync(req.file.path).size || 0) : (req.file.size || (req.file.buffer && req.file.buffer.length) || 0)
      res.json({ url, filename: req.file.filename, originalname: req.file.originalname, size: sizeLocal })
    } catch (e) {
      console.error('Upload S3 error', e)
      res.status(500).json({ message: 'Upload failed' })
    }
  })
})

export default router
