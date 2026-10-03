import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell, CheckCircle2, AlertTriangle, Clock, Calendar,
  Trash2, CheckCheck, Filter, ArrowRight, ShieldAlert, Sparkles
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { DEMO_NOTIFICATIONS } from '@/services/demoData'
import type { Notification } from '@/types'
import toast from 'react-hot-toast'

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS)
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'BOOKING' | 'ALERT'>('ALL')

  const unreadCount = notifications.filter(n => !n.isRead).length

  const filtered = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead
    if (filter === 'BOOKING') return n.type.includes('BOOKING')
    if (filter === 'ALERT') return n.type.includes('ALERT') || n.priority === 'HIGH' || n.priority === 'CRITICAL'
    return true
  })

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    toast.success('All notifications marked as read')
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
      case 'HIGH':
        return { badge: 'error' as const, icon: <AlertTriangle size={14} className="text-occupied" />, bg: 'bg-occupied/10 border-occupied/20' }
      case 'MEDIUM':
        return { badge: 'warning' as const, icon: <Clock size={14} className="text-reserved" />, bg: 'bg-reserved/10 border-reserved/20' }
      default:
        return { badge: 'info' as const, icon: <Sparkles size={14} className="text-brand-400" />, bg: 'bg-brand-900/40 border-brand-800/40' }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Bell size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">Notification Center</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            System events, live reservation alerts, peak demand forecasts, and parking passes
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck size={14} />}
              onClick={markAllAsRead}
            >
              Mark all read ({unreadCount})
            </Button>
          )}
          <DemoBadge />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-surface-800 pb-3 overflow-x-auto scrollbar-hide">
        {[
          { key: 'ALL', label: 'All Notifications', count: notifications.length },
          { key: 'UNREAD', label: 'Unread', count: unreadCount },
          { key: 'BOOKING', label: 'Bookings', count: notifications.filter(n => n.type.includes('BOOKING')).length },
          { key: 'ALERT', label: 'Urgent Alerts', count: notifications.filter(n => n.priority === 'HIGH' || n.priority === 'CRITICAL').length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              filter === t.key
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-surface-800/80 text-surface-400 hover:text-surface-200 hover:bg-surface-700'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-2xs ${filter === t.key ? 'bg-brand-800 text-white' : 'bg-surface-900 text-surface-400'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <CheckCircle2 size={36} className="text-available mx-auto mb-3" />
          <p className="text-surface-300 font-bold text-base">You're all caught up!</p>
          <p className="text-xs text-surface-500 mt-1">No notifications matching the active filter.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map(n => {
            const pStyle = getPriorityStyle(n.priority)
            return (
              <Card
                key={n.id}
                className={`p-4 transition-all ${
                  n.isRead
                    ? 'bg-surface-900/60 border-surface-800/80 opacity-80'
                    : 'bg-surface-900 border-surface-700 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${pStyle.bg}`}>
                      {pStyle.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`font-bold text-sm ${n.isRead ? 'text-surface-300' : 'text-surface-50'}`}>
                          {n.title}
                        </span>
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        )}
                        <Badge variant={pStyle.badge} size="sm">{n.priority}</Badge>
                      </div>

                      <p className="text-xs text-surface-300 leading-relaxed">{n.message}</p>

                      <div className="flex items-center gap-4 mt-2.5 text-2xs text-surface-500">
                        <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span>·</span>
                        <span className="capitalize">{n.type.toLowerCase().replace('_', ' ')}</span>

                        {n.actionUrl && (
                          <Link
                            to={n.actionUrl}
                            className="text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 ml-auto"
                          >
                            Take Action <ArrowRight size={11} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="p-1.5 text-surface-500 hover:text-surface-200 rounded-lg hover:bg-surface-800 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCheck size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(n.id)}
                      className="p-1.5 text-surface-500 hover:text-occupied rounded-lg hover:bg-surface-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
