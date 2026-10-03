import { useState } from 'react'
import {
  DollarSign, Sliders, TrendingUp, AlertTriangle, ShieldCheck,
  Save, CheckCircle, Percent, Plus, Trash2
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { DEMO_FACILITIES } from '@/services/demoData'
import toast from 'react-hot-toast'

interface PricingRule {
  id: string
  name: string
  occupancyThreshold: number
  multiplier: number
  description: string
  active: boolean
}

const INITIAL_RULES: PricingRule[] = [
  { id: 'r1', name: 'High Occupancy Peak Surge', occupancyThreshold: 80, multiplier: 1.35, description: 'Triggers when facility capacity exceeds 80%', active: true },
  { id: 'r2', name: 'Critical Demand Surge', occupancyThreshold: 90, multiplier: 1.60, description: 'Triggers near full capacity to manage incoming congestion', active: true },
  { id: 'r3', name: 'Off-Peak Incentive Discount', occupancyThreshold: 35, multiplier: 0.80, description: 'Encourages bookings during low utilization periods', active: true },
]

export default function AdminPricingPage() {
  const [minPrice, setMinPrice] = useState('30')
  const [maxPrice, setMaxPrice] = useState('140')
  const [rules, setRules] = useState<PricingRule[]>(INITIAL_RULES)
  const [isSaving, setIsSaving] = useState(false)

  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r))
    toast.success('Rule state updated')
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('Pricing guardrails & dynamic rules applied platform-wide!')
    }, 600)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <DollarSign size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">Dynamic Pricing Rules Engine</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Set autonomous price adjustment rules, safety guardrails, and demand elasticity parameters
          </p>
        </div>
        <DemoBadge />
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Guardrails */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Platform Pricing Guardrails (Safety Bounds)</CardTitle>
              <p className="text-xs text-surface-400 mt-0.5">
                Automated ML pricing recommendations can never breach these hard lower and upper limits.
              </p>
            </div>
            <Badge variant="available" size="sm">Guardrails Active</Badge>
          </CardHeader>

          <div className="grid sm:grid-cols-2 gap-4 my-2">
            <Input
              label="Minimum Floor Price (₹/hr)"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              type="number"
              leftIcon={<DollarSign size={14} />}
              required
            />
            <Input
              label="Maximum Ceiling Price (₹/hr)"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              type="number"
              leftIcon={<DollarSign size={14} />}
              required
            />
          </div>
        </Card>

        {/* Dynamic Rules Table */}
        <Card>
          <CardHeader>
            <CardTitle>Active Automated Multipliers</CardTitle>
          </CardHeader>

          <div className="space-y-3">
            {rules.map(rule => (
              <div
                key={rule.id}
                className="p-4 bg-surface-800/40 border border-surface-700/60 rounded-xl flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-surface-100 text-sm">{rule.name}</span>
                    <Badge variant={rule.active ? 'available' : 'default'} size="sm">
                      {rule.active ? 'ACTIVE' : 'DISABLED'}
                    </Badge>
                  </div>
                  <p className="text-xs text-surface-400 leading-relaxed">{rule.description}</p>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-bold text-brand-400">{rule.multiplier}x Multiplier</span>
                    <p className="text-2xs text-surface-500">Threshold: {rule.occupancyThreshold}% Occ</p>
                  </div>

                  <input
                    type="checkbox"
                    checked={rule.active}
                    onChange={() => handleToggleRule(rule.id)}
                    className="accent-brand-500 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSaving}
            leftIcon={<Save size={15} />}
          >
            Save &amp; Propagate Rules
          </Button>
        </div>
      </form>
    </div>
  )
}
