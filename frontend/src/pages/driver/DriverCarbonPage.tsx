import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Leaf, Zap, Car, TrendingDown, Award, CheckCircle,
  HelpCircle, ArrowRight, Sparkles, Navigation
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { DEMO_BOOKINGS } from '@/services/demoData'
import { formatDateTime } from '@/lib/utils'

const monthlyEcoData = [
  { month: 'Mar', savedKg: 2.1, baselineKg: 5.4 },
  { month: 'Apr', savedKg: 3.4, baselineKg: 7.2 },
  { month: 'May', savedKg: 4.8, baselineKg: 9.6 },
  { month: 'Jun', savedKg: 4.2, baselineKg: 8.8 },
  { month: 'Jul', savedKg: 6.1, baselineKg: 12.0 },
  { month: 'Aug', savedKg: 5.8, baselineKg: 11.4 },
]

export default function DriverCarbonPage() {
  const [ecoModeEnabled, setEcoModeEnabled] = useState(true)

  const completedBookings = DEMO_BOOKINGS.filter(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED')
  const totalCarbonSaved = completedBookings.reduce((sum, b) => sum + (b.carbonKg ?? 0.8), 0)

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-eco/20 border border-eco/30 flex items-center justify-center text-eco">
              <Leaf size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">My Carbon Impact</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Personal sustainability footprint · Powered by ParkSense-X Greenest Allocation Engine
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="available" size="md">
            <Award size={12} className="mr-1 inline" /> Level 3 Eco Driver
          </Badge>
          <DemoBadge />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total CO₂ Saved"
          value={`${totalCarbonSaved.toFixed(1)} kg`}
          description="vs unoptimized cruising"
          color="text-eco"
          icon={<Leaf size={16} className="text-eco" />}
          iconBg="bg-eco/10"
          change={28}
          changeLabel="vs last month"
        />
        <StatCard
          title="Cruising Dist. Avoided"
          value="48.5 km"
          description="Direct-to-slot routing"
          color="text-available"
          icon={<Navigation size={16} className="text-available" />}
          iconBg="bg-available/10"
        />
        <StatCard
          title="Fuel Saved"
          value="3.4 L"
          description="Estimated petrol/diesel"
          color="text-reserved"
          icon={<Zap size={16} className="text-reserved" />}
          iconBg="bg-reserved/10"
        />
        <StatCard
          title="Tree Equivalent"
          value="1.2 Trees"
          description="Annual offset impact"
          color="text-eco"
          icon={<Sparkles size={16} className="text-eco" />}
          iconBg="bg-eco/10"
        />
      </div>

      {/* Main Charts & Breakdown */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Emission Reduction Trend</CardTitle>
                <p className="text-xs text-surface-500 mt-0.5">
                  Green line = CO₂ saved with ParkSense-X · Gray = unoptimized parking search emissions
                </p>
              </div>
              <DemoBadge />
            </CardHeader>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={monthlyEcoData}>
                <defs>
                  <linearGradient id="driverEcoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} unit=" kg" />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
                  formatter={(v: number) => [`${v} kg CO₂`]}
                />
                <Area type="monotone" dataKey="savedKg" name="CO₂ Saved" stroke="#059669" strokeWidth={2.5} fill="url(#driverEcoGrad)" dot={{ fill: '#059669', r: 3 }} />
                <Area type="monotone" dataKey="baselineKg" name="Unoptimized Baseline" stroke="#475569" strokeWidth={1.5} strokeDasharray="4 4" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Trip History with Carbon Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Trip Carbon Ledger</CardTitle>
              <span className="text-xs text-surface-500">{completedBookings.length} recorded sessions</span>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-800">
                    {['Booking Ref', 'Facility & Slot', 'Date', 'Search Saved', 'CO₂ Impact'].map(h => (
                      <th key={h} className="text-left py-2.5 px-3 text-2xs font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {completedBookings.map(b => (
                    <tr key={b.id} className="border-b border-surface-900 hover:bg-surface-800/30 transition-colors">
                      <td className="py-3 px-3 font-mono text-xs font-bold text-brand-400">{b.bookingRef}</td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-surface-200 text-xs">{b.facilityName}</p>
                        <p className="text-2xs text-surface-500">Slot {b.slotCode} · Level {b.floor}</p>
                      </td>
                      <td className="py-3 px-3 text-xs text-surface-400">{formatDateTime(b.startTime)}</td>
                      <td className="py-3 px-3 text-xs text-available">~6.4 min search saved</td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-eco bg-eco/10 border border-eco/20 px-2 py-0.5 rounded-full">
                          <Leaf size={10} /> −{b.carbonKg ?? 0.8} kg
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Eco Settings & Tips */}
        <div className="space-y-4">
          {/* Green Mode Toggle Card */}
          <Card className="bg-gradient-to-br from-surface-900 to-eco/10 border-eco/20">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-eco/20 border border-eco/30 flex items-center justify-center text-eco flex-shrink-0">
                <Leaf size={18} />
              </div>
              <div>
                <h3 className="font-bold text-surface-100 text-sm">Greenest Mode Optimizer</h3>
                <p className="text-xs text-surface-400 mt-0.5">Automatically prioritizes shortest walking distance and minimum garage cruising routes.</p>
              </div>
            </div>

            <div className="p-3 bg-surface-950/60 rounded-xl border border-surface-800 flex items-center justify-between mt-4">
              <span className="text-xs font-semibold text-surface-200">Default to Eco Recommendations</span>
              <input
                type="checkbox"
                checked={ecoModeEnabled}
                onChange={e => setEcoModeEnabled(e.target.checked)}
                className="accent-eco w-4 h-4 cursor-pointer"
              />
            </div>

            <Link to="/driver/recommend" className="mt-4 block">
              <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight size={13} />}>
                Run AI Eco Recommendation
              </Button>
            </Link>
          </Card>

          {/* Eco Badges & Milestones */}
          <Card>
            <CardHeader>
              <CardTitle>Eco Driver Achievements</CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {[
                { title: 'Zero Idle Champion', desc: 'Saved > 5kg of CO₂ via smart routing', unlocked: true, icon: '🌱' },
                { title: 'EV Pioneer', desc: 'Charged vehicle in dedicated solar-powered EV zones', unlocked: true, icon: '⚡' },
                { title: 'Forest Guardian', desc: 'Accumulated 10kg CO₂ offset milestone', unlocked: false, progress: 68, icon: '🌲' },
              ].map(ach => (
                <div key={ach.title} className="p-3 bg-surface-800/50 rounded-xl border border-surface-700/50">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{ach.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-surface-200">{ach.title}</p>
                        {ach.unlocked ? (
                          <span className="text-2xs font-bold text-eco flex items-center gap-0.5">
                            <CheckCircle size={10} /> Unlocked
                          </span>
                        ) : (
                          <span className="text-2xs text-surface-500">{ach.progress}%</span>
                        )}
                      </div>
                      <p className="text-2xs text-surface-400 mt-0.5">{ach.desc}</p>
                      {!ach.unlocked && (
                        <div className="mt-2">
                          <ProgressBar value={ach.progress || 0} size="xs" color="#059669" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Simulation Notice */}
          <p className="text-2xs text-surface-600 p-2.5 border border-surface-800 rounded-xl leading-relaxed">
            ⚡ <strong>Simulation Notice</strong>: Carbon calculation is estimated based on standard vehicle fuel consumption (7.2 L/100km, 2.31 kg CO₂/L) and simulated indoor cruising avoidance times.
          </p>
        </div>
      </div>
    </div>
  )
}
