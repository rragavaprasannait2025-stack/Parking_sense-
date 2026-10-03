import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, TrendingUp, DollarSign, AlertTriangle, Brain, Leaf,
  ChevronRight, Zap, RefreshCw, Users, Car
} from 'lucide-react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, CongestionBadge, DemoBadge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar, OccupancyGauge } from '@/components/ui/ProgressBar'
import {
  DEMO_FACILITIES, DEMO_DEMAND_PREDICTIONS, DEMO_CONGESTION,
  DEMO_NOSHOWS, DEMO_PRICING, DEMO_ANALYTICS,
  generateOccupancyTimeSeries, generateFuturePredictions,
  generateRevenueData
} from '@/services/demoData'
import { formatCurrency, formatPercent, getCongestionBg } from '@/lib/utils'

const CHART_THEME = {
  grid: '#1e293b',
  text: '#64748b',
  brand: '#6366f1',
  available: '#10b981',
  occupied: '#ef4444',
  reserved: '#f59e0b',
}

function OccupancyChart() {
  const historical = generateOccupancyTimeSeries(12)
  const future = generateFuturePredictions()
  const all = [...historical.slice(-8), ...future.slice(0, 4)]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy — Actual vs Predicted</CardTitle>
        <DemoBadge />
      </CardHeader>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={all}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
          <XAxis dataKey="timestamp" hide />
          <YAxis domain={[0, 100]} tick={{ fill: CHART_THEME.text, fontSize: 11 }} unit="%" />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
            labelFormatter={() => ''}
          />
          <ReferenceLine y={80} stroke={CHART_THEME.reserved} strokeDasharray="4 4" label={{ value: 'Alert', fill: CHART_THEME.reserved, fontSize: 10 }} />
          <Area type="monotone" dataKey="actual" name="Actual" stroke={CHART_THEME.brand} fill={`${CHART_THEME.brand}20`} dot={false} strokeWidth={2} />
          <Area type="monotone" dataKey="predicted" name="Predicted" stroke={CHART_THEME.available} fill="none" dot={false} strokeWidth={1.5} strokeDasharray="4 2" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-2 text-xs">
        <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-brand-500 inline-block" /> Actual</div>
        <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-available inline-block border-dashed border-b" /> Predicted</div>
      </div>
    </Card>
  )
}

function RevenueChart() {
  const data = generateRevenueData(14)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue (14 days)</CardTitle>
        <DemoBadge />
      </CardHeader>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={16}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
          <XAxis dataKey="date" tick={{ fill: CHART_THEME.text, fontSize: 10 }} tickFormatter={v => v.slice(5)} interval={2} />
          <YAxis tick={{ fill: CHART_THEME.text, fontSize: 10 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
            formatter={(v: number) => [formatCurrency(v, 'INR'), 'Revenue']}
          />
          <Bar dataKey="revenue" fill={CHART_THEME.brand} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}

function FacilityStatusRow() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facility Status</CardTitle>
        <Link to="/operator/facilities" className="text-xs text-brand-400 flex items-center gap-1">Manage <ChevronRight size={12} /></Link>
      </CardHeader>
      <div className="space-y-3">
        {DEMO_FACILITIES.map(f => (
          <div key={f.id} className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-surface-300 font-medium truncate">{f.name}</span>
                <span className="text-surface-400 flex-shrink-0 ml-2">{f.availableSlots} free</span>
              </div>
              <ProgressBar value={f.occupancyRate} occupancyColor size="xs" />
            </div>
            <CongestionBadge level={f.congestionLevel} />
          </div>
        ))}
      </div>
    </Card>
  )
}

