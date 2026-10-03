import { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { useAuthStore } from '@/store/authStore'
import { PageLoader } from '@/components/ui/Spinner'
import type { UserRole } from '@/types'

interface DashboardLayoutProps {
  requiredRole?: UserRole
}

export function DashboardLayout({ requiredRole }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated, user, isLoading } = useAuthStore()

  if (isLoading) return <PageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRole && user?.role !== requiredRole) {
    const redirect = user?.role === 'OPERATOR' ? '/operator' : user?.role === 'ADMIN' ? '/admin' : '/driver'
    return <Navigate to={redirect} replace />
  }

  return (
    <div className="flex min-h-screen bg-surface-950">
      <DashboardSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-60">
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
