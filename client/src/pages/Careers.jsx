import React, { useEffect, useState } from 'react'
import API from '../services/api'
import { Link } from 'react-router-dom'

export default function Careers(){
  const [jobs, setJobs] = useState([])
  useEffect(()=>{ API.get('/jobs').then(r=>setJobs(r.data.jobs)).catch(()=>{}) },[])
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Careers</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map(j=> (
          <div key={j._id} className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{j.title}</h3>
            <div className="text-sm text-slate-600">{j.department} • {j.location} • {j.experience}</div>
            <p className="mt-2 text-sm text-slate-700">{j.description}</p>
            <div className="mt-3">
              <Link to="/register" className="px-3 py-2 bg-sky-600 text-white rounded">Apply</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
