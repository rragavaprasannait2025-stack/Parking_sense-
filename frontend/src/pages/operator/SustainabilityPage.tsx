import { Leaf, TrendingDown, Zap, Car } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { DemoBadge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { DEMO_ANALYTICS, generateRevenueData } from '@/services/demoData'

const carbonDaily = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  co2Saved: parseFloat((60 + Math.random() * 40).toFixed(1)),
  distance:  parseFloat((80 + Math.random() * 60).toFixed(1)),
}))

const ecoByFacility = [
  { name: 'Trade Centre', co2: 124, saved: 38 },
  { name: 'Phoenix', co2: 88, saved: 52 },
  { name: 'Express Ave', co2: 156, saved: 22 },
]

export default function SustainabilityPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2"><Leaf size={20} className="text-eco" /><h1 className="text-2xl font-bold text-surface-50">Sustainability Analytics</h1></div>
          <p className="text-surface-400 text-sm mt-0.5">Carbon impact tracking · Eco-optimized allocation savings</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="CO₂ saved" value={`${DEMO_ANALYTICS.carbonSaved} kg`} description="Last 30 days" color="text-eco" icon={<Leaf size={16} className="text-eco" />} iconBg="bg-eco/10" change={18} changeLabel="vs prev month" />
        <StatCard title="Distance saved" value="2,840 km" description="Estimated total" color="text-available" icon={<Car size={16} className="text-available" />} iconBg="bg-available/10" />
        <StatCard title="Fuel saved" value="168 L" description="Estimated" color="text-reserved" icon={<Zap size={16} className="text-reserved" />} iconBg="bg-reserved/10" />
        <StatCard title="Eco bookings" value="34%" description="Used greenest mode" color="text-eco" icon={<TrendingDown size={16} className="text-eco" />} iconBg="bg-eco/10" />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader><CardTitle>CO₂ Saved — Daily Trend</CardTitle><DemoBadge /></CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={carbonDaily}>
              <defs>
                <linearGradient id="ecoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} interval={2} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} unit="kg" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v} kg CO₂`]} />
              <Area type="monotone" dataKey="co2Saved" name="CO₂ saved" stroke="#059669" fill="url(#ecoGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader><CardTitle>CO₂ by Facility</CardTitle><DemoBadge /></CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ecoByFacility} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} unit="kg" />
              <YAxis type="category" dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} width={90} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="co2" name="CO₂ emitted" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={14} />
              <Bar dataKey="saved" name="CO₂ saved" fill="#059669" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Eco Comparison: Optimized vs Baseline Allocation</CardTitle></CardHeader>
        <div className="grid sm:grid-cols-3 gap-5">
          {[
            { label: 'Without optimization', co2: '368 kg', distance: '3,420 km', color: 'text-occupied', bg: 'bg-occupied/10 border-occupied/20' },
            { label: 'With ParkSense-X',     co2: '244 kg', distance: '2,180 km', color: 'text-eco',      bg: 'bg-eco/10 border-eco/20' },
            { label: 'Saving',               co2: '−124 kg', distance: '−1,240 km', color: 'text-available', bg: 'bg-available/10 border-available/20' },
          ].map(s => (
            <div key={s.label} className={`p-4 border rounded-xl ${s.bg}`}>
              <p className="text-xs font-semibold text-surface-400 mb-2">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.co2}</p>
              <p className="text-sm text-surface-400 mt-1">CO₂ / month</p>
              <p className={`text-sm font-semibold mt-2 ${s.color}`}>{s.distance}</p>
              <p className="text-xs text-surface-500">Distance driven</p>
            </div>
          ))}
        </div>
        <p className="text-2xs text-surface-600 mt-3">
          ⚡ SIMULATION — Carbon estimates use standard fuel consumption models (avg 7L/100km, 2.31 kg CO₂/L). Not scientifically exact.
        </p>
      </Card>
    </div>
  )
}
