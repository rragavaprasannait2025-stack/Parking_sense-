import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { DemoBadge } from '@/components/ui/Badge'
import {
  DEMO_ANALYTICS, DEMO_MODEL_METRICS,
  generateOccupancyTimeSeries, generateRevenueData,
  generateWeeklyOccupancy, generateHourlyPattern
} from '@/services/demoData'
import { formatCurrency } from '@/lib/utils'

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#64748b']

export default function OperatorAnalyticsPage() {
  const occupancyData = generateOccupancyTimeSeries(24)
  const revenueData = generateRevenueData(30)
  const weeklyData = generateWeeklyOccupancy()
  const hourlyData = generateHourlyPattern()

  const pieData = [
    { name: 'Standard', value: 168 },
    { name: 'EV',       value: 24 },
    { name: 'Accessible',value: 12 },
    { name: 'Premium',  value: 36 },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">Analytics</h1>
          <p className="text-surface-400 text-sm mt-0.5">Parking performance and business metrics</p>
        </div>
        <DemoBadge />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(DEMO_ANALYTICS.totalRevenue, 'INR').replace('₹', '₹')} description={DEMO_ANALYTICS.period} change={12.4} changeLabel="vs prev period" />
        <StatCard title="Total Bookings" value={DEMO_ANALYTICS.totalBookings.toLocaleString()} change={8.1} changeLabel="vs prev period" />
        <StatCard title="Avg Occupancy" value={`${DEMO_ANALYTICS.avgOccupancy}%`} description="Across all facilities" change={3.2} changeLabel="vs prev period" />
        <StatCard title="No-show Rate" value={`${DEMO_ANALYTICS.noShowRate}%`} description="Of confirmed bookings" change={-2.1} changeLabel="improvement" />
      </div>

      {/* Occupancy trend */}
      <Card>
        <CardHeader>
          <CardTitle>24-hour Occupancy Trend</CardTitle>
          <DemoBadge />
        </CardHeader>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={occupancyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="timestamp" hide />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => [`${v.toFixed(1)}%`]} labelFormatter={() => ''} />
            <Area type="monotone" dataKey="actual" name="Actual" stroke="#6366f1" fill="#6366f120" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#10b981" fill="none" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Revenue */}
        <Card>
          <CardHeader><CardTitle>Revenue Trend (30 days)</CardTitle><DemoBadge /></CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData} barSize={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 9 }} tickFormatter={v => v.slice(5)} interval={4} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [formatCurrency(v, 'INR'), 'Revenue']} />
              <Bar dataKey="revenue" fill="#6366f1" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Weekly occupancy pattern */}
        <Card>
          <CardHeader><CardTitle>Weekly Occupancy Pattern</CardTitle><DemoBadge /></CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`${v}%`, 'Avg Occupancy']} />
              <Bar dataKey="occupancy" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Hourly pattern */}
        <Card>
          <CardHeader><CardTitle>Hourly Demand Pattern</CardTitle><DemoBadge /></CardHeader>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 9 }} interval={3} />
              <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} unit="%" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`${v}%`]} />
              <Line type="monotone" dataKey="occupancy" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Slot type distribution */}
        <Card>
          <CardHeader><CardTitle>Slot Type Distribution</CardTitle></CardHeader>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {pieData.map((p, i) => (
                <div key={p.name} className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-surface-300">{p.name}</span>
                  <span className="text-surface-400 ml-auto">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ML Model Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>AI Model Performance</CardTitle>
          <DemoBadge />
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                {['Model', 'Task', 'MAE', 'RMSE', 'MAPE / F1', 'Status', 'Drift'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-surface-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_MODEL_METRICS.map(m => (
                <tr key={m.modelName} className="border-b border-surface-900 hover:bg-surface-800/30 transition-colors">
                  <td className="py-3 px-3 font-medium text-surface-200">{m.modelName}</td>
                  <td className="py-3 px-3 text-surface-400">{m.task}</td>
                  <td className="py-3 px-3 text-surface-300">{m.mae > 0 ? m.mae.toFixed(2) : '—'}</td>
                  <td className="py-3 px-3 text-surface-300">{m.rmse > 0 ? m.rmse.toFixed(2) : '—'}</td>
                  <td className="py-3 px-3 text-surface-300">
                    {m.mape > 0 ? `${m.mape}%` : m.f1 ? `${m.f1}%` : '—'}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-xs font-semibold ${m.status === 'HEALTHY' ? 'text-available' : m.status === 'DEGRADED' ? 'text-reserved' : 'text-occupied'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-surface-800 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full" style={{ width: `${m.driftScore}%`, backgroundColor: m.driftScore > 60 ? '#ef4444' : m.driftScore > 30 ? '#f59e0b' : '#10b981' }} />
                      </div>
                      <span className="text-xs text-surface-400">{m.driftScore}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-surface-600 mt-3">⚡ Model metrics are from simulated training experiments. Not real production model results.</p>
      </Card>
    </div>
  )
}
