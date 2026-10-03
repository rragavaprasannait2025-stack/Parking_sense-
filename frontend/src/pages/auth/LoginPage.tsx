import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const DEMO_ACCOUNTS = [
  { label: 'Driver',   email: 'driver@demo.com',   password: 'Demo1234', role: 'DRIVER'   },
  { label: 'Operator', email: 'operator@demo.com',  password: 'Demo1234', role: 'OPERATOR' },
  { label: 'Admin',    email: 'admin@demo.com',     password: 'Demo1234', role: 'ADMIN'    },
]

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, isAuthenticated, user, clearError } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  if (isAuthenticated && user) {
    const redirect = user.role === 'OPERATOR' ? '/operator' : user.role === 'ADMIN' ? '/admin' : '/driver'
    return <Navigate to={redirect} replace />
  }

  const validate = () => {
    const e: typeof errors = {}
    if (!email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await login(email, password)
      const role = useAuthStore.getState().user?.role
      const redirect = role === 'OPERATOR' ? '/operator' : role === 'ADMIN' ? '/admin' : '/driver'
      navigate(redirect)
      toast.success('Welcome back!')
    } catch {
      toast.error('Invalid credentials. Try a demo account below.')
    }
  }

  const fillDemo = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
    setErrors({})
    clearError()
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-black text-xl text-surface-50">ParkSense<span className="text-brand-400">-X</span></span>
        </Link>

        <Card className="p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-surface-50">Welcome back</h1>
            <p className="text-sm text-surface-400 mt-1">Sign in to your ParkSense-X account</p>
          </div>

          {/* Demo accounts */}
          <div className="mb-5 p-3 bg-brand-900/30 border border-brand-800/40 rounded-lg">
            <p className="text-xs text-brand-300 font-semibold mb-2">⚡ Demo Accounts</p>
            <div className="flex gap-2 flex-wrap">
              {DEMO_ACCOUNTS.map(a => (
                <button
                  key={a.role}
                  type="button"
                  onClick={() => fillDemo(a.email, a.password)}
                  className="px-2.5 py-1 text-xs bg-surface-800 border border-surface-700 hover:border-brand-600 text-surface-300 hover:text-brand-300 rounded-md transition-colors"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })) }}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
              autoFocus
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })) }}
              error={errors.password}
              placeholder="Your password"
              autoComplete="current-password"
              rightIcon={
                <button type="button" onClick={() => setShowPass(!showPass)} aria-label={showPass ? 'Hide password' : 'Show password'}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={isLoading}
              rightIcon={<ArrowRight size={16} />}
            >
              Sign in
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-surface-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </Card>

        <p className="mt-4 text-center text-xs text-surface-600">
          All data is demo/simulation only. No real parking data is used.
        </p>
      </div>
    </div>
  )
}
