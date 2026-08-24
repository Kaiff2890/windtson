import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    personalInformation: { type: Object, default: {} },
    education: { type: Object, default: {} },
    jobPreferences: { type: Object, default: {} },
    skills: { type: Object, default: {} },
    experience: { type: Object, default: {} },
    resumeUrl: { type: String },
    resumeFilename: { type: String },
    resumeSize: { type: Number },
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'],
      default: 'SUBMITTED',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Application', applicationSchema)
