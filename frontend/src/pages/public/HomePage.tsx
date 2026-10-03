import { Link } from 'react-router-dom'
import {
  ArrowRight, Zap, Brain, Activity, TrendingUp, Shield, Leaf,
  Car, Building2, BarChart2, ChevronRight, Play, Star,
  MapPin, Clock, DollarSign, Sparkles, FlaskConical, Target
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar, OccupancyGauge } from '@/components/ui/ProgressBar'
import { PublicFooter } from './PublicFooter'

// ─── Hero Section ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-950 via-surface-950 to-brand-950/20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-900/50 border border-brand-700/30 rounded-full text-brand-300 text-xs font-semibold mb-6">
            <Sparkles size={12} />
            Intelligent Parking Platform · Demo Build
          </div>

          <h1 className="text-5xl sm:text-6xl font-black text-surface-50 leading-[1.05] tracking-tight">
            Parking That<br />
            <span className="text-gradient">Predicts,</span><br />
            Optimizes<br />
            and Decides.
          </h1>

          <p className="mt-6 text-lg text-surface-400 leading-relaxed max-w-lg">
            ParkSense-X is a predictive digital twin platform that transforms smart parking into an
            AI-driven orchestration system — combining real-time monitoring, demand forecasting,
            multi-objective optimization, and explainable recommendations.
          </p>

          {/* Intelligence loop */}
          <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-semibold text-surface-500">
            {['OBSERVE', 'PREDICT', 'SIMULATE', 'OPTIMIZE', 'ACT', 'LEARN'].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="px-2 py-1 bg-brand-900/40 border border-brand-800/40 rounded text-brand-400">{step}</span>
                {i < arr.length - 1 && <ChevronRight size={12} className="text-surface-700" />}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/driver/search">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
                Find Smart Parking
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" leftIcon={<Play size={16} />}>
                Explore ParkSense-X
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero visualization */}
        <div className="hidden lg:block animate-slide-up">
          <HeroVisualization />
        </div>
      </div>
    </section>
  )
}

