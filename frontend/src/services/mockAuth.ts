/**
 * Mock Auth Service — DEMO MODE
 * Used when the Spring Boot backend is unavailable.
 * Returns pre-defined demo user accounts.
 */
import type { User } from '@/types'

const MOCK_USERS: (User & { password: string })[] = [
  { id: 1, name: 'Arjun Krishnamurthy', email: 'driver@demo.com',   password: 'Demo1234', role: 'DRIVER',   createdAt: '2025-06-10T10:00:00Z', preferences: { optimizationMode: 'balanced', evOnly: false, accessibleOnly: false, maxWalkDistance: 500, notificationsEnabled: true } },
  { id: 2, name: 'Priya Venkataraman',  email: 'operator@demo.com', password: 'Demo1234', role: 'OPERATOR', createdAt: '2025-01-15T10:00:00Z' },
  { id: 3, name: 'Rajan Subramaniam',   email: 'admin@demo.com',    password: 'Demo1234', role: 'ADMIN',    createdAt: '2024-12-01T10:00:00Z' },
]

function generateToken(user: User): string {
  // Not a real JWT — just a demo token for storage
  return `demo.${btoa(JSON.stringify({ id: user.id, role: user.role }))}.demo`
}

export const mockAuthService = {
  login(email: string, password: string): { token: string; user: User } {
    const found = MOCK_USERS.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid credentials')
    const { password: _, ...user } = found
    const token = generateToken(user)
    localStorage.setItem('psxToken', token)
    localStorage.setItem('psxUser', JSON.stringify(user))
    return { token, user }
  },

  register(name: string, email: string, _password: string, phone?: string): { token: string; user: User } {
    const user: User = {
      id: Date.now(),
      name, email, phone,
      role: 'DRIVER',
      createdAt: new Date().toISOString(),
      preferences: { optimizationMode: 'balanced', evOnly: false, accessibleOnly: false, maxWalkDistance: 500, notificationsEnabled: true },
    }
    const token = generateToken(user)
    localStorage.setItem('psxToken', token)
    localStorage.setItem('psxUser', JSON.stringify(user))
    return { token, user }
  },

  logout() {
    localStorage.removeItem('psxToken')
    localStorage.removeItem('psxUser')
  },
}
