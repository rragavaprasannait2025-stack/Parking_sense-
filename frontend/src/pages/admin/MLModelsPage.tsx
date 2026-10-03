import { AlertTriangle, CheckCircle, RefreshCw, Cpu } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { DEMO_MODEL_METRICS } from '@/services/demoData'

const COMPARISON = [
  { model: 'Linear Reg', mae: 8.42, rmse: 11.34, mape: 11.8 },
  { model: 'Random Forest', mae: 4.18, rmse: 5.92, mape: 5.6 },
  { model: 'XGBoost', mae: 3.24, rmse: 4.81, mape: 4.2 },
  { model: 'LSTM', mae: 2.91, rmse: 4.12, mape: 3.7 },
]

export default function MLModelsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">ML Model Monitoring</h1>
          <p className="text-surface-400 text-sm mt-0.5">Model health, drift detection, and performance metrics</p>
        </div>
        <DemoBadge />
      </div>

      {/* Model health cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {DEMO_MODEL_METRICS.map(m => (
          <Card key={m.modelName}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-surface-100 text-sm">{m.modelName}</h3>
                <p className="text-xs text-surface-400 mt-0.5">{m.task}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {m.status === 'HEALTHY' ? (
                  <CheckCircle size={14} className="text-available" />
                ) : (
                  <AlertTriangle size={14} className="text-reserved" />
                )}
                <Badge variant={m.status === 'HEALTHY' ? 'available' : m.status === 'DEGRADED' ? 'warning' : 'error'} size="sm">
                  {m.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {m.mae > 0 ? (
                <>
                  <div className="bg-surface-800/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-surface-500">MAE</p>
                    <p className="text-sm font-bold text-surface-200">{m.mae.toFixed(2)}</p>
                  </div>
                  <div className="bg-surface-800/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-surface-500">RMSE</p>
                    <p className="text-sm font-bold text-surface-200">{m.rmse.toFixed(2)}</p>
                  </div>
                  <div className="bg-surface-800/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-surface-500">MAPE</p>
                    <p className="text-sm font-bold text-surface-200">{m.mape}%</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-surface-800/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-surface-500">Accuracy</p>
                    <p className="text-sm font-bold text-surface-200">{m.accuracy}%</p>
                  </div>
                  <div className="bg-surface-800/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-surface-500">F1</p>
                    <p className="text-sm font-bold text-surface-200">{m.f1}%</p>
                  </div>
                  <div className="bg-surface-800/50 rounded-lg p-2 text-center">
                    <p className="text-xs text-surface-500">Recall</p>
                    <p className="text-sm font-bold text-surface-200">{m.recall}%</p>
                  </div>
                </>
              )}
            </div>

            <ProgressBar
              value={m.driftScore}
              label="Drift Score"
              showValue
              size="sm"
              color={m.driftScore > 60 ? '#ef4444' : m.driftScore > 30 ? '#f59e0b' : '#10b981'}
            />

            <div className="flex items-center justify-between mt-3">
              <p className="text-2xs text-surface-500">{m.dataPoints.toLocaleString()} data points · Last trained: {new Date(m.lastTrained).toLocaleDateString()}</p>
              {m.driftScore > 50 && (
                <Button variant="secondary" size="xs" leftIcon={<RefreshCw size={10} />}>Retrain</Button>
              )}
            </div>

            {m.driftScore > 60 && (
              <div className="mt-2 p-2 bg-occupied/10 border border-occupied/20 rounded-lg flex items-center gap-2">
                <AlertTriangle size={12} className="text-occupied" />
                <p className="text-2xs text-occupied">⚠ Drift detected — retraining recommended</p>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Model comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Model Comparison — Occupancy Prediction (MAE lower = better)</CardTitle>
          <DemoBadge />
        </CardHeader>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={COMPARISON} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} />
            <YAxis type="category" dataKey="model" tick={{ fill: '#64748b', fontSize: 11 }} width={90} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="mae"  name="MAE"  fill="#6366f1" radius={[0, 4, 4, 0]} barSize={14} />
            <Bar dataKey="rmse" name="RMSE" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={14} />
            <Bar dataKey="mape" name="MAPE%" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={14} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-surface-600 mt-2">⚡ Metrics from simulated training experiments on demo dataset. Not real production model evaluations.</p>
      </Card>
    </div>
  )
}
