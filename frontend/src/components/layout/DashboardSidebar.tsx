import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Zap, LayoutDashboard, Search, MapPin, Calendar, History, Heart,
  Settings, LogOut, Bell, ChevronRight, BarChart2, TrendingUp,
  Activity, DollarSign, Users, Building2, Cpu, FlaskConical,
  AlertTriangle, ShieldCheck, FileText, Sliders, BrainCircuit,
  Layers, Gauge, Leaf, X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore, useUser } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  icon: React.ReactNode
  href: string
  badge?: string
  section?: string
}

const DRIVER_NAV: NavItem[] = [
  { label: 'Dashboard',       icon: <LayoutDashboard size={16} />, href: '/driver', section: 'Main' },
  { label: 'Find Parking',    icon: <Search size={16} />,          href: '/driver/search' },
  { label: 'AI Recommend',    icon: <BrainCircuit size={16} />,    href: '/driver/recommend' },
  { label: 'My Bookings',     icon: <Calendar size={16} />,        href: '/driver/bookings', section: 'Activity' },
  { label: 'Parking History', icon: <History size={16} />,         href: '/driver/history' },
  { label: 'Saved Places',    icon: <Heart size={16} />,           href: '/driver/saved' },
  { label: 'Eco Impact',      icon: <Leaf size={16} />,            href: '/driver/carbon', section: 'Insights' },
  { label: 'AI Assistant',    icon: <BrainCircuit size={16} />,    href: '/driver/assistant' },
  { label: 'Preferences',     icon: <Settings size={16} />,        href: '/driver/preferences', section: 'Account' },
]

const OPERATOR_NAV: NavItem[] = [
  { label: 'Overview',          icon: <Gauge size={16} />,           href: '/operator', section: 'Dashboard' },
  { label: 'Digital Twin',      icon: <Layers size={16} />,          href: '/operator/digital-twin' },
  { label: 'Live Occupancy',    icon: <Activity size={16} />,        href: '/operator/occupancy' },
  { label: 'Demand Forecast',   icon: <TrendingUp size={16} />,      href: '/operator/forecast', section: 'Intelligence' },
  { label: 'Congestion',        icon: <AlertTriangle size={16} />,   href: '/operator/congestion' },
  { label: 'No-Show Risk',      icon: <ShieldCheck size={16} />,     href: '/operator/noshow' },
  { label: 'What-If Simulator', icon: <FlaskConical size={16} />,    href: '/operator/simulator' },
  { label: 'Dynamic Pricing',   icon: <DollarSign size={16} />,      href: '/operator/pricing', section: 'Optimization' },
  { label: 'Optimization',      icon: <Cpu size={16} />,             href: '/operator/optimization' },
  { label: 'Reservations',      icon: <Calendar size={16} />,        href: '/operator/reservations', section: 'Operations' },
  { label: 'Facilities',        icon: <Building2 size={16} />,       href: '/operator/facilities' },
  { label: 'Analytics',         icon: <BarChart2 size={16} />,       href: '/operator/analytics', section: 'Analytics' },
  { label: 'Sustainability',    icon: <Leaf size={16} />,             href: '/operator/sustainability' },
]

const ADMIN_NAV: NavItem[] = [
  { label: 'Overview',      icon: <Gauge size={16} />,       href: '/admin', section: 'Admin' },
  { label: 'Users',         icon: <Users size={16} />,       href: '/admin/users' },
  { label: 'Operators',     icon: <Building2 size={16} />,   href: '/admin/operators' },
  { label: 'Facilities',    icon: <MapPin size={16} />,      href: '/admin/facilities', section: 'Parking' },
  { label: 'Zones & Slots', icon: <Layers size={16} />,      href: '/admin/zones' },
  { label: 'Pricing Rules', icon: <DollarSign size={16} />,  href: '/admin/pricing' },
  { label: 'ML Models',     icon: <Cpu size={16} />,         href: '/admin/ml-models', section: 'Intelligence' },
  { label: 'Model Eval',    icon: <BarChart2 size={16} />,   href: '/admin/evaluation' },
  { label: 'Audit Logs',    icon: <FileText size={16} />,    href: '/admin/audit', section: 'System' },
  { label: 'Settings',      icon: <Sliders size={16} />,     href: '/admin/settings' },
]

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  DRIVER: DRIVER_NAV,
  OPERATOR: OPERATOR_NAV,
  ADMIN: ADMIN_NAV,
}

interface SidebarProps {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function DashboardSidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useUser()
  const { logout } = useAuthStore()

  const role = user?.role ?? 'DRIVER'
  const navItems = NAV_BY_ROLE[role]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-surface-800 flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-brand-600 flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="font-black text-base text-surface-50">ParkSense<span className="text-brand-400">-X</span></span>
        </Link>
        {mobileOpen && (
          <button onClick={onMobileClose} className="text-surface-400 hover:text-surface-100 lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* User pill */}
      <div className="px-4 py-3 border-b border-surface-800">
        <div className="flex items-center gap-2.5 bg-surface-800 rounded-lg p-2">
          <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-surface-200 truncate">{user?.name}</p>
            <p className="text-2xs text-surface-500 uppercase tracking-wide">{role}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 scrollbar-hide">
        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.href || (item.href !== '/' && item.href !== '/driver' && item.href !== '/operator' && item.href !== '/admin' && location.pathname.startsWith(item.href))
          const showSection = item.section && (idx === 0 || navItems[idx - 1].section !== item.section)
          return (
            <div key={item.href}>
              {showSection && idx > 0 && (
                <p className="px-2 pt-3 pb-1 text-2xs font-semibold text-surface-600 uppercase tracking-widest">
                  {item.section}
                </p>
              )}
              <Link
                to={item.href}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-100 group',
                  isActive
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-600/30'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800',
                )}
              >
                <span className={cn(isActive ? 'text-brand-400' : 'text-surface-500 group-hover:text-surface-300')}>
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && <ChevronRight size={12} className="text-brand-500 flex-shrink-0" />}
                {item.badge && (
                  <span className="text-2xs bg-occupied text-white rounded-full px-1.5 py-0.5 font-bold">{item.badge}</span>
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="flex-shrink-0 px-3 py-3 border-t border-surface-800 space-y-1">
        <Link
          to="/notifications"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
        >
          <Bell size={16} className="text-surface-500" />
          Notifications
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm text-surface-400 hover:text-occupied hover:bg-occupied/10 transition-colors"
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-surface-950 border-r border-surface-800 fixed left-0 top-0 bottom-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="relative w-64 bg-surface-950 border-r border-surface-800 flex flex-col h-full animate-slide-in-right">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
