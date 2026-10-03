import axios, { type AxiosInstance, type AxiosError } from 'axios'
import { config } from '@/config'

// ─── Axios instance ───────────────────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: config.apiBase,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// ─── Request interceptor — attach JWT ────────────────────────────────────────

api.interceptors.request.use((req) => {
  const token = localStorage.getItem('psxToken')
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

// ─── Response interceptor — handle auth errors ───────────────────────────────

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('psxToken')
      localStorage.removeItem('psxUser')
      window.dispatchEvent(new Event('auth:logout'))
    }
    return Promise.reject(error)
  }
)

export default api
