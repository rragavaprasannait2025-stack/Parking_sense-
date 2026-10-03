import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'For Drivers', href: '/#for-drivers' },
  { label: 'For Operators', href: '/#for-operators' },
  { label: 'About', href: '/about' },
]

export function PublicNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const dashboardPath = user?.role === 'OPERATOR' ? '/operator' : user?.role === 'ADMIN' ? '/admin' : '/driver'

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-surface-950/90 backdrop-blur-md border-b border-surface-800 shadow-lg'
          : 'bg-transparent',
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="ParkSense-X Home">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-glow-brand group-hover:bg-brand-500 transition-colors">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <span className="font-black text-lg text-surface-50 tracking-tight">ParkSense</span>
            <span className="font-black text-lg text-brand-400 tracking-tight">-X</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-surface-400 hover:text-surface-100 rounded-lg hover:bg-surface-800/50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <Link to={dashboardPath}>
              <Button variant="primary" size="sm">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-surface-400 hover:text-surface-100"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-surface-900 border-b border-surface-800 animate-slide-down">
          <div className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm text-surface-300 hover:text-surface-100 rounded-lg hover:bg-surface-800"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="divider my-2" />
            {isAuthenticated ? (
              <Link to={dashboardPath} onClick={() => setIsOpen(false)}>
                <Button variant="primary" size="sm" fullWidth>Dashboard</Button>
              </Link>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" size="sm" fullWidth>Log in</Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" size="sm" fullWidth>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
