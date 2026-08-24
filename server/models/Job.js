import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String },
    description: { type: String },
    location: { type: String },
    experience: { type: String },
    salary: { type: String },
    requiredSkills: [String],
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  },
  { timestamps: true }
)

export default mongoose.model('Job', jobSchema)
