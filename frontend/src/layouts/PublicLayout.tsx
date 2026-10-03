import { Outlet } from 'react-router-dom'
import { PublicNav } from '@/components/layout/PublicNav'

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-surface-950">
      <PublicNav />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
