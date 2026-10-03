import { useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { DEMO_FACILITIES, DEMO_PRICING } from '@/services/demoData'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

// Simulated price history for chart
const priceHistory = [
  { t: '06:00', price: 40, demand: 20 }, { t: '08:00', price: 60, demand: 62 },
  { t: '10:00', price: 60, demand: 80 }, { t: '12:00', price: 60, demand: 72 },
  { t: '14:00', price: 70, demand: 85 }, { t: '16:00', price: 80, demand: 91 },
  { t: '18:00', price: 80, demand: 88 }, { t: '20:00', price: 60, demand: 65 },
  { t: '22:00', price: 40, demand: 35 },
]

function PricingCard({ rec, facilityName }: { rec: typeof DEMO_PRICING[0]; facilityName: string }) {
  const [applied, setApplied] = useState(false)
  const isIncrease = rec.recommendedPrice > rec.currentPrice
  const pctChange = Math.round(((rec.recommendedPrice - rec.currentPrice) / rec.currentPrice) * 100)

  const handleApply = () => {
    setApplied(true)
    toast.success(`Price updated to ₹${rec.recommendedPrice}/hr for ${facilityName}`)
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-surface-100">{facilityName}</h3>
          <p className="text-xs text-surface-400 mt-0.5">Active: {rec.effectivePeriod}</p>
        </div>
        {applied
          ? <Badge variant="available" size="sm"><CheckCircle size={11} /> Applied</Badge>
          : <Badge variant="warning" size="sm">Recommendation</Badge>}
      </div>

      {/* Price comparison */}
      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-xs text-surface-500">Current price</p>
          <p className="text-2xl font-black text-surface-300 line-through">₹{rec.currentPrice}</p>
        </div>
        <div className={`text-2xl font-bold ${isIncrease ? 'text-occupied' : 'text-available'}`}>
          {isIncrease ? '→' : '→'}
        </div>
        <div>
          <p className="text-xs text-surface-500">Recommended</p>
          <p className={`text-2xl font-black ${isIncrease ? 'text-occupied' : 'text-available'}`}>₹{rec.recommendedPrice}</p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold ${isIncrease ? 'text-occupied' : 'text-available'}`}>
          {isIncrease ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {isIncrease ? '+' : ''}{pctChange}%
        </div>
      </div>

      {/* Metrics */}
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-xs mb-1"><span className="text-surface-400">Demand level</span><span className="text-surface-300">{rec.demand}%</span></div>
          <ProgressBar value={rec.demand} occupancyColor size="sm" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span className="text-surface-400">Occupancy</span><span className="text-surface-300">{rec.occupancy}%</span></div>
          <ProgressBar value={rec.occupancy} occupancyColor size="sm" />
        </div>
      </div>

      <div className="p-3 bg-surface-800/50 rounded-lg mb-4">
        <p className="text-xs text-surface-300 leading-relaxed">
          <span className="font-semibold text-brand-300">Why this price?</span> {rec.reason}
        </p>
      </div>

      {!applied && (
        <Button variant="primary" size="sm" fullWidth onClick={handleApply} leftIcon={<CheckCircle size={13} />}>
          Apply Recommendation
        </Button>
      )}
    </Card>
  )
}

export default function DynamicPricingPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2"><DollarSign size={20} className="text-available" /><h1 className="text-2xl font-bold text-surface-50">Dynamic Pricing</h1></div>
          <p className="text-surface-400 text-sm mt-0.5">Demand-aware price recommendations · Real-time adjustment engine</p>
        </div>
        <DemoBadge />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard size="sm" title="Avg price today" value="₹68/hr" change={13.3} changeLabel="vs yesterday" icon={<DollarSign size={15} className="text-available" />} iconBg="bg-available/10" color="text-available" />
        <StatCard size="sm" title="Revenue lift" value="+₹4.2k" description="From dynamic pricing" icon={<TrendingUp size={15} className="text-brand-400" />} iconBg="bg-brand-900/50" color="text-brand-300" />
        <StatCard size="sm" title="Active rules" value="3" description="Across facilities" icon={<CheckCircle size={15} className="text-reserved" />} iconBg="bg-reserved/10" />
        <StatCard size="sm" title="Price limits" value="₹30–₹120" description="Min / Max guardrails" icon={<AlertTriangle size={15} className="text-surface-400" />} iconBg="bg-surface-800" />
      </div>

      {/* Pricing recommendations */}
      <div className="grid lg:grid-cols-2 gap-5">
        {DEMO_PRICING.map((rec, i) => {
          const f = DEMO_FACILITIES.find(fac => fac.id === rec.facilityId)
          return f ? <PricingCard key={i} rec={rec} facilityName={f.name} /> : null
        })}
      </div>

      {/* Price vs demand chart */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Price vs Demand — Today (Chennai Trade Centre)</CardTitle>
            <p className="text-xs text-surface-500 mt-0.5">Shows how dynamic pricing tracks demand throughout the day</p>
          </div>
          <DemoBadge />
        </CardHeader>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={priceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="t" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis yAxisId="price" domain={[20, 100]} tick={{ fill: '#64748b', fontSize: 11 }} unit="₹" orientation="left" />
            <YAxis yAxisId="demand" domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} unit="%" orientation="right" />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
            <ReferenceLine yAxisId="demand" y={80} stroke="#f59e0b" strokeDasharray="4 4" />
            <Line yAxisId="price" type="stepAfter" dataKey="price" name="Price (₹)" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 3 }} />
            <Line yAxisId="demand" type="monotone" dataKey="demand" name="Demand (%)" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-5 mt-2 text-xs">
          <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-available inline-block" />Price</div>
          <div className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-brand-500 inline-block border-dashed" />Demand</div>
        </div>
      </Card>

      <div className="p-3 bg-surface-900 border border-surface-800 rounded-xl text-xs text-surface-400 leading-relaxed">
        <span className="font-semibold text-surface-300">Price guardrails</span> — Dynamic pricing is bounded between ₹30/hr (minimum) and ₹120/hr (maximum) to prevent unreasonable recommendations. Operators can override any recommendation before applying.
        <br /><span className="text-surface-600 mt-1 block">⚡ SIMULATION DATA — Prices and demand values are demo data.</span>
      </div>
    </div>
  )
}
