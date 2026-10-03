import { cn } from '@/lib/utils'
import { getOccupancyColor } from '@/lib/utils'

interface ProgressBarProps {
  value: number       // 0-100
  max?: number
  size?: 'xs' | 'sm' | 'md'
  color?: string
  occupancyColor?: boolean
  label?: string
  showValue?: boolean
  className?: string
  animated?: boolean
}

const sizeClasses = { xs: 'h-1', sm: 'h-1.5', md: 'h-2.5' }

export function ProgressBar({
  value, max = 100, size = 'sm', color, occupancyColor, label, showValue, className, animated
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const barColor = color ?? (occupancyColor ? getOccupancyColor(pct) : '#6366f1')

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-xs text-surface-400">{label}</span>}
          {showValue && <span className="text-xs font-medium text-surface-300">{value.toFixed(1)}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-surface-800 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-700', animated && 'animate-pulse-slow')}
          style={{ width: `${pct}%`, backgroundColor: barColor }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

export function OccupancyGauge({ value, size = 80 }: { value: number; size?: number }) {
  const color = getOccupancyColor(value)
  const circumference = 2 * Math.PI * 30
  const stroke = circumference - (value / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="30" fill="none" stroke="#1e293b" strokeWidth="8" />
        <circle
          cx="40" cy="40" r="30" fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={stroke}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>{value}%</span>
    </div>
  )
}
