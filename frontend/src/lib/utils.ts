import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import type { CongestionLevel, SlotStatus, OptimizationMode } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date / Time ─────────────────────────────────────────────────────────────

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'dd MMM yyyy, HH:mm')
}

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'dd MMM yyyy')
}

export function formatTime(iso: string): string {
  return format(parseISO(iso), 'HH:mm')
}

export function timeAgo(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true })
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// ─── Numbers ─────────────────────────────────────────────────────────────────

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

// ─── Status helpers ──────────────────────────────────────────────────────────

export function getSlotStatusColor(status: SlotStatus): string {
  switch (status) {
    case 'AVAILABLE':    return 'text-available'
    case 'OCCUPIED':     return 'text-occupied'
    case 'RESERVED':     return 'text-reserved'
    case 'MAINTENANCE':  return 'text-surface-400'
    case 'INACTIVE':     return 'text-surface-600'
    default:             return 'text-surface-400'
  }
}

export function getSlotStatusBg(status: SlotStatus): string {
  switch (status) {
    case 'AVAILABLE':    return 'slot-available'
    case 'OCCUPIED':     return 'slot-occupied'
    case 'RESERVED':     return 'slot-reserved'
    case 'MAINTENANCE':  return 'slot-maintenance'
    default:             return 'slot-maintenance'
  }
}

export function getCongestionColor(level: CongestionLevel): string {
  switch (level) {
    case 'LOW':      return 'text-available'
    case 'MEDIUM':   return 'text-reserved'
    case 'HIGH':     return 'text-orange-400'
    case 'CRITICAL': return 'text-occupied'
    default:         return 'text-surface-400'
  }
}

export function getCongestionBg(level: CongestionLevel): string {
  switch (level) {
    case 'LOW':      return 'bg-available/10 border-available/30 text-available'
    case 'MEDIUM':   return 'bg-reserved/10 border-reserved/30 text-reserved'
    case 'HIGH':     return 'bg-orange-400/10 border-orange-400/30 text-orange-400'
    case 'CRITICAL': return 'bg-occupied/10 border-occupied/30 text-occupied'
    default:         return 'bg-surface-800 border-surface-700 text-surface-400'
  }
}

export function getOccupancyColor(rate: number): string {
  if (rate < 50) return '#10b981'
  if (rate < 75) return '#f59e0b'
  if (rate < 90) return '#f97316'
  return '#ef4444'
}

// ─── Optimization mode ───────────────────────────────────────────────────────

export const OPTIMIZATION_MODES: Record<OptimizationMode, { label: string; icon: string; description: string }> = {
  balanced:  { label: 'Balanced',  icon: '⚖️', description: 'Best overall match' },
  cheapest:  { label: 'Cheapest',  icon: '💰', description: 'Minimize parking cost' },
  closest:   { label: 'Closest',   icon: '📍', description: 'Minimum walking distance' },
  fastest:   { label: 'Fastest',   icon: '⚡', description: 'Quickest to reach' },
  greenest:  { label: 'Greenest',  icon: '🌱', description: 'Lowest carbon impact' },
}

// ─── Misc ─────────────────────────────────────────────────────────────────────

export function generateBookingRef(): string {
  return `PX${Math.floor(1000 + Math.random() * 9000)}`
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}…` : str
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
