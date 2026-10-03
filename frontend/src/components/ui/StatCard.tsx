import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from './Card'

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  iconBg?: string
  color?: string
  description?: string
  className?: string
  size?: 'sm' | 'md'
}

export function StatCard({
  title, value, unit, change, changeLabel, icon, iconBg, color, description, className, size = 'md'
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0
  const isNegative = change !== undefined && change < 0
  const isNeutral  = change !== undefined && change === 0

  return (
    <Card className={cn('', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide truncate">{title}</p>
          <div className="mt-1.5 flex items-end gap-1">
            <span
              className={cn('font-bold tabular-nums leading-none', size === 'md' ? 'text-3xl' : 'text-2xl', color ?? 'text-surface-50')}
            >
              {value}
            </span>
            {unit && <span className="text-sm text-surface-400 mb-0.5">{unit}</span>}
          </div>
          {description && <p className="mt-1 text-xs text-surface-500 truncate">{description}</p>}
          {change !== undefined && (
            <div className={cn(
              'mt-2 inline-flex items-center gap-1 text-xs font-medium',
              isPositive ? 'text-available' : isNegative ? 'text-occupied' : 'text-surface-400',
            )}>
              {isPositive ? <TrendingUp size={12} /> : isNegative ? <TrendingDown size={12} /> : <Minus size={12} />}
              <span>{isPositive ? '+' : ''}{change}% {changeLabel}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ml-3', iconBg ?? 'bg-brand-900/50')}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
