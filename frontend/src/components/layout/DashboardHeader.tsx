import { useState } from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useUser } from '@/store/authStore'
import { DemoBadge } from '@/components/ui/Badge'
import { DEMO_NOTIFICATIONS } from '@/services/demoData'

interface DashboardHeaderProps {
  onMenuClick?: () => void
  title?: string
  subtitle?: string
}

export function DashboardHeader({ onMenuClick, title, subtitle }: DashboardHeaderProps) {
  const user = useUser()
  const unreadCount = DEMO_NOTIFICATIONS.filter(n => !n.isRead).length

  return (
    <header className="h-14 bg-surface-950/80 backdrop-blur-md border-b border-surface-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 text-surface-400 hover:text-surface-100 hover:bg-surface-800 rounded-lg"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div>
          {title && <h1 className="text-sm font-semibold text-surface-100 leading-none">{title}</h1>}
          {subtitle && <p className="text-xs text-surface-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <DemoBadge />

        <Link
          to="/notifications"
          className="relative p-2 text-surface-400 hover:text-surface-100 hover:bg-surface-800 rounded-lg transition-colors"
          aria-label={`${unreadCount} unread notifications`}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-occupied text-white text-2xs font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Link>

        <Link to={user?.role === 'OPERATOR' ? '/operator/profile' : '/driver/preferences'}>
          <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:bg-brand-600 transition-colors">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
        </Link>
      </div>
    </header>
  )
}
