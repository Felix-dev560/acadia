import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // required for Laravel Sanctum SPA auth
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

// Get CSRF cookie before any state-changing request
export async function getCsrfCookie() {
  await api.get('/sanctum/csrf-cookie')
}

// Auth
export async function register(data) {
  await getCsrfCookie()
  const res = await api.post('/api/v1/auth/register', data)
  return res.data
}

export async function login(data) {
  await getCsrfCookie()
  const res = await api.post('/api/v1/auth/login', data)
  return res.data
}

export async function logout() {
  await getCsrfCookie()
  const res = await api.post('/api/v1/auth/logout')
  return res.data
}

export async function getMe() {
  const res = await api.get('/api/v1/auth/me')
  return res.data
}

// Profile
export async function updateProfile(data) {
  await getCsrfCookie()
  const res = await api.put('/api/v1/profile', data)
  return res.data
}

// Academic hierarchy (public)
export async function getCountries() {
  const res = await api.get('/api/v1/countries')
  return res.data
}

export async function getInstitutions() {
  const res = await api.get('/api/v1/institutions')
  return res.data
}

export async function getFaculties(institutionId) {
  const res = await api.get(`/api/v1/institutions/${institutionId}/faculties`)
  return res.data
}

export async function getDepartments(facultyId) {
  const res = await api.get(`/api/v1/faculties/${facultyId}/departments`)
  return res.data
}

export async function getAcademicLevels() {
  const res = await api.get('/api/v1/academic-levels')
  return res.data
}

export default api
