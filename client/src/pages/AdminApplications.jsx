import React, { useEffect, useState } from 'react'
import API from '../services/api'

const statuses = ['SUBMITTED','UNDER_REVIEW','SHORTLISTED','INTERVIEW_SCHEDULED','SELECTED','REJECTED']

export default function AdminApplications(){
  const [apps, setApps] = useState([])
  const [preview, setPreview] = useState(null)
  const fetchApps = ()=> API.get('/applications').then(r=>setApps(r.data.applications)).catch(()=>{})
  useEffect(()=>{ fetchApps() },[])

  const changeStatus = (id, status)=>{
    API.put(`/applications/${id}/status`, { status }).then(()=>fetchApps()).catch(()=>alert('Failed'))
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Applications (Admin)</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead><tr className="text-left"><th>User</th><th>Role</th><th>Date</th><th>Status</th><th>Resume</th><th>Action</th></tr></thead>
          <tbody>
            {apps.map(a=> (
              <tr key={a._id} className="border-t">
                <td>{a.userId?.name || a.userId?.email}</td>
                <td>{a.jobPreferences?.role || '—'}</td>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
                <td>{a.status}</td>
                <td>
                  {a.resumeUrl ? (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <a className="text-sky-600" href={a.resumeUrl} target="_blank" rel="noopener noreferrer">Open</a>
                        {a.resumeUrl.endsWith('.pdf') && <button onClick={()=>setPreview(a.resumeUrl)} className="text-sm text-slate-600">Preview</button>}
                      </div>
                      <div className="text-sm text-slate-500">{a.resumeFilename || a.originalname || ''} {a.resumeSize ? `• ${Math.round(a.resumeSize/1024)} KB` : ''}</div>
                    </div>
                  ) : '—'}
                </td>
                <td>
                  <select defaultValue={a.status} onChange={e=>changeStatus(a._id, e.target.value)} className="border p-1 rounded">
                    {statuses.map(s=> <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {preview && (
        <div className="mt-4">
          <div className="flex justify-between items-center"><div className="font-semibold">Preview</div><button onClick={()=>setPreview(null)} className="text-sm">Close</button></div>
          <iframe src={preview} className="w-full h-96 mt-2 border" title="resume-preview" />
        </div>
      )}
    </div>
  )
}
