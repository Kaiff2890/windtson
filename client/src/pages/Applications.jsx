import React, { useEffect, useState } from 'react'
import API from '../services/api'

export default function Applications() {
  const [apps, setApps] = useState([])
  const [preview, setPreview] = useState(null)

  useEffect(()=>{
    API.get('/applications/me').then(res=>setApps(res.data.applications)).catch(()=>{})
  },[])

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>
      {apps.length===0 ? <div>No applications yet.</div> : (
        <table className="w-full table-auto border-collapse">
          <thead><tr className="text-left"><th>Role</th><th>Date</th><th>Status</th><th>Resume</th></tr></thead>
          <tbody>
            {apps.map(a=> (
              <tr key={a._id} className="border-t">
                <td>{a.jobPreferences?.role || a.personalInformation?.jobRole || '—'}</td>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {preview && (
        <div className="mt-4">
          <div className="flex justify-between items-center"><div className="font-semibold">Preview</div><button onClick={()=>setPreview(null)} className="text-sm">Close</button></div>
          <iframe src={preview} className="w-full h-96 mt-2 border" title="resume-preview" />
        </div>
      )}
    </div>
  )
}
