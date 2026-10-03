import { Link } from 'react-router-dom'
import {
  Search, Calendar, MapPin, Brain, TrendingUp, Leaf,
  Clock, Bell, Star, ArrowRight, ChevronRight, Activity,
  Car, CheckCircle, AlertTriangle
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge, BookingStatusBadge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar, OccupancyGauge } from '@/components/ui/ProgressBar'
import { useUser } from '@/store/authStore'
import {
  DEMO_FACILITIES, DEMO_BOOKINGS, DEMO_RECOMMENDATION,
  DEMO_NOTIFICATIONS, DEMO_DEMAND_PREDICTIONS
} from '@/services/demoData'
import { formatDateTime, formatCurrency, formatDuration } from '@/lib/utils'

function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: 'Find Parking',    icon: <Search size={18} />,   href: '/driver/search',    color: 'bg-brand-900/50 text-brand-300 border-brand-800/50' },
        { label: 'AI Recommend',    icon: <Brain size={18} />,     href: '/driver/recommend', color: 'bg-available/10 text-available border-available/20' },
        { label: 'My Bookings',     icon: <Calendar size={18} />, href: '/driver/bookings',  color: 'bg-reserved/10 text-reserved border-reserved/20' },
        { label: 'Eco Impact',      icon: <Leaf size={18} />,      href: '/driver/carbon',    color: 'bg-eco/10 text-eco border-eco/20' },
      ].map(a => (
        <Link key={a.label} to={a.href}>
          <div className={`flex flex-col items-center justify-center gap-2 p-4 border rounded-xl text-center cursor-pointer hover:opacity-80 transition-opacity ${a.color}`}>
            {a.icon}
            <span className="text-xs font-semibold">{a.label}</span>
          </div>
        </Link>
      ))}
    </div>
  )
}

function UpcomingBooking() {
  const booking = DEMO_BOOKINGS.find(b => b.status === 'CONFIRMED')
  if (!booking) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reservation</CardTitle>
        <BookingStatusBadge status={booking.status} />
      </CardHeader>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-900/50 border border-brand-800/40 flex items-center justify-center flex-shrink-0">
            <Car size={18} className="text-brand-400" />
          </div>
          <div>
            <p className="font-bold text-surface-100">{booking.facilityName}</p>
            <p className="text-sm text-surface-400">Slot {booking.slotCode} · Level {booking.floor} · Zone {booking.zone}</p>
            <p className="text-xs text-surface-500 mt-0.5">Ref: {booking.bookingRef}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-surface-800">
          <div>
            <p className="text-2xs text-surface-500">Entry</p>
            <p className="text-xs font-semibold text-surface-200 mt-0.5">{formatDateTime(booking.startTime)}</p>
          </div>
          <div>
            <p className="text-2xs text-surface-500">Duration</p>
            <p className="text-xs font-semibold text-surface-200 mt-0.5">{formatDuration(booking.duration)}</p>
          </div>
          <div>
            <p className="text-2xs text-surface-500">Amount</p>
            <p className="text-xs font-semibold text-available mt-0.5">{formatCurrency(booking.totalAmount, booking.currency)}</p>
          </div>
        </div>
        {booking.noShowProbability && booking.noShowProbability > 50 && (
          <div className="flex items-start gap-2 p-2.5 bg-occupied/10 border border-occupied/20 rounded-lg">
            <AlertTriangle size={14} className="text-occupied mt-0.5 flex-shrink-0" />
            <p className="text-xs text-occupied">No-show risk: {booking.noShowProbability}% — AI recommends arriving on time to keep your slot.</p>
          </div>
        )}
        <Link to={`/driver/bookings/${booking.id}`}>
          <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
            View QR Pass
          </Button>
        </Link>
      </div>
    </Card>
  )
}

