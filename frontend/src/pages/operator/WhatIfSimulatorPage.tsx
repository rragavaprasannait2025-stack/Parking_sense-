import { useState } from 'react'
import {
  FlaskConical, Play, AlertTriangle, TrendingUp, TrendingDown,
  DollarSign, Clock, Leaf, CheckCircle
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { Select, Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { DEMO_FACILITIES, DEMO_SIMULATION_RESULT } from '@/services/demoData'
import { formatCurrency } from '@/lib/utils'
import type { ScenarioType } from '@/types'

const SCENARIOS: { value: ScenarioType; label: string; description: string; icon: string }[] = [
  { value: 'CLOSE_ZONE',      label: 'Close a Zone',          description: 'Temporarily close a zone for maintenance',        icon: '🚧' },
  { value: 'DEMAND_INCREASE', label: 'Demand Surge',          description: 'Simulate +X% demand increase (event nearby)',     icon: '📈' },
  { value: 'DEMAND_DECREASE', label: 'Demand Drop',           description: 'Simulate -X% demand (bad weather, holiday)',      icon: '📉' },
  { value: 'PRICE_CHANGE',    label: 'Price Change',          description: 'Change price and see effect on utilization',      icon: '💰' },
  { value: 'CLOSE_ENTRANCE',  label: 'Close Entrance',        description: 'Simulate an entrance closure scenario',           icon: '🚫' },
  { value: 'EVENT',           label: 'Add Event',             description: 'Add nearby event and forecast demand impact',     icon: '🎪' },
  { value: 'WEATHER',         label: 'Weather Impact',        description: 'Simulate rain/storm demand change',               icon: '🌧️' },
  { value: 'ADD_SLOTS',       label: 'Add Slots',             description: 'Open additional slot capacity',                   icon: '➕' },
]

function ComparisonChart({ result }: { result: typeof DEMO_SIMULATION_RESULT }) {
  const data = [
    {
      name: 'Occupancy %',
      Baseline:  result.baseline.occupancyRate,
      Simulated: result.simulated.occupancyRate,
      Optimized: result.optimized.occupancyRate,
    },
    {
      name: 'Search Time',
      Baseline:  result.baseline.searchTimeMinutes * 10,
      Simulated: result.simulated.searchTimeMinutes * 10,
      Optimized: result.optimized.searchTimeMinutes * 10,
    },
    {
      name: 'Revenue (k₹)',
      Baseline:  Math.round(result.baseline.revenue / 1000),
      Simulated: Math.round(result.simulated.revenue / 1000),
      Optimized: Math.round(result.optimized.revenue / 1000),
    },
    {
      name: 'Carbon kg',
      Baseline:  result.baseline.carbonKg,
      Simulated: result.simulated.carbonKg,
      Optimized: result.optimized.carbonKg,
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
        <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="Baseline"  fill="#475569" radius={[3,3,0,0]} />
        <Bar dataKey="Simulated" fill="#ef4444" radius={[3,3,0,0]} />
        <Bar dataKey="Optimized" fill="#10b981" radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function WhatIfSimulatorPage() {
  const [scenario, setScenario] = useState<ScenarioType>('CLOSE_ZONE')
  const [facilityId, setFacilityId] = useState('1')
  const [param1, setParam1] = useState('2')
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<typeof DEMO_SIMULATION_RESULT | null>(null)

  const handleRun = async () => {
    setIsRunning(true)
    setResult(null)
    await new Promise(r => setTimeout(r, 2200))
    setResult(DEMO_SIMULATION_RESULT)
    setIsRunning(false)
  }

  const scenarioMeta = SCENARIOS.find(s => s.value === scenario)!

  const StateCard = ({ title, state, color }: { title: string; state: typeof DEMO_SIMULATION_RESULT['baseline']; color: string }) => (
    <div className="space-y-2">
      <div className={`text-xs font-bold uppercase tracking-wide ${color}`}>{title}</div>
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between"><span className="text-surface-400">Occupancy</span><span className="font-semibold" style={{ color: state.occupancyRate > 85 ? '#ef4444' : '#f59e0b' }}>{state.occupancyRate}%</span></div>
        <div className="flex justify-between"><span className="text-surface-400">Available</span><span className="font-semibold text-available">{state.availableSlots}</span></div>
        <div className="flex justify-between"><span className="text-surface-400">Congestion</span><span className="font-semibold text-surface-200">{state.congestionLevel}</span></div>
        <div className="flex justify-between"><span className="text-surface-400">Revenue</span><span className="font-semibold text-available">{formatCurrency(state.revenue, 'INR')}</span></div>
        <div className="flex justify-between"><span className="text-surface-400">Search time</span><span className="font-semibold text-surface-200">{state.searchTimeMinutes} min</span></div>
        <div className="flex justify-between"><span className="text-surface-400">Carbon</span><span className="font-semibold text-eco">{state.carbonKg} kg</span></div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">What-If Simulator</h1>
          <p className="text-surface-400 text-sm mt-0.5">Model scenarios before acting. Compare baseline, simulated, and optimized states.</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Scenario builder */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Build Scenario</CardTitle>
              <FlaskConical size={14} className="text-brand-400" />
            </CardHeader>

            {/* Scenario type */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {SCENARIOS.map(s => (
                <button
                  key={s.value}
                  onClick={() => setScenario(s.value)}
                  className={`flex flex-col items-start gap-1 p-2.5 border rounded-lg text-left transition-all ${
                    scenario === s.value
                      ? 'bg-brand-900/50 border-brand-600 text-brand-300'
                      : 'bg-surface-800/50 border-surface-700 text-surface-400 hover:border-surface-600'
                  }`}
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-xs font-semibold leading-tight">{s.label}</span>
                </button>
              ))}
            </div>

            <Select
              label="Facility"
              value={facilityId}
              onChange={e => setFacilityId(e.target.value)}
              options={DEMO_FACILITIES.map(f => ({ value: String(f.id), label: f.name }))}
            />

            <div className="mt-3">
              <Input
                label={scenario === 'CLOSE_ZONE' ? 'Duration (hours)' : scenario === 'DEMAND_INCREASE' ? 'Demand increase (%)' : scenario === 'PRICE_CHANGE' ? 'New price (₹/hr)' : 'Parameter'}
                value={param1}
                onChange={e => setParam1(e.target.value)}
                type="number"
              />
            </div>

            <div className="mt-4 p-3 bg-surface-800/50 rounded-lg text-xs text-surface-400 leading-relaxed">
              <span className="text-reserved font-semibold">{scenarioMeta.icon} {scenarioMeta.label}:</span> {scenarioMeta.description}
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              className="mt-4"
              leftIcon={<Play size={14} />}
              loading={isRunning}
              onClick={handleRun}
            >
              {isRunning ? 'Simulating…' : 'Run Simulation'}
            </Button>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-5">
          {isRunning && (
            <Card className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-900/50 border border-brand-700 flex items-center justify-center mx-auto mb-3 animate-spin">
                  <FlaskConical size={22} className="text-brand-400" />
                </div>
                <p className="text-surface-300 font-semibold">Running simulation…</p>
                <p className="text-sm text-surface-500 mt-1">Computing state transitions and optimization</p>
              </div>
            </Card>
          )}

          {result && !isRunning && (
            <div className="space-y-5 animate-fade-in">
              {/* State comparison */}
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Simulation Result</CardTitle>
                    <p className="text-xs text-surface-500 mt-0.5">Scenario: {scenarioMeta.label}</p>
                  </div>
                  <DemoBadge />
                </CardHeader>

                <div className="grid grid-cols-3 gap-4 divide-x divide-surface-800">
                  <StateCard title="Baseline" state={result.baseline} color="text-surface-400" />
                  <div className="pl-4">
                    <StateCard title="Simulated" state={result.simulated} color="text-occupied" />
                  </div>
                  <div className="pl-4">
                    <StateCard title="Optimized" state={result.optimized} color="text-available" />
                  </div>
                </div>
              </Card>

              {/* Comparison chart */}
              <Card>
                <CardHeader>
                  <CardTitle>State Comparison Chart</CardTitle>
                </CardHeader>
                <ComparisonChart result={result} />
              </Card>

              {/* Impact & Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Optimization Recommendations</CardTitle>
                  <Badge variant="available" size="sm">Computed</Badge>
                </CardHeader>
                <div className="space-y-2">
                  {result.impact.recommendations.map((r, i) => (
                    <div key={i} className="flex items-start gap-2.5 p-2.5 bg-available/5 border border-available/20 rounded-lg">
                      <CheckCircle size={13} className="text-available mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-surface-300">{r}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  {[
                    { label: 'Revenue impact',      value: `+₹${(result.impact.revenueChange/1000).toFixed(1)}k`,  icon: <DollarSign size={13} />, color: 'text-available' },
                    { label: 'Occupancy change',     value: `+${result.impact.occupancyChange}%`,                    icon: <TrendingUp size={13} />, color: 'text-reserved' },
                    { label: 'Search time change',   value: `+${result.impact.searchTimeChange} min`,                icon: <Clock size={13} />,      color: 'text-occupied' },
                    { label: 'Carbon change',        value: `+${result.impact.carbonChange} kg`,                     icon: <Leaf size={13} />,       color: 'text-eco' },
                  ].map(s => (
                    <div key={s.label} className="bg-surface-800/50 rounded-lg p-3 text-center">
                      <span className={`${s.color} flex justify-center mb-1`}>{s.icon}</span>
                      <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
                      <p className="text-2xs text-surface-500 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {!result && !isRunning && (
            <Card className="flex items-center justify-center py-16">
              <div className="text-center">
                <FlaskConical size={32} className="text-surface-700 mx-auto mb-3" />
                <p className="text-surface-400 font-medium">Build and run a scenario</p>
                <p className="text-sm text-surface-600 mt-1">Configure a scenario on the left and click Run Simulation.</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
