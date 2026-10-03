import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, ArrowRight, User, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading, isAuthenticated, user } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (isAuthenticated && user) {
    return <Navigate to="/driver" replace />
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await register(form.name, form.email, form.password, form.phone || undefined)
      navigate('/driver')
      toast.success('Account created! Welcome to ParkSense-X.')
    } catch {
      toast.error('Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4 pt-16 pb-8">
      <div className="w-full max-w-md animate-slide-up">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-black text-xl text-surface-50">ParkSense<span className="text-brand-400">-X</span></span>
        </Link>

        <Card className="p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-surface-50">Create your account</h1>
            <p className="text-sm text-surface-400 mt-1">Start your intelligent parking journey</p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Full name"
              type="text"
              value={form.name}
              onChange={set('name')}
              error={errors.name}
              placeholder="Arjun Krishnamurthy"
              autoComplete="name"
              leftIcon={<User size={14} />}
              autoFocus
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <Input
              label="Phone (optional)"
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+91 98412 34567"
              autoComplete="tel"
              leftIcon={<Phone size={14} />}
            />
            <Input
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              hint="Min. 8 characters"
              rightIcon={
                <button type="button" onClick={() => setShowPass(!showPass)} aria-label={showPass ? 'Hide' : 'Show'}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />
            <Input
              label="Confirm password"
              type="password"
              value={form.confirm}
              onChange={set('confirm')}
              error={errors.confirm}
              placeholder="Repeat password"
              autoComplete="new-password"
            />

            <p className="text-xs text-surface-500">
              By creating an account you agree to our{' '}
              <Link to="/terms" className="text-brand-400 hover:text-brand-300">Terms</Link> and{' '}
              <Link to="/privacy" className="text-brand-400 hover:text-brand-300">Privacy Policy</Link>.
            </p>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={isLoading}
              rightIcon={<ArrowRight size={16} />}
            >
              Create account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-surface-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