function RecommendationWidget() {
  const rec = DEMO_RECOMMENDATION
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendation</CardTitle>
        <DemoBadge />
      </CardHeader>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-black text-surface-50">Slot {rec.slot.slotCode}</p>
            <p className="text-sm text-surface-400">{rec.facilityName}</p>
          </div>
          <OccupancyGauge value={rec.suitabilityScore} size={64} />
        </div>
        <div className="space-y-1.5">
          {rec.factors.slice(0, 4).map(f => (
            <ProgressBar key={f.name} value={f.score} label={f.name} showValue size="xs" color="#6366f1" />
          ))}
        </div>
        <p className="text-xs text-surface-400 leading-relaxed border-t border-surface-800 pt-3">
          {rec.explanation.slice(0, 120)}…
        </p>
        <Link to="/driver/recommend">
          <Button variant="secondary" size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
            Full Recommendation
          </Button>
        </Link>
      </div>
    </Card>
  )
}

function NearbyFacilities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nearby Facilities</CardTitle>
        <Link to="/driver/search" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
          View all <ChevronRight size={12} />
        </Link>
      </CardHeader>
      <div className="space-y-3">
        {DEMO_FACILITIES.map(f => (
          <Link key={f.id} to={`/driver/facility/${f.id}`}>
            <div className="flex items-center justify-between p-3 bg-surface-800/50 hover:bg-surface-800 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} className="text-surface-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-200 leading-none">{f.name}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{f.distanceKm} km away</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: f.occupancyRate > 85 ? '#ef4444' : f.occupancyRate > 70 ? '#f59e0b' : '#10b981' }}>
                  {f.availableSlots} free
                </p>
                <p className="text-xs text-surface-500">₹{f.pricePerHour}/hr</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}

function RecentActivity() {
  const completed = DEMO_BOOKINGS.filter(b => b.status === 'COMPLETED')
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <Link to="/driver/history" className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
          All history <ChevronRight size={12} />
        </Link>
      </CardHeader>
      {completed.length === 0 ? (
        <div className="text-center py-6 text-surface-500 text-sm">No completed sessions yet.</div>
      ) : (
        <div className="space-y-3">
          {completed.map(b => (
            <div key={b.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-available/10 border border-available/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={14} className="text-available" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-200 truncate">{b.facilityName}</p>
                <p className="text-xs text-surface-500">{formatDateTime(b.startTime)} · Slot {b.slotCode}</p>
              </div>
              <p className="text-sm font-semibold text-available flex-shrink-0">{formatCurrency(b.totalAmount, b.currency)}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function NotificationsWidget() {
  const unread = DEMO_NOTIFICATIONS.filter(n => !n.isRead).slice(0, 3)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        {unread.length > 0 && <Badge variant="error" size="sm">{unread.length} new</Badge>}
      </CardHeader>
      <div className="space-y-3">
        {unread.length === 0 ? (
          <p className="text-sm text-surface-500 text-center py-4">All caught up!</p>
        ) : unread.map(n => (
          <div key={n.id} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? 'bg-surface-600' : 'bg-brand-500'}`} />
            <div>
              <p className="text-sm font-medium text-surface-200">{n.title}</p>
              <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function DriverDashboard() {
  const user = useUser()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">{greeting()}, {user?.name?.split(' ')[0]}</h1>
          <p className="text-surface-400 text-sm mt-0.5">Here's your parking overview</p>
        </div>
        <DemoBadge />
      </div>

      {/* Quick actions */}
      <QuickActions />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Bookings this month" value="4" change={33} changeLabel="vs last month" icon={<Calendar size={18} className="text-brand-400" />} iconBg="bg-brand-900/50" />
        <StatCard title="Amount saved" value="₹240" description="vs peak pricing" icon={<Activity size={18} className="text-available" />} iconBg="bg-available/10" color="text-available" />
        <StatCard title="CO₂ saved" value="3.2" unit="kg" description="from optimized routing" icon={<Leaf size={18} className="text-eco" />} iconBg="bg-eco/10" color="text-eco" />
        <StatCard title="Avg search time" value="2.1" unit="min" description="vs 8.4 min industry avg" change={-75} changeLabel="improvement" icon={<Clock size={18} className="text-reserved" />} iconBg="bg-reserved/10" />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <UpcomingBooking />
          <NearbyFacilities />
          <RecentActivity />
        </div>
        <div className="space-y-5">
          <RecommendationWidget />
          <NotificationsWidget />
        </div>
      </div>
    </div>
  )
}
