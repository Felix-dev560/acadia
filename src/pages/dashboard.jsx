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
import '../styles/dashboard.css'

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
      if (!user.profile.institution_id) setShowProfileForm(true)
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
      if (name === 'faculty_id') next.department_id = ''
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
        setUser((prev) => ({ ...prev, profile: res.data.profile }))
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
  const initials = (user?.name || 'S')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="dash-body">
      <div className="dash-shell">
        {/* Top bar */}
        <div className="dash-topwrap">
          <div className="dash-top">
            <div className="dash-brand">
              <div className="dash-mark">A</div>
              <div>
                <b>Acadia</b>
                <small>Student Dashboard</small>
              </div>
            </div>
            <div className="dash-tools">
              <span className="dash-avatar" title={user?.name}>{initials}</span>
              <button className="dash-btn danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Welcome */}
        <div className="dash-welcome">
          <h1>Welcome back, {firstName}</h1>
          <p>{user?.email}</p>
        </div>

        {/* Incomplete profile banner */}
        {!hasInstitution && (
          <div className="dash-banner">
            <p>
              Complete your academic profile
              <span>Select your institution and department to unlock relevant materials.</span>
            </p>
            <button type="button" onClick={() => setShowProfileForm(true)}>
              Complete now
            </button>
          </div>
        )}

        {/* KPI cards */}
        <div className="dash-kpis">
          <div className="dash-card dash-kpi">
            <div className="t">
              <span>Downloads</span>
              <span className="ico g">↓</span>
            </div>
            <div className="big">0</div>
            <div className="f">This semester</div>
          </div>
          <div className="dash-card dash-kpi">
            <div className="t">
              <span>Uploads</span>
              <span className="ico b">↑</span>
            </div>
            <div className="big">0</div>
            <div className="f">Materials shared</div>
          </div>
          <div className="dash-card dash-kpi">
            <div className="t">
              <span>Bookmarks</span>
              <span className="ico a">★</span>
            </div>
            <div className="big">0</div>
            <div className="f">Saved resources</div>
          </div>
          <div className="dash-card dash-kpi">
            <div className="t">
              <span>Requests</span>
              <span className="ico r">?</span>
            </div>
            <div className="big">0</div>
            <div className="f">Open requests</div>
          </div>
        </div>

        {/* Main grid */}
        <div className="dash-grid">
          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Academic profile */}
            <div className="dash-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ margin: 0 }}>Academic profile</h3>
                <button
                  className="dash-btn"
                  type="button"
                  onClick={() => setShowProfileForm(!showProfileForm)}
                >
                  {showProfileForm ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {!showProfileForm ? (
                <div className="dash-info">
                  <div>
                    <span>Institution</span>
                    <b>{profile?.institution?.name || '—'}</b>
                  </div>
                  <div>
                    <span>Faculty</span>
                    <b>{profile?.faculty?.name || '—'}</b>
                  </div>
                  <div>
                    <span>Department</span>
                    <b>{profile?.department?.name || '—'}</b>
                  </div>
                  <div>
                    <span>Level</span>
                    <b>{profile?.academic_level?.name || '—'}</b>
                  </div>
                  <div>
                    <span>Country</span>
                    <b>{profile?.country?.name || '—'}</b>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="dash-form">
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

                  <div className="dash-actions">
                    <button type="submit" className="dash-pri" disabled={saving}>
                      {saving ? 'Saving...' : 'Save profile'}
                    </button>
                    {message && <span className="dash-msg ok">{message}</span>}
                    {error && <span className="dash-msg err">{error}</span>}
                  </div>
                </form>
              )}
            </div>

            {/* Recent materials placeholder */}
            <div className="dash-card">
              <h3>Recent materials</h3>
              <div className="dash-empty">
                <p>No materials yet.</p>
                <p>Past questions and handouts will appear here once available.</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="dash-card">
              <h3>Quick actions</h3>
              <div className="dash-qa">
                <button type="button" disabled>Browse resources</button>
                <button type="button" disabled>Upload material</button>
                <button type="button" disabled>Request past question</button>
                <button type="button" disabled>My bookmarks</button>
              </div>
              <p style={{ fontSize: 11, color: 'var(--mute)', marginTop: 12 }}>
                These unlock when the resource module is ready.
              </p>
            </div>

            <div className="dash-community">
              <h4>Your community</h4>
              <p>
                {hasInstitution
                  ? `Connected to ${profile?.department?.name || profile?.institution?.name || 'your department'}`
                  : 'Complete your profile to join your department community.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SelectField({ label, name, value, onChange, options = [], disabled = false }) {
  return (
    <div className="dash-field">
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange} disabled={disabled}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.name}</option>
        ))}
      </select>
    </div>
  )
}