function HeroVisualization() {
  const slots = [
    ['A01','A02','A03','A04'],
    ['B01','B02','B03','B04'],
    ['C01','C02','C03','C04'],
  ]
  const statuses = [
    ['available','occupied','available','reserved'],
    ['occupied','available','occupied','available'],
    ['available','available','occupied','ev'],
  ]
  const statusColors: Record<string, string> = {
    available: 'bg-available/20 border-available/40 text-available',
    occupied:  'bg-occupied/20 border-occupied/40 text-occupied',
    reserved:  'bg-reserved/20 border-reserved/40 text-reserved',
    ev:        'bg-brand-900/50 border-brand-500/40 text-brand-300',
  }

  return (
    <div className="relative">
      {/* Main card */}
      <Card className="p-5 border-surface-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-surface-100 text-sm">Chennai Trade Centre</h3>
            <p className="text-xs text-surface-500">Level 1 · Live View</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-available animate-pulse" />
            <span className="text-xs text-available font-medium">LIVE</span>
          </div>
        </div>

        {/* Parking grid */}
        <div className="space-y-2 mb-4">
          {slots.map((row, ri) => (
            <div key={ri} className="grid grid-cols-4 gap-1.5">
              {row.map((slot, ci) => (
                <div
                  key={slot}
                  className={`border rounded-lg p-2 text-center transition-all duration-500 ${statusColors[statuses[ri][ci]]}`}
                >
                  <div className="text-xs font-bold">{slot}</div>
                  <div className="text-2xs mt-0.5 opacity-75">
                    {statuses[ri][ci] === 'ev' ? '⚡' : statuses[ri][ci] === 'available' ? '🟢' : statuses[ri][ci] === 'occupied' ? '🔴' : '🟡'}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Occupancy */}
        <ProgressBar value={72} occupancyColor label="Current Occupancy" showValue size="md" />

        {/* AI chip */}
        <div className="mt-4 bg-brand-900/40 border border-brand-700/30 rounded-lg p-3 flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
            <Brain size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-brand-300">AI Recommended: B24</p>
            <p className="text-2xs text-surface-400 mt-0.5">Suitability Score: 94/100 · Balanced mode</p>
            <div className="mt-1 flex gap-1">
              <span className="text-2xs text-surface-500">Availability 96%</span>
              <span className="text-2xs text-surface-700">·</span>
              <span className="text-2xs text-surface-500">Distance 91%</span>
              <span className="text-2xs text-surface-700">·</span>
              <span className="text-2xs text-surface-500">Carbon 90%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Floating prediction card */}
      <div className="absolute -top-6 -right-6 w-48 bg-surface-900 border border-surface-700 rounded-xl p-3 shadow-modal animate-bounce-subtle">
        <div className="flex items-center gap-1.5 mb-1.5">
          <TrendingUp size={12} className="text-reserved" />
          <span className="text-xs font-semibold text-surface-300">60-min Forecast</span>
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-black text-reserved">91%</span>
          <span className="text-xs text-surface-500 mb-0.5">occupancy</span>
        </div>
        <p className="text-2xs text-reserved/80 mt-0.5">⚠ Peak period approaching</p>
      </div>

      {/* Floating eco card */}
      <div className="absolute -bottom-4 -left-6 w-44 bg-surface-900 border border-surface-700 rounded-xl p-3 shadow-modal">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Leaf size={12} className="text-eco" />
          <span className="text-xs font-semibold text-surface-300">Today's Impact</span>
        </div>
        <div className="text-lg font-black text-eco">2.8 kg CO₂</div>
        <p className="text-2xs text-surface-500">saved across 42 drivers</p>
      </div>
    </div>
  )
}

// ─── Problem Section ──────────────────────────────────────────────────────────

function ProblemSection() {
  const problems = [
    { icon: '⏱', title: 'Wasted search time', desc: 'Drivers spend 8–12 minutes on average searching for a parking spot.' },
    { icon: '❓', title: 'Uncertain availability', desc: 'Real-time data shows current state but cannot predict what you will find on arrival.' },
    { icon: '📅', title: 'No-show reservations', desc: 'Up to 30% of reservations result in no-shows, wasting capacity.' },
    { icon: '🚦', title: 'Unmanaged congestion', desc: 'Parking congestion spills onto roads with no proactive management.' },
    { icon: '💸', title: 'Static pricing', desc: 'Fixed prices fail to reflect demand, leaving revenue and capacity unoptimized.' },
    { icon: '🌿', title: 'No sustainability view', desc: 'No awareness of the carbon impact of parking choices and routing.' },
  ]
  return (
    <section className="py-24 bg-surface-950" id="problem">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="error" size="md" className="mb-4">The Problem</Badge>
          <h2 className="text-4xl font-black text-surface-50">Traditional parking is broken</h2>
          <p className="mt-4 text-surface-400 text-lg max-w-2xl mx-auto">
            Conventional systems show current availability — nothing more. Drivers and operators are left guessing.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {problems.map(p => (
            <div key={p.title} className="bg-surface-900/50 border border-surface-800 rounded-xl p-5 hover:border-surface-700 transition-colors">
              <div className="text-3xl mb-3">{p.icon}</div>
              <h3 className="font-bold text-surface-100 mb-1">{p.title}</h3>
              <p className="text-sm text-surface-400 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features Section ─────────────────────────────────────────────────────────

function FeaturesSection() {
  const features = [
    {
      icon: <Activity size={20} className="text-brand-400" />,
      iconBg: 'bg-brand-900/50 border-brand-800/50',
      title: 'Parking Digital Twin',
      desc: 'A live virtual model of the entire parking facility. Every slot, zone, and floor updates in real time to reflect the physical state.',
      tags: ['Real-time', 'WebSocket'],
    },
    {
      icon: <TrendingUp size={20} className="text-reserved" />,
      iconBg: 'bg-reserved/10 border-reserved/20',
      title: 'Demand Prediction',
      desc: 'XGBoost and LSTM models forecast occupancy 15, 30, and 60 minutes ahead with confidence intervals and peak period detection.',
      tags: ['ML', 'XGBoost', 'LSTM'],
    },
    {
      icon: <Brain size={20} className="text-available" />,
      iconBg: 'bg-available/10 border-available/20',
      title: 'AI Recommendation',
      desc: 'Multi-factor scoring engine evaluates availability, distance, price, congestion, and carbon to find the optimal slot for each driver.',
      tags: ['Explainable AI', 'Multi-factor'],
    },
    {
      icon: <Shield size={20} className="text-occupied" />,
      iconBg: 'bg-occupied/10 border-occupied/20',
      title: 'No-Show Prediction',
      desc: 'Predicts which reservations are at risk of no-show so operators can proactively manage capacity and minimize waste.',
      tags: ['Random Forest', 'Risk'],
    },
    {
      icon: <DollarSign size={20} className="text-eco" />,
      iconBg: 'bg-eco/10 border-eco/20',
      title: 'Dynamic Pricing',
      desc: 'Demand-aware pricing engine automatically recommends optimal prices based on occupancy, predicted demand, and time patterns.',
      tags: ['Pricing', 'Demand-aware'],
    },
    {
      icon: <FlaskConical size={20} className="text-brand-300" />,
      iconBg: 'bg-brand-900/50 border-brand-800/50',
      title: 'What-If Simulator',
      desc: 'Operators can simulate scenarios — close a zone, add an event, change pricing — and see the predicted impact before acting.',
      tags: ['Simulation', 'Scenario'],
    },
    {
      icon: <Target size={20} className="text-reserved" />,
      iconBg: 'bg-reserved/10 border-reserved/20',
      title: 'Multi-objective Optimization',
      desc: 'Simultaneously optimizes cost, distance, congestion, utilization, and carbon impact using weighted multi-objective scoring.',
      tags: ['Optimization', 'Multi-objective'],
    },
    {
      icon: <Leaf size={20} className="text-eco" />,
      iconBg: 'bg-eco/10 border-eco/20',
      title: 'Carbon-Aware Parking',
      desc: 'Estimates driving distance, fuel consumption, and CO₂ per booking. Provides an eco recommendation to reduce emissions.',
      tags: ['Sustainability', 'CO₂'],
    },
  ]

  return (
    <section className="py-24 bg-surface-950/50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="info" size="md" className="mb-4">Core Capabilities</Badge>
          <h2 className="text-4xl font-black text-surface-50">Every layer of intelligent parking</h2>
          <p className="mt-4 text-surface-400 text-lg max-w-2xl mx-auto">
            ParkSense-X combines observation, prediction, simulation, and optimization into one connected platform.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <Card key={f.title} hover className="flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${f.iconBg}`}>
                {f.icon}
              </div>
              <div>
                <h3 className="font-bold text-surface-100 text-sm">{f.title}</h3>
                <p className="text-xs text-surface-400 mt-1 leading-relaxed">{f.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-auto">
                {f.tags.map(t => (
                  <Badge key={t} variant="default" size="sm">{t}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works Section ─────────────────────────────────────────────────────

function HowItWorksSection() {
  const steps = [
    { n: '01', title: 'Search & Discover', desc: 'Enter your destination and time. ParkSense-X finds all nearby facilities and shows live availability.', icon: <Search size={20} /> },
    { n: '02', title: 'AI Recommends', desc: 'The multi-objective AI engine evaluates hundreds of slot combinations and recommends the optimal choice with a full explanation.', icon: <Brain size={20} /> },
    { n: '03', title: 'Book & Get QR', desc: 'Confirm your booking in seconds. A digital QR pass is generated immediately.', icon: <Car size={20} /> },
    { n: '04', title: 'Park & Digital Twin Updates', desc: 'On entry, the QR is verified and the Digital Twin updates in real time. The operator sees your slot go live.', icon: <Activity size={20} /> },
    { n: '05', title: 'System Learns', desc: 'Every session feeds the prediction models. Accuracy improves continuously through the feedback loop.', icon: <Zap size={20} /> },
  ]

  return (
    <section className="py-24 bg-surface-950" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="available" size="md" className="mb-4">How It Works</Badge>
          <h2 className="text-4xl font-black text-surface-50">The intelligence loop in action</h2>
        </div>
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-surface-700 to-transparent" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, i) => (
              <div key={step.n} className="flex flex-col items-center text-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="relative w-16 h-16 rounded-2xl bg-brand-900/50 border border-brand-700/40 flex items-center justify-center z-10">
                  <span className="text-brand-400">{step.icon}</span>
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-600 rounded-full text-white text-2xs font-bold flex items-center justify-center">
                    {step.n.replace('0', '')}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-surface-100 text-sm">{step.title}</h3>
                  <p className="text-xs text-surface-400 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── For Drivers section ──────────────────────────────────────────────────────

function ForDriversSection() {
  return (
    <section className="py-24 bg-surface-950/50" id="for-drivers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <Badge variant="available" size="md" className="mb-4">For Drivers</Badge>
          <h2 className="text-3xl font-black text-surface-50">Find the right spot, not just any spot</h2>
          <p className="mt-4 text-surface-400 leading-relaxed">
            Tell ParkSense-X what matters to you — cheapest, closest, fastest, or greenest — and the AI optimizes
            across all factors to match your preference. You see exactly why each slot was recommended.
          </p>
          <ul className="mt-6 space-y-3">
            {['Explainable AI recommendations', 'Predicted availability — not just current', 'QR digital pass — no physical ticket', 'Carbon footprint per booking', 'Real-time booking status'].map(item => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-surface-300">
                <span className="w-4 h-4 rounded-full bg-available/20 border border-available/30 flex items-center justify-center flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-available" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link to="/register" className="mt-8 inline-flex">
            <Button variant="primary" size="md" rightIcon={<ArrowRight size={16} />}>Start for free</Button>
          </Link>
        </div>
        <div className="bg-surface-900 border border-surface-800 rounded-2xl p-6">
          {/* Sample recommendation */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <Badge variant="info" size="sm">AI Recommendation</Badge>
              <h3 className="mt-2 text-2xl font-black text-surface-50">Slot B24</h3>
              <p className="text-sm text-surface-400">Level 1 · Zone B · Chennai Trade Centre</p>
            </div>
            <OccupancyGauge value={94} size={72} />
          </div>
          <div className="space-y-2.5">
            {[
              { label: 'Availability',     value: 96 },
              { label: 'Distance',         value: 91 },
              { label: 'Price',            value: 88 },
              { label: 'Congestion',       value: 92 },
              { label: 'Walking distance', value: 94 },
              { label: 'Carbon impact',    value: 90 },
            ].map(f => (
              <ProgressBar key={f.label} value={f.value} label={f.label} showValue size="sm" color="#6366f1" />
            ))}
          </div>
          <div className="mt-4 bg-brand-900/30 border border-brand-800/40 rounded-lg p-3">
            <p className="text-xs text-surface-300 leading-relaxed">
              <span className="font-semibold text-brand-300">Why B24?</span> Best balance of availability,
              walking distance, and price based on your Balanced preference. Zone B has historically low congestion.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── For Operators section ────────────────────────────────────────────────────

function ForOperatorsSection() {
  return (
    <section className="py-24 bg-surface-950" id="for-operators">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1">
          <Card className="p-5">
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Occupancy',   value: '72%',   color: 'text-reserved',   change: '+12%' },
                { label: '60-min Pred', value: '91%',   color: 'text-occupied',   change: '↑ Peak' },
                { label: 'Revenue/Day', value: '₹28.4k', color: 'text-available', change: '+8.2%' },
                { label: 'No-Show Risk',value: '3 High', color: 'text-occupied',   change: '⚠ Alert' },
              ].map(s => (
                <div key={s.label} className="bg-surface-800 rounded-lg p-3">
                  <p className="text-2xs text-surface-500 uppercase tracking-wide">{s.label}</p>
                  <p className={`text-lg font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                  <p className="text-2xs text-surface-400">{s.change}</p>
                </div>
              ))}
            </div>
            <div className="bg-surface-800 rounded-lg p-3 flex items-start gap-3">
              <FlaskConical size={16} className="text-brand-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-surface-200">What-If: Close Zone A for 2h</p>
                <p className="text-2xs text-surface-400 mt-1">Occupancy +14% · Revenue +₹2.8k · Search time +3.6min</p>
                <p className="text-2xs text-available mt-1">→ Optimization recommends redirecting 18 vehicles to Level 2</p>
              </div>
            </div>
          </Card>
        </div>
        <div className="order-1 lg:order-2">
          <Badge variant="warning" size="md" className="mb-4">For Operators</Badge>
          <h2 className="text-3xl font-black text-surface-50">A command centre for intelligent decisions</h2>
          <p className="mt-4 text-surface-400 leading-relaxed">
            Move beyond reactive management. ParkSense-X gives you predictive occupancy, automated pricing recommendations,
            what-if simulation, and real-time anomaly detection — all in one operator dashboard.
          </p>
          <ul className="mt-6 space-y-3">
            {['Demand forecast up to 24 hours ahead', 'Predictive dynamic pricing recommendations', 'What-if scenario simulation', 'No-show risk scoring per reservation', 'Anomaly detection with operator alerts'].map(item => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-surface-300">
                <span className="w-4 h-4 rounded-full bg-brand-900 border border-brand-700/40 flex items-center justify-center flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Link to="/login" className="mt-8 inline-flex">
            <Button variant="secondary" size="md" rightIcon={<ArrowRight size={16} />}>Operator login</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Sustainability section ───────────────────────────────────────────────────

function SustainabilitySection() {
  return (
    <section className="py-24 bg-surface-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="available" size="md" className="mb-4">Sustainability</Badge>
        <h2 className="text-4xl font-black text-surface-50">Parking with a greener purpose</h2>
        <p className="mt-4 text-surface-400 max-w-xl mx-auto">
          ParkSense-X tracks and optimizes the environmental impact of every parking decision.
          These are estimated simulation values for demonstration purposes.
        </p>
        <div className="mt-12 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { value: '142 km', label: 'Estimated distance saved', icon: '📍', desc: 'Across all demo sessions today' },
            { value: '8.4 L',  label: 'Estimated fuel saved',     icon: '⛽', desc: 'Based on average consumption' },
            { value: '19.8 kg',label: 'Estimated CO₂ reduction',  icon: '🌱', desc: 'vs. unoptimized allocation' },
          ].map(s => (
            <div key={s.label} className="bg-eco/5 border border-eco/20 rounded-2xl p-6">
              <div className="text-4xl mb-3">{s.icon}</div>
              <div className="text-3xl font-black text-eco">{s.value}</div>
              <p className="text-sm font-semibold text-surface-300 mt-1">{s.label}</p>
              <p className="text-xs text-surface-500 mt-1">{s.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-surface-600">
          ⚡ SIMULATION DATA — Carbon calculations are estimates using standard fuel consumption models for demonstration purposes.
        </p>
      </div>
    </section>
  )
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section className="py-24 bg-surface-950">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-black text-surface-50">Experience intelligent parking</h2>
        <p className="mt-4 text-surface-400 text-lg">
          Try the complete ParkSense-X demo — search, book, see predictions, and run simulations.
          No hardware required.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/register">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
              Start Demo
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Sign in
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-xs text-surface-600">
          Demo accounts: driver@demo.com · operator@demo.com · admin@demo.com (password: Demo1234)
        </p>
      </div>
    </section>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

function Search(props: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg {...props} width={props.size ?? 20} height={props.size ?? 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ForDriversSection />
      <ForOperatorsSection />
      <SustainabilitySection />
      <CTASection />
      <PublicFooter />
    </>
  )
}
