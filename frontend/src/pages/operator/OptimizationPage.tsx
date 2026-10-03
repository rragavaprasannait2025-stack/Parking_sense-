import { useState } from 'react'
import { Target, RefreshCw, CheckCircle, Brain, Leaf, DollarSign, Clock, Navigation } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { ProgressBar, OccupancyGauge } from '@/components/ui/ProgressBar'
import { DEMO_FACILITIES, DEMO_RECOMMENDATION } from '@/services/demoData'
import { OPTIMIZATION_MODES } from '@/lib/utils'
import type { OptimizationMode } from '@/types'

const OBJECTIVES = [
  { key: 'cost',       label: 'Cost',          icon: <DollarSign size={14} />, color: '#10b981', direction: 'minimize' },
  { key: 'distance',   label: 'Distance',      icon: <Navigation size={14} />, color: '#6366f1', direction: 'minimize' },
  { key: 'congestion', label: 'Congestion',    icon: <Target size={14} />,     color: '#f59e0b', direction: 'minimize' },
  { key: 'carbon',     label: 'Carbon',        icon: <Leaf size={14} />,       color: '#059669', direction: 'minimize' },
  { key: 'search',     label: 'Search time',   icon: <Clock size={14} />,      color: '#ef4444', direction: 'minimize' },
  { key: 'util',       label: 'Utilization',   icon: <Target size={14} />,     color: '#818cf8', direction: 'maximize' },
]

const RADAR_DATA = [
  { axis: 'Availability', score: 96 },
  { axis: 'Distance',     score: 91 },
  { axis: 'Price',        score: 88 },
  { axis: 'Congestion',   score: 92 },
  { axis: 'Carbon',       score: 90 },
  { axis: 'Utilization',  score: 85 },
]

export default function OptimizationPage() {
  const [mode, setMode] = useState<OptimizationMode>('balanced')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(true)
  const rec = DEMO_RECOMMENDATION

  const handleRun = async () => {
    setRunning(true)
    setResult(false)
    await new Promise(r => setTimeout(r, 1400))
    setRunning(false)
    setResult(true)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2"><Target size={20} className="text-brand-400" /><h1 className="text-2xl font-bold text-surface-50">Multi-Objective Optimization</h1></div>
          <p className="text-surface-400 text-sm mt-0.5">Simultaneous optimization of cost · distance · congestion · carbon · utilization</p>
        </div>
        <DemoBadge />
      </div>

      {/* Mode selector */}
      <Card>
        <CardHeader><CardTitle>Optimization Mode</CardTitle></CardHeader>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
          {(Object.entries(OPTIMIZATION_MODES) as [OptimizationMode, { label: string; icon: string; description: string }][]).map(([k, v]) => (
            <button key={k} onClick={() => setMode(k)}
              className={`flex flex-col items-center gap-1.5 p-3 border rounded-xl text-center transition-all ${mode === k ? 'bg-brand-900/50 border-brand-600 text-brand-300' : 'bg-surface-800/50 border-surface-700 text-surface-400 hover:border-surface-600'}`}>
              <span className="text-xl">{v.icon}</span>
              <span className="text-xs font-bold">{v.label}</span>
              <span className="text-2xs opacity-70">{v.description}</span>
            </button>
          ))}
        </div>
        <Button variant="primary" size="sm" leftIcon={<Brain size={13} />} loading={running} onClick={handleRun}>
          {running ? 'Optimizing…' : 'Run Optimizer'}
        </Button>
      </Card>

      {result && (
        <div className="grid lg:grid-cols-3 gap-5 animate-fade-in">
          {/* Result */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="info" size="sm" className="mb-2">Optimal Allocation</Badge>
                  <h2 className="text-4xl font-black text-surface-50">Slot {rec.slot.slotCode}</h2>
                  <p className="text-surface-400 mt-1">{rec.facilityName} · Level {rec.slot.floor} · Zone {rec.slot.zone}</p>
                </div>
                <div className="flex flex-col items-center">
                  <OccupancyGauge value={rec.suitabilityScore} size={80} />
                  <p className="text-xs text-surface-400 mt-1">Suitability</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {rec.factors.map(f => (
                  <div key={f.name}>
                    <div className="flex justify-between text-xs mb-0.5">
                      <span className="text-surface-300 flex items-center gap-1.5">{f.icon} {f.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-surface-500">weight {Math.round(f.weight * 100)}%</span>
                        <span className="font-bold text-surface-200">{f.score}/100</span>
                      </div>
                    </div>
                    <ProgressBar value={f.score} size="sm" color="#6366f1" />
                  </div>
                ))}
              </div>

              <div className="p-3 bg-brand-900/30 border border-brand-800/40 rounded-xl">
                <p className="text-xs font-semibold text-brand-300 mb-1">Optimization explanation</p>
                <p className="text-sm text-surface-300 leading-relaxed">{rec.explanation}</p>
              </div>
            </Card>

            {/* Objectives table */}
            <Card>
              <CardHeader><CardTitle>Objective Scores</CardTitle></CardHeader>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {OBJECTIVES.map(obj => (
                  <div key={obj.key} className="bg-surface-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{ color: obj.color }}>{obj.icon}</span>
                      <span className="text-xs font-semibold text-surface-300">{obj.label}</span>
                    </div>
                    <p className="text-lg font-bold" style={{ color: obj.color }}>
                      {obj.direction === 'minimize' ? '↓' : '↑'} {Math.floor(75 + Math.random() * 20)}%
                    </p>
                    <p className="text-2xs text-surface-500 capitalize">{obj.direction}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Radar chart */}
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle>Radar Analysis</CardTitle><DemoBadge /></CardHeader>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={RADAR_DATA}>
                  <PolarGrid stroke="#1e293b" />
                  <PolarAngleAxis dataKey="axis" tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <CardHeader><CardTitle>Mode Weights</CardTitle></CardHeader>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'Availability', w: mode === 'balanced' ? 25 : 20 },
                  { label: 'Distance',     w: mode === 'closest' ? 40 : 20 },
                  { label: 'Price',        w: mode === 'cheapest' ? 40 : 20 },
                  { label: 'Carbon',       w: mode === 'greenest' ? 35 : 10 },
                  { label: 'Congestion',   w: mode === 'fastest' ? 30 : 15 },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-0.5"><span className="text-surface-300">{item.label}</span><span className="text-surface-400">{item.w}%</span></div>
                    <ProgressBar value={item.w} size="xs" color="#6366f1" />
                  </div>
                ))}
              </div>
              <p className="text-2xs text-surface-600 mt-3">Weights adapt per selected optimization mode.</p>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
