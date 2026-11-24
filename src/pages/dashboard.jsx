import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authcontext.jsx'
import {
  getCountries,
  getInstitutions,
  getFaculties,
  getDepartments,
  getAcademicLevels,
  updateProfile,
} from '../services/api'

export default function Dashboard() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()

  const [countries, setCountries] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [faculties, setFaculties] = useState([])
  const [departments, setDepartments] = useState([])
  const [levels, setLevels] = useState([])

  const [form, setForm] = useState({
    country_id: '',
    institution_id: '',
    faculty_id: '',
    department_id: '',
    academic_level_id: '',
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Load hierarchy data on mount
  useEffect(() => {
    async function load() {
      try {
        const [c, i, l] = await Promise.all([
          getCountries(),
          getInstitutions(),
          getAcademicLevels(),
        ])
        setCountries(c.data || [])
        setInstitutions(i.data || [])
        setLevels(l.data || [])
      } catch (err) {
        console.error(err)
      }
    }
    load()
  }, [])

  // Prefill form from existing profile
  useEffect(() => {
    if (user?.profile) {
      setForm({
        country_id: user.profile.country_id || '',
        institution_id: user.profile.institution_id || '',
        faculty_id: user.profile.faculty_id || '',
        department_id: user.profile.department_id || '',
        academic_level_id: user.profile.academic_level_id || '',
      })
    }
  }, [user])

  // Load faculties when institution changes
  useEffect(() => {
    if (!form.institution_id) {
      setFaculties([])
      return
    }
    getFaculties(form.institution_id)
      .then((res) => setFaculties(res.data || []))
      .catch(() => setFaculties([]))
  }, [form.institution_id])

  // Load departments when faculty changes
  useEffect(() => {
    if (!form.faculty_id) {
      setDepartments([])
      return
    }
    getDepartments(form.faculty_id)
      .then((res) => setDepartments(res.data || []))
      .catch(() => setDepartments([]))
  }, [form.faculty_id])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => {
      const next = { ...prev, [name]: value }
      // reset children when parent changes
      if (name === 'institution_id') {
        next.faculty_id = ''
        next.department_id = ''
      }
      if (name === 'faculty_id') {
        next.department_id = ''
      }
      return next
    })
    setMessage('')
    setError('')
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const payload = {
        country_id: form.country_id || null,
        institution_id: form.institution_id || null,
        faculty_id: form.faculty_id || null,
        department_id: form.department_id || null,
        academic_level_id: form.academic_level_id || null,
      }
      const res = await updateProfile(payload)
      if (res.success) {
        // update local user state
        setUser((prev) => ({
          ...prev,
          profile: res.data.profile,
        }))
        setMessage('Profile saved successfully')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/auth')
  }

  const profile = user?.profile

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary-800 text-lg">Acadia</span>
            <span className="text-xs text-slate-400 hidden sm:inline">Student Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 hidden sm:inline">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {user?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Current profile summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h2 className="font-semibold text-slate-800 mb-3">Your academic profile</h2>
          {profile?.institution || profile?.department || profile?.academic_level ? (
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-400">Institution:</span>{' '}
                <span className="font-medium">{profile?.institution?.name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400">Faculty:</span>{' '}
                <span className="font-medium">{profile?.faculty?.name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400">Department:</span>{' '}
                <span className="font-medium">{profile?.department?.name || '—'}</span>
              </div>
              <div>
                <span className="text-slate-400">Level:</span>{' '}
                <span className="font-medium">{profile?.academic_level?.name || '—'}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              You have not selected your institution yet. Complete the form below.
            </p>
          )}
        </div>

        {/* Update profile form */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Update institution & department</h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                <select
                  name="country_id"
                  value={form.country_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Institution */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
                <select
                  name="institution_id"
                  value={form.institution_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select institution</option>
                  {institutions.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              {/* Faculty */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Faculty</label>
                <select
                  name="faculty_id"
                  value={form.faculty_id}
                  onChange={handleChange}
                  disabled={!form.institution_id}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100"
                >
                  <option value="">Select faculty</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                <select
                  name="department_id"
                  value={form.department_id}
                  onChange={handleChange}
                  disabled={!form.faculty_id}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Academic Level */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Academic level</label>
                <select
                  name="academic_level_id"
                  value={form.academic_level_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select level</option>
                  {levels.map((l) => (
                    <option key={l.id} value={l.id}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {message && (
              <div className="rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2">
                {message}
              </div>
            )}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary-700 hover:bg-primary-800 text-white font-medium px-5 py-2.5 text-sm transition disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
