import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity, Layers, Play, Pause, AlertTriangle, CheckCircle,
  Clock, TrendingUp, RefreshCw, Car, Zap, Building2
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge, CongestionBadge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar, OccupancyGauge } from '@/components/ui/ProgressBar'
import { DEMO_FACILITIES } from '@/services/demoData'
import { useSimulation } from '@/hooks/useSimulation'
import { getOccupancyColor, formatCurrency } from '@/lib/utils'

export default function LiveOccupancyPage() {
  const [selectedFacilityId, setSelectedFacilityId] = useState<number>(1)
  const { isRunning, occupancyMap, eventLog, toggle } = useSimulation({
    facilityIds: DEMO_FACILITIES.map(f => f.id),
    intervalMs: 2000,
  })

  const selectedFacility = DEMO_FACILITIES.find(f => f.id === selectedFacilityId) ?? DEMO_FACILITIES[0]
  const currentOcc = occupancyMap.get(selectedFacility.id)?.occupancyRate ?? selectedFacility.occupancyRate
  const currentAvail = occupancyMap.get(selectedFacility.id)?.availableSlots ?? selectedFacility.availableSlots

  // Sparkline state for live facility
  const [trendData, setTrendData] = useState<{ time: string; occ: number }[]>([
    { time: '10:00', occ: 54 }, { time: '10:15', occ: 62 }, { time: '10:30', occ: 68 },
    { time: '10:45', occ: 74 }, { time: '11:00', occ: currentOcc },
  ])

  useEffect(() => {
    if (isRunning) {
      setTrendData(prev => [
        ...prev.slice(-14),
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), occ: currentOcc }
      ])
    }
  }, [currentOcc, isRunning])

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">Live Occupancy Monitor</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Real-time sensory telemetry and floor-level capacity telemetry across all parking facilities
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${
            isRunning ? 'bg-available/10 border-available/30 text-available' : 'bg-surface-800 border-surface-700 text-surface-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-available animate-pulse' : 'bg-surface-600'}`} />
            {isRunning ? 'LIVE SENSOR STREAM' : 'SIMULATION PAUSED'}
          </div>
          <DemoBadge />
          <Button
            variant={isRunning ? 'danger' : 'primary'}
            size="sm"
            leftIcon={isRunning ? <Pause size={13} /> : <Play size={13} />}
            onClick={toggle}
          >
            {isRunning ? 'Pause' : 'Resume Telemetry'}
          </Button>
        </div>
      </div>

      {/* Facility Switcher Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {DEMO_FACILITIES.map(f => {
          const occ = occupancyMap.get(f.id)?.occupancyRate ?? f.occupancyRate
          const avail = occupancyMap.get(f.id)?.availableSlots ?? f.availableSlots
          const isSel = f.id === selectedFacilityId

          return (
            <button
              key={f.id}
              onClick={() => setSelectedFacilityId(f.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left flex-shrink-0 transition-all cursor-pointer ${
                isSel
                  ? 'bg-brand-900/50 border-brand-500 ring-1 ring-brand-500'
                  : 'bg-surface-900/80 border-surface-800 hover:border-surface-700'
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-surface-800 flex items-center justify-center flex-shrink-0">
                <Building2 size={16} className={isSel ? 'text-brand-400' : 'text-surface-400'} />
              </div>
              <div>
                <p className="font-bold text-xs text-surface-100">{f.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-2xs font-bold" style={{ color: getOccupancyColor(occ) }}>
                    {occ.toFixed(0)}% Occ
                  </span>
                  <span className="text-2xs text-surface-500">· {avail} slots free</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Key Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card className="p-3.5 flex flex-col items-center justify-center">
          <OccupancyGauge value={Math.round(currentOcc)} size={76} />
          <p className="text-xs font-semibold text-surface-300 mt-1">Live Occupancy</p>
        </Card>

        <StatCard
          size="sm"
          title="Available Slots"
          value={currentAvail}
          color="text-available"
          icon={<CheckCircle size={15} className="text-available" />}
          iconBg="bg-available/10"
        />

        <StatCard
          size="sm"
          title="Occupied Slots"
          value={Math.max(0, selectedFacility.totalSlots - currentAvail - selectedFacility.reservedSlots)}
          color="text-occupied"
          icon={<Car size={15} className="text-occupied" />}
          iconBg="bg-occupied/10"
        />

        <StatCard
          size="sm"
          title="Active Reserved"
          value={selectedFacility.reservedSlots}
          color="text-reserved"
          icon={<Clock size={15} className="text-reserved" />}
          iconBg="bg-reserved/10"
        />

        <Card className="p-3.5 flex flex-col justify-center gap-1">
          <p className="text-2xs font-semibold text-surface-500 uppercase tracking-wide">Congestion Status</p>
          <CongestionBadge level={selectedFacility.congestionLevel} />
          <p className="text-2xs text-surface-400 mt-1">Rate: ₹{selectedFacility.pricePerHour}/hr</p>
        </Card>
      </div>

      {/* Main Grid: Floor breakdown & Live chart */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Floor and Zone Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>{selectedFacility.name} — Floor &amp; Zone Breakdown</CardTitle>
                <p className="text-xs text-surface-400 mt-0.5">Real-time slot utilization by level</p>
              </div>
              <Link to="/operator/digital-twin">
                <Button variant="primary" size="xs" leftIcon={<Layers size={13} />}>
                  Open Digital Twin
                </Button>
              </Link>
            </CardHeader>

            <div className="space-y-4">
              {selectedFacility.floors.map(floor => (
                <div key={floor.id} className="p-4 bg-surface-800/40 rounded-xl border border-surface-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-surface-100 text-sm">{floor.name}</h4>
                      <p className="text-2xs text-surface-400">{floor.zones.length} Zones · {floor.totalSlots} Total Slots</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-available">{floor.availableSlots} free</span>
                      <p className="text-2xs text-surface-500">out of {floor.totalSlots}</p>
                    </div>
                  </div>

                  <ProgressBar value={((floor.totalSlots - floor.availableSlots) / floor.totalSlots) * 100} occupancyColor size="sm" />

                  {/* Zones */}
                  <div className="grid sm:grid-cols-3 gap-2.5 pt-1">
                    {floor.zones.map(z => (
                      <div key={z.id} className="p-2.5 bg-surface-900/90 rounded-lg border border-surface-800 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-surface-200">{z.name}</p>
                          <span className="text-2xs text-surface-500">{z.type}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-surface-200">{z.availableSlots}/{z.totalSlots}</span>
                          <span className="text-2xs text-surface-500 block">avail</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Occupancy Trend Stream */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Live Occupancy Telemetry Stream</CardTitle>
                <p className="text-xs text-surface-500 mt-0.5">Continuous stream updated from simulated IoT ultrasonic loop sensors</p>
              </div>
              <span className="text-xs text-surface-400 font-mono">1 reading / 2.0s</span>
            </CardHeader>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="liveOccGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} />
                <YAxis domain={[0, 100]} unit="%" tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
                <ReferenceLine y={80} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '80% Surge Trigger', fill: '#f59e0b', fontSize: 10 }} />
                <Area type="monotone" dataKey="occ" name="Occupancy" stroke="#6366f1" strokeWidth={2} fill="url(#liveOccGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Right Sidebar: Real-time Event Feed */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Sensor Events</CardTitle>
              <span className="text-xs text-available font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-available animate-pulse" /> Live Stream
              </span>
            </CardHeader>
            <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-thin">
              {eventLog.length === 0 ? (
                <p className="text-center text-xs text-surface-500 py-10">Waiting for simulated IoT gate events…</p>
              ) : (
                eventLog.map((e, idx) => (
                  <div key={idx} className="p-2.5 bg-surface-800/40 border border-surface-700/50 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-surface-200 capitalize">{e.category} Event</span>
                      <span className="text-2xs text-surface-500">{e.time}</span>
                    </div>
                    <p className="text-surface-400 text-2xs leading-relaxed">{e.message}</p>
                  </div>
                ))
              )}
            </div>
          </Card>

          {currentOcc >= 80 && (
            <div className="p-4 bg-occupied/10 border border-occupied/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-occupied font-bold text-xs">
                <AlertTriangle size={15} /> Peak Occupancy Alert
              </div>
              <p className="text-2xs text-surface-300 leading-relaxed">
                Facility is operating above 80% capacity threshold. Automated dynamic pricing recommendation has been queued for review.
              </p>
              <Link to="/operator/pricing">
                <Button variant="primary" size="xs" fullWidth>
                  Review Dynamic Pricing
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
