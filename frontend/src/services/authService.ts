import api from './api'
import type { User, LoginCredentials, RegisterPayload } from '@/types'

export interface AuthResponse {
  token: string
  user: User
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials)
    localStorage.setItem('psxToken', data.token)
    localStorage.setItem('psxUser', JSON.stringify(data.user))
    return data
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', payload)
    localStorage.setItem('psxToken', data.token)
    localStorage.setItem('psxUser', JSON.stringify(data.user))
    return data
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await api.get<User>('/auth/me')
    return data
  },

  logout(): void {
    localStorage.removeItem('psxToken')
    localStorage.removeItem('psxUser')
  },

  getStoredToken(): string | null {
    return localStorage.getItem('psxToken')
  },

  getStoredUser(): User | null {
    try {
      const raw = localStorage.getItem('psxUser')
      return raw ? (JSON.parse(raw) as User) : null
    } catch {
      return null
    }
  },
}
