import { useState } from 'react'
import { Link } from 'react-router-dom'
import { HelpCircle, ChevronDown, Search, Sparkles, Brain, ShieldCheck } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PublicFooter } from './PublicFooter'

interface FAQItem {
  category: 'General' | 'Drivers' | 'Operators' | 'AI & ML'
  q: string
  a: string
}

const FAQS: FAQItem[] = [
  {
    category: 'General',
    q: 'What is ParkSense-X?',
    a: 'ParkSense-X is an intelligent parking platform combining predictive digital twins, machine learning demand forecasting, and multi-objective optimization to dynamically allocate and price parking spots across smart urban facilities.',
  },
  {
    category: 'General',
    q: 'Is this real hardware or a simulated prototype?',
    a: 'ParkSense-X is a demonstration platform. It includes a full digital twin simulation engine that realistically models vehicle arrivals, departures, sensor events, and occupancy telemetry without requiring physical gate hardware. All simulated data is clearly labeled.',
  },
  {
    category: 'Drivers',
    q: 'How does the AI slot recommendation work?',
    a: 'The recommendation engine scores all available slots against your active preference (Balanced, Cheapest, Closest, Fastest, Greenest). It computes walking distance, live price, occupancy risk, and carbon emissions to deliver an explainable top choice.',
  },
  {
    category: 'Drivers',
    q: 'How do I enter the parking facility?',
    a: 'When you confirm a booking, a digital QR pass is generated immediately. In production, this QR code is scanned by optical gate barriers at the parking entrance for touchless entry.',
  },
  {
    category: 'Operators',
    q: 'What is the What-If Simulator?',
    a: 'The What-If Simulator enables facility operators to model operational scenarios (such as closing a zone for maintenance, anticipating an event surge, or adjusting rates) and observe predicted changes in revenue, search times, and congestion before enacting changes.',
  },
  {
    category: 'Operators',
    q: 'How does Dynamic Pricing work?',
    a: 'Our demand-aware pricing algorithm tracks real-time occupancy and 60-minute predicted trends. When demand surges, it recommends price adjustments within operator-configured safety guardrails (e.g. ₹30–₹140/hr) to balance congestion and maximize revenue.',
  },
  {
    category: 'AI & ML',
    q: 'What machine learning models power the platform?',
    a: 'The platform utilizes XGBoost for multi-horizon demand forecasting (15m to 24h), LSTM sequence neural networks for temporal pattern recognition, and Random Forest classifiers for reservation no-show risk probability estimation.',
  },
  {
    category: 'AI & ML',
    q: 'How does ParkSense-X measure carbon impact?',
    a: 'We estimate carbon savings based on vehicle fuel consumption models (average 7.2 L/100km, 2.31 kg CO₂/L) by calculating the reduction in searching and idling distance achieved through directed slot allocation.',
  },
]

export default function FAQPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('ALL')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const filtered = FAQS.filter(f => {
    if (search && !f.q.toLowerCase().includes(search.toLowerCase()) && !f.a.toLowerCase().includes(search.toLowerCase())) return false
    if (activeCategory !== 'ALL' && f.category !== activeCategory) return false
    return true
  })

  return (
    <div className="min-h-screen bg-surface-950 text-surface-100 flex flex-col pt-16">
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 w-full">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="info" size="md">Knowledge Base</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-surface-50">
            Frequently Asked Questions
          </h1>
          <p className="text-surface-400 text-sm max-w-lg mx-auto">
            Everything you need to know about ParkSense-X architecture, AI algorithms, and workflows
          </p>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search questions by keyword…"
            leftIcon={<Search size={15} />}
          />

          <div className="flex gap-2 justify-center flex-wrap">
            {['ALL', 'General', 'Drivers', 'Operators', 'AI & ML'].map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === c
                    ? 'bg-brand-600 text-white'
                    : 'bg-surface-800 text-surface-400 hover:text-surface-200'
                }`}
              >
                {c === 'ALL' ? 'All Questions' : c}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {filtered.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <Card
                key={faq.q}
                className="p-0 overflow-hidden border-surface-800 transition-colors hover:border-surface-700"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-brand-400 font-bold text-xs">[{faq.category}]</span>
                    <span className="font-bold text-surface-100 text-sm">{faq.q}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-surface-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-brand-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-surface-300 leading-relaxed border-t border-surface-800/80 bg-surface-950/40">
                    {faq.a}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
