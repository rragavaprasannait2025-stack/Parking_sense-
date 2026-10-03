import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Layers, AlertTriangle, Car, CheckCircle, Clock, TrendingUp, Zap } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { DemoBadge, CongestionBadge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { OccupancyGauge } from '@/components/ui/ProgressBar'
import { ParkingSlotGrid } from '@/components/parking/ParkingSlotGrid'
import { simulationEngine } from '@/services/simulationEngine'
import { useSimulation } from '@/hooks/useSimulation'
import { DEMO_FACILITIES } from '@/services/demoData'
import { getOccupancyColor } from '@/lib/utils'
import type { CongestionLevel } from '@/types'

export default function DigitalTwinPage() {
  const [selIdx, setSelIdx] = useState(0)
  const sel = DEMO_FACILITIES[selIdx]

  // Register all facilities
  useEffect(() => {
    DEMO_FACILITIES.forEach(f => {
      const slots = f.floors.flatMap(fl => fl.zones.flatMap(z => z.slots))
      simulationEngine.registerFacility(f.id, f.totalSlots, f.occupancyRate, slots)
    })
  }, [])

  const { isRunning, occupancyMap, eventLog, toggle } = useSimulation({
    facilityIds: DEMO_FACILITIES.map(f => f.id),
    intervalMs: 2200,
  })

  // Sparkline
  const [spark, setSpark] = useState<{ t: string; v: number }[]>(() =>
    Array.from({ length: 20 }, (_, i) => ({ t: String(i), v: sel.occupancyRate + (Math.random() - 0.5) * 6 }))
  )
  useEffect(() => {
    const occ = occupancyMap.get(sel.id)
    if (occ) setSpark(p => [...p.slice(-29), { t: new Date().toLocaleTimeString(), v: occ.occupancyRate }])
  }, [occupancyMap, sel.id])

  const liveOcc   = occupancyMap.get(sel.id)?.occupancyRate ?? sel.occupancyRate
  const liveAvail = occupancyMap.get(sel.id)?.availableSlots ?? sel.availableSlots
  const liveOcc2  = Math.round(liveOcc)
  const congestion: CongestionLevel = liveOcc > 90 ? 'CRITICAL' : liveOcc > 75 ? 'HIGH' : liveOcc > 55 ? 'MEDIUM' : 'LOW'

  const catColor: Record<string, string> = { entry: 'text-occupied', exit: 'text-available', reserve: 'text-reserved', alert: 'text-orange-400' }
  const catIcon:  Record<string, string> = { entry: '↓', exit: '↑', reserve: '◈', alert: '⚠' }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={20} className="text-brand-400" />
            <h1 className="text-2xl font-bold text-surface-50">Parking Digital Twin</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Live virtual facility model · <span className="text-brand-400">OBSERVE → PREDICT → ACT</span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${isRunning ? 'bg-available/10 border-available/30 text-available' : 'bg-surface-800 border-surface-700 text-surface-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-available animate-pulse' : 'bg-surface-600'}`} />
            {isRunning ? 'LIVE' : 'PAUSED'}
          </div>
          <DemoBadge />
          <Button variant={isRunning ? 'danger' : 'primary'} size="sm" leftIcon={isRunning ? <Pause size={13} /> : <Play size={13} />} onClick={toggle}>
            {isRunning ? 'Pause' : 'Start Simulation'}
          </Button>
        </div>
      </div>

      {/* Facility tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {DEMO_FACILITIES.map((f, i) => (
          <button key={f.id} onClick={() => setSelIdx(i)}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border flex-shrink-0 transition-all ${selIdx === i ? 'bg-brand-600 text-white border-brand-500' : 'bg-surface-800 text-surface-400 border-surface-700 hover:border-surface-600'}`}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getOccupancyColor(f.occupancyRate) }} />
            {f.name.split(' ').slice(0, 3).join(' ')}
            <span className="text-xs opacity-70">{(occupancyMap.get(f.id)?.occupancyRate ?? f.occupancyRate).toFixed(0)}%</span>
          </button>
        ))}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-3 flex flex-col items-center justify-center gap-1">
          <OccupancyGauge value={liveOcc2} size={68} />
          <p className="text-xs text-surface-400">Occupancy</p>
        </Card>
        <StatCard size="sm" title="Available" value={liveAvail} color="text-available" icon={<CheckCircle size={15} className="text-available" />} iconBg="bg-available/10" />
        <StatCard size="sm" title="Occupied" value={Math.max(0, sel.totalSlots - liveAvail - sel.reservedSlots)} color="text-occupied" icon={<Car size={15} className="text-occupied" />} iconBg="bg-occupied/10" />
        <StatCard size="sm" title="Reserved" value={sel.reservedSlots} color="text-reserved" icon={<Clock size={15} className="text-reserved" />} iconBg="bg-reserved/10" />
        <Card className="p-3 flex flex-col justify-center gap-1.5">
          <p className="text-2xs font-semibold text-surface-500 uppercase tracking-wide">Congestion</p>
          <CongestionBadge level={congestion} />
          {congestion === 'CRITICAL' && <p className="text-2xs text-occupied">⚠ Near capacity</p>}
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {/* Slot map */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{sel.name}</CardTitle>
                <p className="text-xs text-surface-500 mt-0.5">Click an available slot to view details</p>
              </div>
              <div className="flex items-center gap-2">
                {isRunning && <span className="flex items-center gap-1 text-xs text-available font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-available animate-pulse" /> LIVE</span>}
                <DemoBadge />
              </div>
            </CardHeader>
            {sel.floors.length > 0
              ? <ParkingSlotGrid floors={sel.floors} recommendedSlotId={204} />
              : <div className="text-center py-10 text-surface-500 text-sm"><Layers size={24} className="mx-auto mb-2 opacity-40" />Floor map unavailable in demo mode for this facility.</div>}
          </Card>

          {/* Sparkline */}
          <Card>
            <CardHeader>
              <CardTitle>Live Occupancy Trend</CardTitle>
              <span className="text-xs text-surface-500">Last 30 readings</span>
            </CardHeader>
            <ResponsiveContainer width="100%" height={90}>
              <AreaChart data={spark}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis domain={[0, 100]} hide />
                <XAxis dataKey="t" hide />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 6, fontSize: 11 }} formatter={(v: number) => [`${v.toFixed(1)}%`, 'Occupancy']} labelFormatter={() => ''} />
                <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="3 3" />
                <Area type="monotoneX" dataKey="v" stroke="#6366f1" fill="url(#sparkGrad)" strokeWidth={2} dot={false} isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Event log */}
          <Card>
            <CardHeader>
              <CardTitle>Event Log</CardTitle>
              <span className="text-xs text-surface-500">{eventLog.length} events</span>
            </CardHeader>
            <div className="overflow-y-auto max-h-64 space-y-1.5 scrollbar-hide">
              {eventLog.length === 0
                ? <p className="text-sm text-surface-500 text-center py-6">Start simulation to see events</p>
                : eventLog.map((e, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs animate-fade-in">
                    <span className={`flex-shrink-0 font-bold mt-0.5 ${catColor[e.category] ?? 'text-surface-400'}`}>{catIcon[e.category] ?? '•'}</span>
                    <div>
                      <p className="text-surface-300 leading-tight">{e.message}</p>
                      <p className="text-surface-600 mt-0.5">{e.time}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          </Card>

          {/* Intelligence loop */}
          <Card>
            <CardHeader><CardTitle>Intelligence Loop</CardTitle></CardHeader>
            <div className="space-y-2">
              {[
                { step: 'OBSERVE',  done: true,      desc: 'Slot monitoring active' },
                { step: 'PREDICT',  done: true,      desc: '60-min forecast: 91%' },
                { step: 'SIMULATE', done: false,     desc: 'What-if simulator ready' },
                { step: 'OPTIMIZE', done: false,     desc: 'Multi-obj. optimizer ready' },
                { step: 'ACT',      done: isRunning, desc: isRunning ? 'Simulation running' : 'Awaiting trigger' },
                { step: 'LEARN',    done: true,      desc: 'Feedback → model update' },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border ${item.done ? 'bg-available/20 border-available/40' : 'bg-surface-800 border-surface-700'}`}>
                    {item.done && <span className="w-2 h-2 rounded-full bg-available" />}
                  </div>
                  <div>
                    <span className={`text-xs font-bold ${item.done ? 'text-brand-400' : 'text-surface-500'}`}>{item.step}</span>
                    <p className="text-2xs text-surface-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {liveOcc > 80 && (
            <div className="p-3 bg-occupied/10 border border-occupied/30 rounded-xl animate-fade-in">
              <div className="flex gap-2">
                <AlertTriangle size={13} className="text-occupied mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-occupied">High Occupancy Alert</p>
                  <p className="text-2xs text-surface-400 mt-0.5">{sel.name} at {liveOcc2}%. AI recommends pricing to ₹80/hr.</p>
                </div>
              </div>
            </div>
          )}
          <p className="text-2xs text-surface-600 p-2 border border-surface-800 rounded-lg">
            ⚡ SIMULATION — Events generated by ParkSense-X demo engine. No real IoT hardware.
          </p>
        </div>
      </div>
    </div>
  )
}
