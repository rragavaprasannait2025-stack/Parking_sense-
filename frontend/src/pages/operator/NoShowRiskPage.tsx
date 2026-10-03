import { Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { DEMO_NOSHOWS, DEMO_BOOKINGS } from '@/services/demoData'

const trendData = [
  { day: 'Mon', rate: 9 }, { day: 'Tue', rate: 11 }, { day: 'Wed', rate: 8 },
  { day: 'Thu', rate: 14 }, { day: 'Fri', rate: 18 }, { day: 'Sat', rate: 22 }, { day: 'Sun', rate: 12 },
]

export default function NoShowRiskPage() {
  const highRisk = DEMO_NOSHOWS.filter(n => n.riskLevel === 'HIGH')
  const medRisk  = DEMO_NOSHOWS.filter(n => n.riskLevel === 'MEDIUM')

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2"><Shield size={20} className="text-brand-400" /><h1 className="text-2xl font-bold text-surface-50">No-Show Risk</h1></div>
          <p className="text-surface-400 text-sm mt-0.5">Random Forest classifier · Reservation risk scoring</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard size="sm" title="High risk" value={highRisk.length} color="text-occupied" icon={<AlertTriangle size={15} className="text-occupied" />} iconBg="bg-occupied/10" />
        <StatCard size="sm" title="Medium risk" value={medRisk.length} color="text-reserved" icon={<AlertTriangle size={15} className="text-reserved" />} iconBg="bg-reserved/10" />
        <StatCard size="sm" title="Avg no-show rate" value="12.1%" description="Last 30 days" icon={<TrendingUp size={15} className="text-brand-400" />} iconBg="bg-brand-900/50" />
        <StatCard size="sm" title="Model accuracy" value="87.4%" description="F1: 82.6%" color="text-available" icon={<CheckCircle size={15} className="text-available" />} iconBg="bg-available/10" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Risk list */}
        <Card>
          <CardHeader><CardTitle>Active Reservation Risk Scores</CardTitle><DemoBadge /></CardHeader>
          <div className="space-y-4">
            {DEMO_NOSHOWS.map(ns => (
              <div key={ns.bookingId} className="p-3 bg-surface-800/50 rounded-xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-surface-100 font-mono">{ns.bookingRef}</p>
                    <p className="text-xs text-surface-400 mt-0.5">Booking #{ns.bookingId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black" style={{ color: ns.probability > 60 ? '#ef4444' : ns.probability > 30 ? '#f59e0b' : '#10b981' }}>
                      {ns.probability}%
                    </p>
                    <Badge variant={ns.riskLevel === 'HIGH' ? 'error' : ns.riskLevel === 'MEDIUM' ? 'warning' : 'available'} size="sm">
                      {ns.riskLevel} RISK
                    </Badge>
                  </div>
                </div>
                <ProgressBar value={ns.probability} size="sm" color={ns.probability > 60 ? '#ef4444' : ns.probability > 30 ? '#f59e0b' : '#10b981'} />
                <div className="space-y-1.5">
                  {ns.factors.map(f => (
                    <div key={f.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className={f.impact === 'NEGATIVE' ? 'text-occupied' : 'text-available'}>{f.impact === 'NEGATIVE' ? '↑' : '↓'}</span>
                        <span className="text-surface-400">{f.name}</span>
                      </div>
                      <span className="text-surface-500 text-right max-w-[50%] truncate">{f.description}</span>
                    </div>
                  ))}
                </div>
                {ns.riskLevel === 'HIGH' && (
                  <div className="p-2 bg-occupied/10 border border-occupied/20 rounded-lg">
                    <p className="text-xs text-occupied font-medium">
                      ⚠ High no-show risk — consider sending a reminder or holding a waitlist slot.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          {/* Weekly trend */}
          <Card>
            <CardHeader><CardTitle>Weekly No-Show Rate</CardTitle><DemoBadge /></CardHeader>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis unit="%" tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 30]} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v}%`, 'No-show rate']} />
                <Bar dataKey="rate" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Model info */}
          <Card>
            <CardHeader><CardTitle>Model: Random Forest Classifier</CardTitle></CardHeader>
            <div className="grid grid-cols-2 gap-3">
              {[['Accuracy','87.4%','text-available'],['Precision','84.1%','text-brand-300'],['Recall','81.2%','text-reserved'],['F1 Score','82.6%','text-available']].map(([l,v,c]) => (
                <div key={l} className="bg-surface-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-surface-500">{l}</p>
                  <p className={`text-lg font-bold mt-0.5 ${c}`}>{v}</p>
                </div>
              ))}
            </div>
            <p className="text-2xs text-surface-600 mt-3">⚡ SIMULATION — Metrics from demo training on synthetic booking data.</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