function NoShowAlerts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>No-Show Risk</CardTitle>
        <Link to="/operator/noshow" className="text-xs text-brand-400 flex items-center gap-1">All <ChevronRight size={12} /></Link>
      </CardHeader>
      <div className="space-y-3">
        {DEMO_NOSHOWS.map(ns => (
          <div key={ns.bookingId} className="flex items-center gap-3 p-3 bg-surface-800/50 rounded-lg">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ns.riskLevel === 'HIGH' ? 'bg-occupied' : ns.riskLevel === 'MEDIUM' ? 'bg-reserved' : 'bg-available'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-surface-200">{ns.bookingRef}</p>
              <p className="text-2xs text-surface-400 mt-0.5">No-show probability: {ns.probability}%</p>
            </div>
            <Badge variant={ns.riskLevel === 'HIGH' ? 'error' : ns.riskLevel === 'MEDIUM' ? 'warning' : 'available'} size="sm">
              {ns.riskLevel}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

function PricingRecommendations() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dynamic Pricing</CardTitle>
        <Link to="/operator/pricing" className="text-xs text-brand-400 flex items-center gap-1">Manage <ChevronRight size={12} /></Link>
      </CardHeader>
      <div className="space-y-3">
        {DEMO_PRICING.map((p, i) => (
          <div key={i} className="p-3 bg-surface-800/50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-surface-300 font-medium">{DEMO_FACILITIES.find(f => f.id === p.facilityId)?.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-surface-500 line-through">₹{p.currentPrice}</span>
                <span className={`text-sm font-bold ${p.recommendedPrice > p.currentPrice ? 'text-occupied' : 'text-available'}`}>
                  ₹{p.recommendedPrice}
                </span>
              </div>
            </div>
            <p className="text-2xs text-surface-400">{p.reason}</p>
            <p className="text-2xs text-brand-400 mt-1">Active: {p.effectivePeriod}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

function CongestionPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Congestion Forecast</CardTitle>
        <Link to="/operator/congestion" className="text-xs text-brand-400 flex items-center gap-1">Details <ChevronRight size={12} /></Link>
      </CardHeader>
      <div className="space-y-3">
        {DEMO_CONGESTION.map(c => {
          const f = DEMO_FACILITIES.find(fac => fac.id === c.facilityId)
          return (
            <div key={c.facilityId}>
              <p className="text-xs font-semibold text-surface-300 mb-1.5 truncate">{f?.name}</p>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {[
                  { label: 'Now',  level: c.current },
                  { label: '+30m', level: c.in30m },
                  { label: '+60m', level: c.in60m },
                  { label: '+3h',  level: c.in3h },
                ].map(item => (
                  <div key={item.label} className={`p-1.5 rounded-lg border text-2xs font-semibold ${getCongestionBg(item.level)}`}>
                    <p className="text-surface-400 font-normal mb-0.5">{item.label}</p>
                    {item.level}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default function OperatorDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate real-time refresh
  useEffect(() => {
    const timer = setInterval(() => setLastUpdated(new Date()), 30000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">Operator Dashboard</h1>
          <p className="text-surface-400 text-sm mt-0.5">Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <Button variant="secondary" size="sm" leftIcon={<RefreshCw size={13} />} onClick={() => setLastUpdated(new Date())}>
            Refresh
          </Button>
          <Link to="/operator/digital-twin">
            <Button variant="primary" size="sm" leftIcon={<Activity size={13} />}>
              Digital Twin
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Occupancy" value="72" unit="%" change={12} changeLabel="vs yesterday" icon={<Car size={18} className="text-reserved" />} iconBg="bg-reserved/10" color="text-reserved" />
        <StatCard title="Revenue Today" value="₹28.4k" change={8.2} changeLabel="vs avg" icon={<DollarSign size={18} className="text-available" />} iconBg="bg-available/10" color="text-available" />
        <StatCard title="60-min Forecast" value="91" unit="%" description="Peak period expected" icon={<TrendingUp size={18} className="text-occupied" />} iconBg="bg-occupied/10" color="text-occupied" />
        <StatCard title="Active Bookings" value="184" change={4.1} changeLabel="vs hour ago" icon={<Activity size={18} className="text-brand-400" />} iconBg="bg-brand-900/50" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        <OccupancyChart />
        <RevenueChart />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <FacilityStatusRow />
          <CongestionPanel />
        </div>
        <div className="space-y-5">
          <NoShowAlerts />
          <PricingRecommendations />
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Digital Twin',    href: '/operator/digital-twin',    icon: <Activity size={16} />,   color: 'text-brand-400' },
          { label: 'What-If Sim',     href: '/operator/simulator',        icon: <Zap size={16} />,        color: 'text-reserved' },
          { label: 'Demand Forecast', href: '/operator/forecast',         icon: <TrendingUp size={16} />, color: 'text-occupied' },
          { label: 'Analytics',       href: '/operator/analytics',        icon: <Brain size={16} />,      color: 'text-available' },
        ].map(a => (
          <Link key={a.href} to={a.href}>
            <div className="flex items-center gap-2.5 p-3 bg-surface-900 border border-surface-800 rounded-xl hover:border-surface-700 transition-colors cursor-pointer">
              <span className={a.color}>{a.icon}</span>
              <span className="text-sm font-medium text-surface-300">{a.label}</span>
              <ChevronRight size={12} className="text-surface-600 ml-auto" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
