import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts'
import { TrendingUp, Brain, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { DemoBadge, Badge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Select } from '@/components/ui/Input'
import { DEMO_FACILITIES, DEMO_DEMAND_PREDICTIONS, generateOccupancyTimeSeries, generateFuturePredictions } from '@/services/demoData'
import { getOccupancyColor } from '@/lib/utils'

const H_LABELS: Record<string, string> = { '15m': '+15 min', '30m': '+30 min', '60m': '+1 hour', '3h': '+3 hours', '6h': '+6 hours', '24h': '+24 hours' }

export default function DemandForecastPage() {
  const [fid, setFid] = useState('1')
  const facility = DEMO_FACILITIES.find(f => String(f.id) === fid)!
  const preds = DEMO_DEMAND_PREDICTIONS.filter(p => p.facilityId === Number(fid))
  const maxPred = preds.reduce((m, p) => p.predictedOccupancy > m.predictedOccupancy ? p : m, preds[0] ?? { predictedOccupancy: 0, horizon: '' })
  const peakPred = preds.find(p => p.isPeakPeriod)

  const historical = generateOccupancyTimeSeries(12)
  const future = generateFuturePredictions()
  const combined = [
    ...historical.slice(-8).map(d => ({ t: d.timestamp, actual: d.actual, predicted: null })),
    ...future.slice(0, 6).map(d => ({ t: d.timestamp, actual: null, predicted: d.predicted })),
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2"><TrendingUp size={20} className="text-brand-400" /><h1 className="text-2xl font-bold text-surface-50">Demand Forecast</h1></div>
          <p className="text-surface-400 text-sm mt-0.5">XGBoost + LSTM occupancy prediction · 15 min to 24 h horizons</p>
        </div>
        <div className="flex items-center gap-2">
          <Select options={DEMO_FACILITIES.map(f => ({ value: String(f.id), label: f.name }))} value={fid} onChange={e => setFid(e.target.value)} />
          <DemoBadge />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard size="sm" title="Current" value={`${facility.occupancyRate}%`} icon={<Brain size={15} className="text-brand-400" />} iconBg="bg-brand-900/50" />
        <StatCard size="sm" title="Peak forecast" value={`${maxPred?.predictedOccupancy ?? 91}%`} description={`In ${maxPred?.horizon}`} color="text-occupied" icon={<TrendingUp size={15} className="text-occupied" />} iconBg="bg-occupied/10" />
        <StatCard size="sm" title="Model confidence" value={`${preds[0]?.confidence ?? 92}%`} description="15-min horizon" color="text-available" icon={<Brain size={15} className="text-available" />} iconBg="bg-available/10" />
        <StatCard size="sm" title="Peak period" value={peakPred ? 'Expected' : 'Normal'} color={peakPred ? 'text-reserved' : 'text-available'} icon={<AlertTriangle size={15} className={peakPred ? 'text-reserved' : 'text-available'} />} iconBg={peakPred ? 'bg-reserved/10' : 'bg-available/10'} />
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Occupancy — Actual vs Predicted</CardTitle>
            <p className="text-xs text-surface-500 mt-0.5">Solid = historical · Dashed = forecast · Yellow line = 80% alert threshold</p>
          </div>
          <DemoBadge />
        </CardHeader>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={combined}>
            <defs>
              <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient>
              <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="t" hide />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => v != null ? [`${v.toFixed(1)}%`] : ['—']} labelFormatter={() => ''} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '80% Alert', fill: '#f59e0b', fontSize: 10 }} />
            <Area connectNulls type="monotone" dataKey="actual" name="Actual" stroke="#6366f1" fill="url(#gA)" strokeWidth={2} dot={false} />
            <Area connectNulls type="monotone" dataKey="predicted" name="Predicted" stroke="#10b981" fill="url(#gP)" strokeWidth={1.5} strokeDasharray="5 3" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle>Multi-Horizon Forecast</CardTitle><DemoBadge /></CardHeader>
          <div className="space-y-3">
            {preds.map(p => (
              <div key={p.horizon}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-surface-300 font-medium">{H_LABELS[p.horizon] ?? p.horizon}</span>
                    {p.isPeakPeriod && <Badge variant="warning" size="sm">Peak</Badge>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-surface-500">conf {p.confidence}%</span>
                    <span className="text-sm font-bold w-10 text-right" style={{ color: getOccupancyColor(p.predictedOccupancy) }}>{p.predictedOccupancy}%</span>
                  </div>
                </div>
                <ProgressBar value={p.predictedOccupancy} occupancyColor size="sm" />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader><CardTitle>Model Info</CardTitle></CardHeader>
          <div className="space-y-4">
            <div className="p-3 bg-brand-900/30 border border-brand-800/40 rounded-lg">
              <p className="text-xs font-semibold text-brand-300 mb-2">Primary: XGBoost Demand Predictor</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[['MAE','3.24'],['RMSE','4.81'],['MAPE','4.2%']].map(([l,v]) => (
                  <div key={l} className="bg-surface-900/60 rounded p-2"><p className="text-xs text-surface-500">{l}</p><p className="text-sm font-bold text-surface-200 mt-0.5">{v}</p></div>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide">Feature Importance</p>
              {[['Historical pattern',92],['Time of day/week',87],['Booking lead time',74],['Event calendar',68],['Weather signal',52]].map(([l,w]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-xs mb-0.5"><span className="text-surface-300">{l}</span><span className="text-surface-500">{w}%</span></div>
                  <ProgressBar value={w as number} size="xs" color="#6366f1" />
                </div>
              ))}
            </div>
            <p className="text-2xs text-surface-600">⚡ Metrics from demo training experiments.</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
