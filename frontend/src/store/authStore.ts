import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'
import { authService } from '@/services/authService'
import { mockAuthService } from '@/services/mockAuth'
import { config } from '@/config'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  clearError: () => void
  initFromStorage: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      initFromStorage: () => {
        const rawToken = localStorage.getItem('psxToken')
        const rawUser = localStorage.getItem('psxUser')
        if (rawToken && rawUser) {
          try {
            const user = JSON.parse(rawUser) as User
            set({ token: rawToken, user, isAuthenticated: true })
          } catch { /* ignore */ }
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          let result: { token: string; user: User }
          if (config.demoMode) {
            result = mockAuthService.login(email, password)
          } else {
            result = await authService.login({ email, password })
          }
          set({ token: result.token, user: result.user, isAuthenticated: true, isLoading: false })
        } catch (err: unknown) {
          const msg = (err as Error).message ?? 'Login failed'
          set({ error: msg, isLoading: false })
          throw err
        }
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true, error: null })
        try {
          let result: { token: string; user: User }
          if (config.demoMode) {
            result = mockAuthService.register(name, email, password, phone)
          } else {
            result = await authService.register({ name, email, password, phone })
          }
          set({ token: result.token, user: result.user, isAuthenticated: true, isLoading: false })
        } catch (err: unknown) {
          const msg = (err as Error).message ?? 'Registration failed'
          set({ error: msg, isLoading: false })
          throw err
        }
      },

      logout: () => {
        mockAuthService.logout()
        set({ user: null, token: null, isAuthenticated: false })
      },

      setUser: (user) => set({ user }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'psx-auth',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)

// Convenience selectors
export const useUser = () => useAuthStore((s) => s.user)
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated)
export const useUserRole = (): UserRole | null => useAuthStore((s) => s.user?.role ?? null)
