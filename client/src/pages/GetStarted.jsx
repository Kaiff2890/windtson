import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

const steps = ['Personal', 'Education', 'Preferences', 'Skills', 'Experience', 'Additional']

export default function GetStarted() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    personalInformation: { fullName: user?.name || '', mobile: user?.mobile || '', email: user?.email || '' },
    education: {},
    jobPreferences: {},
    skills: {},
    experience: {},
    additional: {},
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const update = (section, key, value) => setData((d) => ({ ...d, [section]: { ...d[section], [key]: value } }))

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prev = () => setStep((s) => Math.max(s - 1, 0))

  const submit = async () => {
    setLoading(true)
    try {
      const payload = {
        personalInformation: data.personalInformation,
        education: data.education,
        jobPreferences: data.jobPreferences,
        skills: data.skills,
        experience: data.experience,
        resumeUrl: data.additional.resumeUrl || ''
      }
      await API.post('/applications', payload)
      navigate('/applications')
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Get Started - Application</h2>
      <div className="mb-4">
        <div className="text-sm text-slate-600">Step {step + 1} of {steps.length}: {steps[step]}</div>
        <div className="w-full bg-gray-200 h-2 rounded mt-2">
          <div className="bg-sky-600 h-2 rounded" style={{ width: `${((step+1)/steps.length)*100}%` }} />
        </div>
      </div>

      {step === 0 && (
        <div className="space-y-3">
          <label>Full name<input value={data.personalInformation.fullName} onChange={e=>update('personalInformation','fullName',e.target.value)} className="w-full border p-2 rounded"/></label>
          <label>Mobile<input value={data.personalInformation.mobile} onChange={e=>update('personalInformation','mobile',e.target.value)} className="w-full border p-2 rounded"/></label>
          <label>Email<input value={data.personalInformation.email} onChange={e=>update('personalInformation','email',e.target.value)} className="w-full border p-2 rounded"/></label>
          <label>DOB<input type="date" onChange={e=>update('personalInformation','dob',e.target.value)} className="w-full border p-2 rounded"/></label>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-3">
          <label>Highest Qualification<input onChange={e=>update('education','qualification',e.target.value)} className="w-full border p-2 rounded"/></label>
          <label>Course/Degree<input onChange={e=>update('education','course',e.target.value)} className="w-full border p-2 rounded"/></label>
          <label>College<input onChange={e=>update('education','college',e.target.value)} className="w-full border p-2 rounded"/></label>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <label>Job Role<input onChange={e=>update('jobPreferences','role',e.target.value)} className="w-full border p-2 rounded"/></label>
          <label>Preferred Location<input onChange={e=>update('jobPreferences','location',e.target.value)} className="w-full border p-2 rounded"/></label>
          <label>Experience<input onChange={e=>update('jobPreferences','experience',e.target.value)} className="w-full border p-2 rounded"/></label>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <label>Technical Skills<textarea onChange={e=>update('skills','technical',e.target.value)} className="w-full border p-2 rounded"/></label>
          <label>Communication Skills<textarea onChange={e=>update('skills','communication',e.target.value)} className="w-full border p-2 rounded"/></label>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <label>Fresher or Experienced<select onChange={e=>update('experience','type',e.target.value)} className="w-full border p-2 rounded"><option>Fresher</option><option>Experienced</option></select></label>
          <label>Previous Company<input onChange={e=>update('experience','company',e.target.value)} className="w-full border p-2 rounded"/></label>
          <label>Years of Experience<input onChange={e=>update('experience','years',e.target.value)} className="w-full border p-2 rounded"/></label>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-3">
              <label>Resume URL (optional)
                <input value={data.additional.resumeUrl || ''} onChange={e=>update('additional','resumeUrl',e.target.value)} className="w-full border p-2 rounded"/>
              </label>
              <label>Or upload resume (PDF/DOC)
                <input type="file" accept=".pdf,.doc,.docx" onChange={async (e)=>{
                  const file = e.target.files && e.target.files[0]
                  if(!file) return
                  const form = new FormData()
                  form.append('resume', file)
                  try{
                    setUploading(true)
                    const res = await API.post('/uploads/resume', form, { headers: { 'Content-Type': 'multipart/form-data' } })
                    update('additional','resumeUrl', res.data.url)
                    update('additional','resumeFilename', res.data.filename || res.data.key || res.data.originalname)
                    update('additional','resumeSize', res.data.size || 0)
                  }catch(err){
                    alert(err.response?.data?.message || 'Upload failed')
                  }finally{ setUploading(false) }
                }} className="w-full border p-2 rounded"/>
                {uploading && <div className="text-sm text-slate-600">Uploading...</div>}
              </label>
          <label>Additional Information<textarea onChange={e=>update('additional','notes',e.target.value)} className="w-full border p-2 rounded"/></label>
          <label><input type="checkbox" onChange={e=>update('additional','consent',e.target.checked)} /> I declare that the information is true.</label>
        </div>
      )}

      <div className="mt-4 flex justify-between">
        <div>
          {step>0 && <button onClick={prev} className="px-4 py-2 border rounded mr-2">Previous</button>}
        </div>
        <div>
          {step < steps.length-1 ? (
            <button onClick={next} className="px-4 py-2 bg-sky-600 text-white rounded">Save & Continue</button>
          ) : (
            <button onClick={submit} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading? 'Submitting...' : 'Submit Application'}</button>
          )}
        </div>
      </div>
    </div>
  )
}
