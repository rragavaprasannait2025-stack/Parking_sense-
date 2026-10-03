import { Link } from 'react-router-dom'
import {
  Brain, Zap, Layers, Sparkles, Target, Activity, Shield,
  Leaf, ArrowRight, CheckCircle, Code2, Server, Database
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { PublicFooter } from './PublicFooter'

export default function AboutPage() {
  const steps = [
    { num: '01', name: 'OBSERVE', desc: 'Real-time telemetry continuously ingested from parking slot sensors, QR gates, and booking state machines.', icon: <Activity size={18} /> },
    { num: '02', name: 'PREDICT', desc: 'XGBoost and LSTM sequence neural networks forecast occupancy 15 to 60 minutes ahead with confidence bounds.', icon: <TrendingUpIcon size={18} /> },
    { num: '03', name: 'SIMULATE', desc: 'A real-time Digital Twin virtual model allows operators to model what-if scenarios before enacting policy.', icon: <Layers size={18} /> },
    { num: '04', name: 'OPTIMIZE', desc: 'Multi-objective Pareto scoring balances walking distance, price, congestion, availability, and carbon emissions.', icon: <Target size={18} /> },
    { num: '05', name: 'ACT', desc: 'Digital QR passes and dynamic gate actuators admit vehicles smoothly with automated slot reservation.', icon: <Zap size={18} /> },
    { num: '06', name: 'LEARN', desc: 'Every completed session and driver feedback signal triggers model drift evaluation and continuous retraining.', icon: <Brain size={18} /> },
  ]

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100 flex flex-col pt-16">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-900/50 border border-brand-700/40 rounded-full text-brand-300 text-xs font-semibold">
          <Sparkles size={13} /> Final-Year Information Technology Project
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-surface-50 leading-tight">
          About <span className="text-gradient">ParkSense-X</span>
        </h1>
        <p className="text-lg text-surface-400 max-w-3xl mx-auto leading-relaxed">
          A Predictive Digital Twin and Multi-Objective AI Framework for Intelligent Parking Allocation.
          Transforming static parking garages into autonomous, demand-aware urban mobility hubs.
        </p>
      </section>

      {/* Intelligence Loop */}
      <section className="py-16 bg-surface-900/40 border-y border-surface-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <Badge variant="info" size="md">Core Philosophy</Badge>
            <h2 className="text-3xl font-black text-surface-50">The 6-Stage Intelligence Loop</h2>
            <p className="text-surface-400 text-sm max-w-xl mx-auto">
              How ParkSense-X continuously moves from real-time observation to autonomous optimization
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map(s => (
              <Card key={s.num} hover className="p-5 space-y-3 bg-surface-900 border-surface-800">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-brand-900 text-brand-300">
                    STAGE {s.num}
                  </span>
                  <div className="text-brand-400">{s.icon}</div>
                </div>
                <h3 className="font-bold text-surface-100 text-base">{s.name}</h3>
                <p className="text-xs text-surface-400 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture & Tech Stack */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <Badge variant="available" size="md">Architecture</Badge>
          <h2 className="text-3xl font-black text-surface-50">System Architecture &amp; Technology Stack</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <Card className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-900/50 border border-brand-800 flex items-center justify-center text-brand-400">
              <Code2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-surface-100">Frontend Tier</h3>
              <p className="text-2xs text-surface-500">React 18 · TypeScript · Vite · Tailwind</p>
            </div>
            <ul className="text-xs text-surface-400 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-available" /> Responsive single-page application</li>
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-available" /> Zustand state with persistent session</li>
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-available" /> Real-time SVG digital twin &amp; interactive map</li>
            </ul>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-available/10 border border-available/30 flex items-center justify-center text-available">
              <Server size={20} />
            </div>
            <div>
              <h3 className="font-bold text-surface-100">Backend Tier</h3>
              <p className="text-2xs text-surface-500">Spring Boot 3.3 · Java 21 · JPA · Security</p>
            </div>
            <ul className="text-xs text-surface-400 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-available" /> Stateless JWT bearer token authentication</li>
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-available" /> WebSocket STOMP message broadcasting</li>
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-available" /> MySQL 8.0 relational persistent storage</li>
            </ul>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-reserved/10 border border-reserved/30 flex items-center justify-center text-reserved">
              <Brain size={20} />
            </div>
            <div>
              <h3 className="font-bold text-surface-100">ML Microservice Tier</h3>
              <p className="text-2xs text-surface-500">FastAPI · Python 3.11 · XGBoost · Scikit-Learn</p>
            </div>
            <ul className="text-xs text-surface-400 space-y-2">
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-available" /> XGBoost &amp; LSTM demand forecasting</li>
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-available" /> Random Forest no-show risk classification</li>
              <li className="flex items-center gap-2"><CheckCircle size={12} className="text-available" /> Multi-objective explainable slot optimizer</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface-900/60 border-t border-surface-800 text-center space-y-5">
        <h2 className="text-2xl font-bold text-surface-50">Ready to test the live platform?</h2>
        <div className="flex justify-center gap-3">
          <Link to="/driver/search">
            <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />}>
              Try Smart Search
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="md">
              Operator Sign In
            </Button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}

function TrendingUpIcon(props: { size?: number }) {
  return (
    <svg width={props.size ?? 20} height={props.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  )
}
