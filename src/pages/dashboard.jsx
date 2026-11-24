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
  const [showProfileForm, setShowProfileForm] = useState(false)

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

  useEffect(() => {
    if (user?.profile) {
      setForm({
        country_id: user.profile.country_id || '',
        institution_id: user.profile.institution_id || '',
        faculty_id: user.profile.faculty_id || '',
        department_id: user.profile.department_id || '',
        academic_level_id: user.profile.academic_level_id || '',
      })
      // auto-open form if profile is incomplete
      if (!user.profile.institution_id) {
        setShowProfileForm(true)
      }
    }
  }, [user])

  useEffect(() => {
    if (!form.institution_id) {
      setFaculties([])
      return
    }
    getFaculties(form.institution_id)
      .then((res) => setFaculties(res.data || []))
      .catch(() => setFaculties([]))
  }, [form.institution_id])

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
        setUser((prev) => ({
          ...prev,
          profile: res.data.profile,
        }))
        setMessage('Profile saved successfully')
        setShowProfileForm(false)
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
  const hasInstitution = !!profile?.institution_id
  const firstName = user?.name?.split(' ')[0] || 'Student'

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary-800 text-lg">Acadia</span>
            <span className="hidden sm:inline text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Student
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 hidden sm:inline">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome back, {firstName}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Profile incomplete banner */}
        {!hasInstitution && (
          <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-amber-800">Complete your academic profile</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Select your institution and department so we can show relevant materials.
              </p>
            </div>
            <button
              onClick={() => setShowProfileForm(true)}
              className="text-sm font-medium bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition whitespace-nowrap"
            >
              Complete now
            </button>
          </div>
        )}

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Downloads" value="0" sub="This semester" />
          <StatCard label="Uploads" value="0" sub="Materials shared" />
          <StatCard label="Bookmarks" value="0" sub="Saved resources" />
          <StatCard label="Requests" value="0" sub="Open requests" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Profile + form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Academic profile card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-800">Academic profile</h2>
                <button
                  onClick={() => setShowProfileForm(!showProfileForm)}
                  className="text-sm text-primary-700 hover:text-primary-800 font-medium"
                >
                  {showProfileForm ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {!showProfileForm ? (
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <InfoRow label="Institution" value={profile?.institution?.name} />
                  <InfoRow label="Faculty" value={profile?.faculty?.name} />
                  <InfoRow label="Department" value={profile?.department?.name} />
                  <InfoRow label="Level" value={profile?.academic_level?.name} />
                  <InfoRow label="Country" value={profile?.country?.name} />
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <SelectField
                      label="Country"
                      name="country_id"
                      value={form.country_id}
                      onChange={handleChange}
                      options={countries}
                    />
                    <SelectField
                      label="Institution"
                      name="institution_id"
                      value={form.institution_id}
                      onChange={handleChange}
                      options={institutions}
                    />
                    <SelectField
                      label="Faculty"
                      name="faculty_id"
                      value={form.faculty_id}
                      onChange={handleChange}
                      options={faculties}
                      disabled={!form.institution_id}
                    />
                    <SelectField
                      label="Department"
                      name="department_id"
                      value={form.department_id}
                      onChange={handleChange}
                      options={departments}
                      disabled={!form.faculty_id}
                    />
                    <SelectField
                      label="Academic level"
                      name="academic_level_id"
                      value={form.academic_level_id}
                      onChange={handleChange}
                      options={levels}
                    />
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
              )}
            </div>

            {/* Placeholder: Recent materials */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-3">Recent materials</h2>
              <div className="text-center py-10 text-slate-400 text-sm">
                <p>No materials yet.</p>
                <p className="mt-1">Past questions and handouts will appear here once available.</p>
              </div>
            </div>
          </div>

          {/* Right column - Quick actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-800 mb-4">Quick actions</h2>
              <div className="space-y-2">
                <ActionButton label="Browse resources" disabled />
                <ActionButton label="Upload material" disabled />
                <ActionButton label="Request past question" disabled />
                <ActionButton label="My bookmarks" disabled />
              </div>
              <p className="text-xs text-slate-400 mt-4">
                These features will unlock when the resource module is ready.
              </p>
            </div>

            <div className="bg-primary-50 rounded-xl border border-primary-100 p-5">
              <h3 className="font-semibold text-primary-900 text-sm">Your community</h3>
              <p className="text-xs text-primary-700 mt-1">
                {hasInstitution
                  ? `Connected to ${profile?.department?.name || profile?.institution?.name || 'your department'}`
                  : 'Complete your profile to join your department community.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ---------- small helper components ---------- */

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-700 mt-0.5">{label}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <span className="text-slate-400 text-xs block">{label}</span>
      <span className="font-medium text-slate-800">{value || '—'}</span>
    </div>
  )
}

function SelectField({ label, name, value, onChange, options = [], disabled = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-slate-100 disabled:text-slate-400"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    </div>
  )
}

function ActionButton({ label, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      {label}
    </button>
  )
}
