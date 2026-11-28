import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'acadia_token'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Attach Bearer token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function saveToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

// Auth
export async function register(data) {
  const res = await api.post('/api/v1/auth/register', data)
  return res.data
}

export async function login(data) {
  const res = await api.post('/api/v1/auth/login', data)
  return res.data
}

export async function logout() {
  const res = await api.post('/api/v1/auth/logout')
  return res.data
}

export async function getMe() {
  const res = await api.get('/api/v1/auth/me')
  return res.data
}

// Profile
export async function updateProfile(data) {
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