import { cn } from '@/lib/utils'
import type { SlotStatus, CongestionLevel, BookingStatus } from '@/types'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'available' | 'occupied' | 'reserved' | 'maintenance' | 'demo' | 'info' | 'warning' | 'error'
  size?: 'sm' | 'md'
  dot?: boolean
}

const variantClasses = {
  default:     'bg-surface-800 text-surface-300 border-surface-700',
  available:   'bg-available/10 text-available border-available/20',
  occupied:    'bg-occupied/10 text-occupied border-occupied/20',
  reserved:    'bg-reserved/10 text-reserved border-reserved/20',
  maintenance: 'bg-surface-800 text-surface-400 border-surface-700',
  demo:        'bg-reserved/10 text-reserved border-reserved/30 tracking-wide uppercase',
  info:        'bg-brand-900/60 text-brand-300 border-brand-700/30',
  warning:     'bg-orange-400/10 text-orange-300 border-orange-400/20',
  error:       'bg-occupied/10 text-occupied border-occupied/20',
}

export function Badge({ variant = 'default', size = 'sm', dot, className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'available' ? 'bg-available' :
          variant === 'occupied'  ? 'bg-occupied' :
          variant === 'reserved'  ? 'bg-reserved' :
          'bg-surface-400'
        )} />
      )}
      {children}
    </span>
  )
}

export function SlotStatusBadge({ status }: { status: SlotStatus }) {
  const map: Record<SlotStatus, BadgeProps['variant']> = {
    AVAILABLE: 'available', OCCUPIED: 'occupied', RESERVED: 'reserved',
    MAINTENANCE: 'maintenance', INACTIVE: 'maintenance',
  }
  return <Badge variant={map[status]} dot>{status}</Badge>
}

export function CongestionBadge({ level }: { level: CongestionLevel }) {
  const map: Record<CongestionLevel, BadgeProps['variant']> = {
    LOW: 'available', MEDIUM: 'warning', HIGH: 'error', CRITICAL: 'error',
  }
  return <Badge variant={map[level]} dot>{level}</Badge>
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, BadgeProps['variant']> = {
    PENDING: 'warning', CONFIRMED: 'info', ACTIVE: 'available',
    COMPLETED: 'default', CANCELLED: 'maintenance', NO_SHOW: 'error', EXPIRED: 'maintenance',
  }
  return <Badge variant={map[status]} dot>{status.replace('_', ' ')}</Badge>
}

export function DemoBadge() {
  return (
    <Badge variant="demo">
      <span className="animate-pulse">⚡</span> SIMULATION DATA
    </Badge>
  )
}
