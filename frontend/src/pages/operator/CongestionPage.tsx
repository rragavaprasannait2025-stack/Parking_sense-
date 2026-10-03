import { AlertTriangle, TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { CongestionBadge, DemoBadge } from '@/components/ui/Badge'
import { DEMO_FACILITIES, DEMO_CONGESTION, generateHourlyPattern } from '@/services/demoData'
import { getCongestionBg } from '@/lib/utils'
import type { CongestionLevel } from '@/types'

const HORIZONS: { key: keyof (typeof DEMO_CONGESTION)[0]; label: string }[] = [
  { key: 'current', label: 'Now' },
  { key: 'in30m',   label: '+30 min' },
  { key: 'in60m',   label: '+1 hour' },
  { key: 'in3h',    label: '+3 hours' },
]

const congestionNum: Record<CongestionLevel, number> = { LOW: 25, MEDIUM: 55, HIGH: 78, CRITICAL: 94 }

export default function CongestionPage() {
  const hourly = generateHourlyPattern()
  const congestionSeries = hourly.map(h => ({ ...h, congestion: Math.min(100, Math.max(0, h.occupancy + (Math.random() - 0.5) * 8)) }))

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2"><AlertTriangle size={20} className="text-reserved" /><h1 className="text-2xl font-bold text-surface-50">Congestion Prediction</h1></div>
          <p className="text-surface-400 text-sm mt-0.5">Multi-horizon congestion forecast per facility</p>
        </div>
        <DemoBadge />
      </div>

      {/* Facility congestion matrix */}
      <div className="space-y-4">
        {DEMO_CONGESTION.map(c => {
          const f = DEMO_FACILITIES.find(fac => fac.id === c.facilityId)
          if (!f) return null
          return (
            <Card key={c.facilityId}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <p className="font-bold text-surface-100">{f.name}</p>
                  <p className="text-xs text-surface-400">{f.address}</p>
                </div>
                <CongestionBadge level={c.current} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HORIZONS.map(h => {
                  const level = c[h.key] as CongestionLevel
                  return (
                    <div key={h.key} className={`p-3 border rounded-xl text-center ${getCongestionBg(level)}`}>
                      <p className="text-xs text-surface-400 mb-1">{h.label}</p>
                      <p className="text-sm font-black">{level}</p>
                      <div className="mt-2 text-xs opacity-70">{congestionNum[level]}%</div>
                    </div>
                  )
                })}
              </div>
              {(c.in60m === 'CRITICAL' || c.in30m === 'HIGH') && (
                <div className="mt-3 p-2.5 bg-occupied/10 border border-occupied/20 rounded-lg flex items-start gap-2">
                  <AlertTriangle size={13} className="text-occupied mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-occupied leading-relaxed">
                    High congestion predicted within {c.in30m === 'HIGH' ? '30 minutes' : '1 hour'}.
                    Consider activating dynamic pricing and congestion alerts to nearby drivers.
                  </p>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {/* Hourly pattern chart */}
      <Card>
        <CardHeader>
          <CardTitle>Congestion vs Occupancy — Hourly Pattern</CardTitle>
          <DemoBadge />
        </CardHeader>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={congestionSeries}>
            <defs>
              <linearGradient id="cOcc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
              <linearGradient id="cCon" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 10 }} interval={3} />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v?.toFixed(0)}%`]} />
            <Area type="monotone" dataKey="occupancy" name="Occupancy" stroke="#6366f1" fill="url(#cOcc)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="congestion" name="Congestion" stroke="#ef4444" fill="url(#cCon)" strokeWidth={1.5} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
