import { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils'

interface TabsContextType {
  active: string
  setActive: (v: string) => void
}
const TabsCtx = createContext<TabsContextType>({ active: '', setActive: () => {} })

interface TabsProps {
  defaultTab?: string
  onChange?: (tab: string) => void
  children: React.ReactNode
  className?: string
}
export function Tabs({ defaultTab = '', onChange, children, className }: TabsProps) {
  const [active, setActiveState] = useState(defaultTab)
  const setActive = (v: string) => { setActiveState(v); onChange?.(v) }
  return (
    <TabsCtx.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  )
}

interface TabListProps {
  children: React.ReactNode
  className?: string
}
export function TabList({ children, className }: TabListProps) {
  return (
    <div
      role="tablist"
      className={cn('flex gap-1 bg-surface-800 p-1 rounded-lg border border-surface-700', className)}
    >
      {children}
    </div>
  )
}

interface TabProps {
  value: string
  children: React.ReactNode
  icon?: React.ReactNode
}
export function Tab({ value, children, icon }: TabProps) {
  const { active, setActive } = useContext(TabsCtx)
  const isActive = active === value
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActive(value)}
      className={cn(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-surface-900 text-surface-50 shadow-sm border border-surface-700'
          : 'text-surface-400 hover:text-surface-200 hover:bg-surface-700/50',
      )}
    >
      {icon}
      {children}
    </button>
  )
}

interface TabPanelProps {
  value: string
  children: React.ReactNode
  className?: string
}
export function TabPanel({ value, children, className }: TabPanelProps) {
  const { active } = useContext(TabsCtx)
  if (active !== value) return null
  return <div role="tabpanel" className={cn('animate-fade-in', className)}>{children}</div>
}
