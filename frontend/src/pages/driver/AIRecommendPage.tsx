import { useState } from 'react'
import { Brain, Leaf, DollarSign, MapPin, Zap, BarChart2, RefreshCw, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { ProgressBar, OccupancyGauge } from '@/components/ui/ProgressBar'
import { useAuthStore } from '@/store/authStore'
import { DEMO_RECOMMENDATION } from '@/services/demoData'
import { OPTIMIZATION_MODES } from '@/lib/utils'
import { BookingModal } from '@/components/booking/BookingModal'
import { DEMO_FACILITIES } from '@/services/demoData'
import type { OptimizationMode } from '@/types'

export default function AIRecommendPage() {
  const { user } = useAuthStore()
  const [mode, setMode] = useState<OptimizationMode>(user?.preferences?.optimizationMode ?? 'balanced')
  const [isComputing, setIsComputing] = useState(false)
  const [hasResult, setHasResult] = useState(true)
  const [bookingOpen, setBookingOpen] = useState(false)

  const rec = DEMO_RECOMMENDATION

  const handleRecompute = async () => {
    setIsComputing(true)
    setHasResult(false)
    await new Promise(r => setTimeout(r, 1800))
    setIsComputing(false)
    setHasResult(true)
  }

  const facility = DEMO_FACILITIES[0]

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">AI Slot Recommendation</h1>
          <p className="text-surface-400 text-sm mt-0.5">Multi-objective optimization engine</p>
        </div>
        <DemoBadge />
      </div>

      {/* Mode selector */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Preference</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.entries(OPTIMIZATION_MODES) as [OptimizationMode, { label: string; icon: string; description: string }][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex flex-col items-center gap-1.5 p-3 border rounded-xl text-center transition-all ${
                mode === key
                  ? 'bg-brand-900/50 border-brand-600 text-brand-300'
                  : 'bg-surface-800/50 border-surface-700 text-surface-400 hover:border-surface-600'
              }`}
            >
              <span className="text-2xl">{val.icon}</span>
              <span className="text-xs font-bold">{val.label}</span>
              <span className="text-2xs opacity-70">{val.description}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="primary" size="sm" leftIcon={<Brain size={14} />} loading={isComputing} onClick={handleRecompute}>
            {isComputing ? 'Computing…' : 'Recompute'}
          </Button>
        </div>
      </Card>

      {/* Result */}
      {!hasResult && (
        <Card className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-brand-900/50 border border-brand-700 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Brain size={22} className="text-brand-400" />
            </div>
            <p className="text-surface-300 font-semibold">Computing optimal allocation…</p>
            <p className="text-sm text-surface-500 mt-1">Evaluating {Math.floor(Math.random() * 50 + 20)} candidate slots</p>
          </div>
        </Card>
      )}

      {hasResult && (
        <div className="grid lg:grid-cols-3 gap-5 animate-fade-in">
          {/* Main recommendation */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="info" size="sm">AI Recommended</Badge>
                    <Badge variant="demo" size="sm">SIMULATION</Badge>
                  </div>
                  <h2 className="text-4xl font-black text-surface-50">Slot {rec.slot.slotCode}</h2>
                  <p className="text-surface-400 mt-1">{rec.facilityName}</p>
                  <p className="text-sm text-surface-400">Level {rec.slot.floor} · Zone {rec.slot.zone} · ₹{rec.slot.pricePerHour}/hr</p>
                </div>
                <div className="flex flex-col items-center">
                  <OccupancyGauge value={rec.suitabilityScore} size={80} />
                  <p className="text-xs text-surface-400 mt-1">Suitability</p>
                </div>
              </div>

              {/* Factor breakdown */}
              <div className="space-y-3 mb-5">
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide">Optimization Factors</p>
                {rec.factors.map(f => (
                  <div key={f.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-surface-300 flex items-center gap-1">
                        <span>{f.icon}</span> {f.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-surface-500">weight: {Math.round(f.weight * 100)}%</span>
                        <span className="font-bold text-surface-200">{f.score}/100</span>
                      </div>
                    </div>
                    <ProgressBar value={f.score} size="sm" color="#6366f1" />
                    <p className="text-2xs text-surface-500">{f.description}</p>
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div className="p-4 bg-brand-900/30 border border-brand-800/40 rounded-xl">
                <p className="text-xs font-semibold text-brand-300 mb-2">Why this slot?</p>
                <p className="text-sm text-surface-300 leading-relaxed">{rec.explanation}</p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={13} />} onClick={handleRecompute}>
                  Alternatives
                </Button>
                <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight size={14} />} onClick={() => setBookingOpen(true)}>
                  Book Slot {rec.slot.slotCode}
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Carbon */}
            <Card>
              <CardHeader>
                <CardTitle>Carbon Impact</CardTitle>
                <Leaf size={14} className="text-eco" />
              </CardHeader>
              <div className="space-y-2.5">
                {[
                  { label: 'Distance',    value: '1.2 km',    color: 'text-surface-200' },
                  { label: 'Fuel est.',   value: '0.12 L',    color: 'text-surface-200' },
                  { label: 'CO₂ est.',    value: '0.28 kg',   color: 'text-surface-200' },
                  { label: 'CO₂ saved',   value: '0.5 kg',    color: 'text-eco' },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-surface-400">{r.label}</span>
                    <span className={`font-semibold ${r.color}`}>{r.value}</span>
                  </div>
                ))}
                <p className="text-2xs text-surface-600 pt-1">Estimates based on average fuel consumption models. ⚡ SIMULATION</p>
              </div>
            </Card>

            {/* Alternatives */}
            <Card>
              <CardHeader>
                <CardTitle>Alternatives</CardTitle>
              </CardHeader>
              <div className="space-y-2">
                {[
                  { code: 'B22', score: 88, reason: 'Higher price' },
                  { code: 'A04', score: 82, reason: 'Farther walk' },
                  { code: 'D01', score: 79, reason: 'Level 2' },
                ].map(a => (
                  <div key={a.code} className="flex items-center gap-3 p-2.5 bg-surface-800/50 rounded-lg">
                    <span className="font-bold text-surface-200 w-8">{a.code}</span>
                    <div className="flex-1">
                      <ProgressBar value={a.score} size="xs" color="#6366f1" />
                      <p className="text-2xs text-surface-500 mt-0.5">{a.reason}</p>
                    </div>
                    <span className="text-xs font-semibold text-surface-300">{a.score}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {bookingOpen && (
        <BookingModal
          facility={facility}
          preselectedSlot={rec.slot}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  )
}
