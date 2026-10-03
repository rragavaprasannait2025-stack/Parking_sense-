import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' }

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin text-brand-500', sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Loading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center">
          <span className="text-2xl font-black text-white">P</span>
        </div>
        <Spinner size="lg" />
        <p className="text-surface-400 text-sm">Loading ParkSense-X…</p>
      </div>
    </div>
  )
}

export function InlineLoader({ text = 'Loading…' }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 text-surface-400 py-8 justify-center">
      <Spinner size="sm" />
      <span className="text-sm">{text}</span>
    </div>
  )
}
