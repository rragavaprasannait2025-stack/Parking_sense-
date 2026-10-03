import { useState } from 'react'
import {
  BarChart2, Cpu, CheckCircle, AlertTriangle, TrendingUp,
  Brain, RefreshCw, Layers, Sparkles
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { DEMO_MODEL_METRICS } from '@/services/demoData'

const lossEpochsData = [
  { epoch: 'E1', trainLoss: 0.82, valLoss: 0.88 },
  { epoch: 'E5', trainLoss: 0.44, valLoss: 0.49 },
  { epoch: 'E10', trainLoss: 0.28, valLoss: 0.32 },
  { epoch: 'E15', trainLoss: 0.18, valLoss: 0.22 },
  { epoch: 'E20', trainLoss: 0.12, valLoss: 0.16 },
  { epoch: 'E25', trainLoss: 0.08, valLoss: 0.13 },
]

const radarComparison = [
  { metric: 'Accuracy', XGBoost: 94, LSTM: 91, RandomForest: 87, Baseline: 42 },
  { metric: 'Low Latency', XGBoost: 98, LSTM: 76, RandomForest: 92, Baseline: 99 },
  { metric: 'Drift Resilience', XGBoost: 88, LSTM: 82, RandomForest: 78, Baseline: 30 },
  { metric: 'Low MAE', XGBoost: 96, LSTM: 94, RandomForest: 85, Baseline: 38 },
  { metric: 'Explainability', XGBoost: 90, LSTM: 62, RandomForest: 88, Baseline: 100 },
]

export default function AdminModelEvaluationPage() {
  const [retraining, setRetraining] = useState(false)

  const handleRetrainAll = () => {
    setRetraining(true)
    setTimeout(() => setRetraining(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <BarChart2 size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">Academic ML Model Evaluation</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Empirical benchmark metrics comparing XGBoost, LSTM, Random Forest, and baseline heuristics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <Button
            variant="primary"
            size="sm"
            loading={retraining}
            leftIcon={<RefreshCw size={13} />}
            onClick={handleRetrainAll}
          >
            {retraining ? 'Simulating Retraining…' : 'Trigger Benchmark Retrain'}
          </Button>
        </div>
      </div>

      {/* Benchmark Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cross-Model Evaluation Matrix</CardTitle>
          <Badge variant="info" size="sm">Evaluation Benchmark</Badge>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                {['Model Architecture', 'Target Problem', 'MAE', 'RMSE', 'MAPE (%)', 'F1 Score', 'Status', 'Data Points'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-2xs font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_MODEL_METRICS.map(m => (
                <tr key={m.modelName} className="border-b border-surface-900 hover:bg-surface-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-surface-100">{m.modelName}</td>
                  <td className="py-3 px-3 text-surface-400 text-xs">{m.task}</td>
                  <td className="py-3 px-3 font-mono text-xs text-brand-300">{m.mae > 0 ? m.mae.toFixed(2) : '—'}</td>
                  <td className="py-3 px-3 font-mono text-xs text-brand-300">{m.rmse > 0 ? m.rmse.toFixed(2) : '—'}</td>
                  <td className="py-3 px-3 font-mono text-xs text-available">{m.mape > 0 ? `${m.mape}%` : '—'}</td>
                  <td className="py-3 px-3 font-mono text-xs text-available">{m.f1 ? `${m.f1}%` : '—'}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      m.status === 'HEALTHY'
                        ? 'bg-available/10 text-available border border-available/30'
                        : 'bg-reserved/10 text-reserved border border-reserved/30'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-xs text-surface-400">{m.dataPoints.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Evaluation Charts */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Radar Benchmark */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Dimensional Model Benchmark</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarComparison}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#64748b', fontSize: 11 }} />
              <Radar name="XGBoost" dataKey="XGBoost" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              <Radar name="LSTM" dataKey="LSTM" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Radar name="Random Forest" dataKey="RandomForest" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Training Loss Convergence */}
        <Card>
          <CardHeader>
            <CardTitle>LSTM &amp; XGBoost Training Loss Convergence</CardTitle>
          </CardHeader>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lossEpochsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="epoch" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="trainLoss" name="Training Loss" stroke="#6366f1" strokeWidth={2.5} />
              <Line type="monotone" dataKey="valLoss" name="Validation Loss" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Confusion Matrix Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Confusion Matrix — No-Show Random Forest Classifier</CardTitle>
          <span className="text-xs text-surface-400">Tested on 3,040 synthetic reservations</span>
        </CardHeader>

        <div className="grid sm:grid-cols-2 gap-6 items-center">
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 bg-available/10 border border-available/30 rounded-xl">
                <p className="text-xs text-surface-400">True Positive (Showed up)</p>
                <p className="text-2xl font-black text-available mt-1">2,410</p>
                <p className="text-2xs text-surface-500 mt-0.5">Correctly Classified</p>
              </div>
              <div className="p-4 bg-occupied/10 border border-occupied/30 rounded-xl">
                <p className="text-xs text-surface-400">False Positive</p>
                <p className="text-2xl font-black text-occupied mt-1">142</p>
                <p className="text-2xs text-surface-500 mt-0.5">Predicted Show, Did Not</p>
              </div>
              <div className="p-4 bg-occupied/10 border border-occupied/30 rounded-xl">
                <p className="text-xs text-surface-400">False Negative</p>
                <p className="text-2xl font-black text-occupied mt-1">98</p>
                <p className="text-2xs text-surface-500 mt-0.5">Predicted No-Show, Showed</p>
              </div>
              <div className="p-4 bg-available/10 border border-available/30 rounded-xl">
                <p className="text-xs text-surface-400">True Negative (No-Show)</p>
                <p className="text-2xl font-black text-available mt-1">390</p>
                <p className="text-2xs text-surface-500 mt-0.5">Correctly Identified Risk</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface-800/40 rounded-xl border border-surface-700/60 space-y-3">
            <h4 className="text-xs font-bold text-surface-200 uppercase tracking-wide">Key Classification Metrics</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-surface-400">Overall Accuracy</span><span className="font-bold text-available">87.4%</span></div>
              <div className="flex justify-between"><span className="text-surface-400">Precision (Precision of No-Show alerts)</span><span className="font-bold text-surface-200">84.1%</span></div>
              <div className="flex justify-between"><span className="text-surface-400">Recall (Sensitivity to No-Shows)</span><span className="font-bold text-surface-200">81.2%</span></div>
              <div className="flex justify-between"><span className="text-surface-400">F1-Score</span><span className="font-bold text-available">82.6%</span></div>
            </div>
            <p className="text-2xs text-surface-500 pt-2 border-t border-surface-700/50">
              ⚡ SIMULATION: Metrics generated from ParkSense-X offline cross-validation datasets.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
