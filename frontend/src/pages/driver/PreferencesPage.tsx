import { useState } from 'react'
import {
  Settings, Sliders, Zap, Accessibility, Bell, Shield,
  Save, CheckCircle, Car, Brain, Navigation, DollarSign, Leaf
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuthStore, useUser } from '@/store/authStore'
import { OPTIMIZATION_MODES } from '@/lib/utils'
import type { OptimizationMode, UserPreferences } from '@/types'
import toast from 'react-hot-toast'

export default function PreferencesPage() {
  const user = useUser()
  const { setUser } = useAuthStore()

  const [mode, setMode] = useState<OptimizationMode>(user?.preferences?.optimizationMode ?? 'balanced')
  const [evOnly, setEvOnly] = useState<boolean>(user?.preferences?.evOnly ?? false)
  const [accessibleOnly, setAccessibleOnly] = useState<boolean>(user?.preferences?.accessibleOnly ?? false)
  const [maxWalkDistance, setMaxWalkDistance] = useState<number>(user?.preferences?.maxWalkDistance ?? 400)
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(user?.preferences?.notificationsEnabled ?? true)

  // Extra vehicle & booking preferences
  const [vehicleType, setVehicleType] = useState('SEDAN')
  const [vehiclePlate, setVehiclePlate] = useState('TN 09 BX 4092')
  const [defaultDuration, setDefaultDuration] = useState('120')
  const [autoExtend, setAutoExtend] = useState(true)
  const [congestionAlerts, setCongestionAlerts] = useState(true)

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 600))

    if (user) {
      const updatedPreferences: UserPreferences = {
        optimizationMode: mode,
        evOnly,
        accessibleOnly,
        maxWalkDistance,
        notificationsEnabled,
      }
      setUser({ ...user, preferences: updatedPreferences })
    }

    setIsSaving(false)
    toast.success('Preferences saved successfully!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Settings size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">Preferences & Allocation Rules</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Configure how the ParkSense-X Multi-Objective AI scores and selects your parking slots
          </p>
        </div>
        <DemoBadge />
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Optimization Preference */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Default Optimization Strategy</CardTitle>
              <p className="text-xs text-surface-400 mt-0.5">
                The recommendation engine weights availability, walking distance, price, and carbon emissions according to your chosen mode.
              </p>
            </div>
            <Badge variant="info" size="sm">AI Engine</Badge>
          </CardHeader>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-3">
            {(Object.entries(OPTIMIZATION_MODES) as [OptimizationMode, { label: string; icon: string; description: string }][]).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`flex flex-col items-center gap-2 p-3.5 border rounded-xl text-center transition-all cursor-pointer ${
                  mode === key
                    ? 'bg-brand-900/50 border-brand-500 text-brand-300 ring-1 ring-brand-500'
                    : 'bg-surface-800/40 border-surface-700 text-surface-400 hover:border-surface-600'
                }`}
              >
                <span className="text-2xl">{val.icon}</span>
                <span className="text-xs font-bold text-surface-100">{val.label}</span>
                <span className="text-2xs opacity-75">{val.description}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Weight Visualization */}
          <div className="mt-4 p-4 bg-surface-950/60 rounded-xl border border-surface-800 space-y-2.5">
            <p className="text-xs font-bold text-surface-300 uppercase tracking-wide">
              Active Weight Distribution for ({OPTIMIZATION_MODES[mode].label})
            </p>
            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              {[
                { label: 'Price & Affordability', w: mode === 'cheapest' ? 40 : mode === 'balanced' ? 20 : 10, color: '#10b981' },
                { label: 'Distance to Entrance/Elevator', w: mode === 'closest' ? 40 : mode === 'balanced' ? 20 : 10, color: '#6366f1' },
                { label: 'Instant Availability Confidence', w: mode === 'fastest' ? 35 : 25, color: '#f59e0b' },
                { label: 'Carbon & Energy Footprint', w: mode === 'greenest' ? 35 : 15, color: '#059669' },
              ].map(w => (
                <div key={w.label} className="space-y-1">
                  <div className="flex justify-between text-2xs">
                    <span className="text-surface-400">{w.label}</span>
                    <span className="font-bold text-surface-200">{w.w}%</span>
                  </div>
                  <ProgressBar value={w.w} size="xs" color={w.color} />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Vehicle & Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle & Special Requirements</CardTitle>
          </CardHeader>

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Primary Vehicle Type"
              value={vehicleType}
              onChange={e => setVehicleType(e.target.value)}
              options={[
                { value: 'SEDAN', label: '🚗 Sedan / Hatchback' },
                { value: 'SUV', label: '🚙 SUV / Crossover' },
                { value: 'EV', label: '⚡ Electric Vehicle (EV)' },
                { value: 'MOTORCYCLE', label: '🏍️ Motorcycle / Scooter' },
                { value: 'COMPACT', label: '🚗 Compact / Microcar' },
              ]}
            />

            <Input
              label="Vehicle License Plate"
              value={vehiclePlate}
              onChange={e => setVehiclePlate(e.target.value)}
              placeholder="e.g. TN 09 BX 4092"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-surface-800">
            <label className="flex items-start gap-3 p-3 bg-surface-800/40 border border-surface-700/60 rounded-xl cursor-pointer hover:bg-surface-800/80 transition-colors">
              <input
                type="checkbox"
                checked={evOnly}
                onChange={e => setEvOnly(e.target.checked)}
                className="accent-brand-500 w-4 h-4 mt-0.5 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-surface-200 flex items-center gap-1.5">
                  <Zap size={14} className="text-brand-400" /> Only Recommend EV Charging Slots
                </span>
                <p className="text-2xs text-surface-400 mt-0.5">Filter out slots without dedicated EV charger ports.</p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 bg-surface-800/40 border border-surface-700/60 rounded-xl cursor-pointer hover:bg-surface-800/80 transition-colors">
              <input
                type="checkbox"
                checked={accessibleOnly}
                onChange={e => setAccessibleOnly(e.target.checked)}
                className="accent-brand-500 w-4 h-4 mt-0.5 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-surface-200 flex items-center gap-1.5">
                  <Accessibility size={14} className="text-available" /> Accessible Parking Only
                </span>
                <p className="text-2xs text-surface-400 mt-0.5">Prioritize ground floor wide slots near ramps and elevators.</p>
              </div>
            </label>
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-surface-300">Max Acceptable Walking Distance: {maxWalkDistance} m</span>
              <span className="text-surface-500">~{Math.round(maxWalkDistance / 80)} min walk</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={maxWalkDistance}
              onChange={e => setMaxWalkDistance(Number(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>
        </Card>

        {/* Booking Defaults & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications & Automation</CardTitle>
          </CardHeader>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-surface-800/40 border border-surface-700/60 rounded-xl cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Bell size={16} className="text-brand-400" />
                <div>
                  <p className="text-xs font-bold text-surface-200">Real-Time Booking & Expiry Alerts</p>
                  <p className="text-2xs text-surface-400">Receive in-app reminder 15 minutes prior to booking expiration.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={e => setNotificationsEnabled(e.target.checked)}
                className="accent-brand-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-surface-800/40 border border-surface-700/60 rounded-xl cursor-pointer">
              <div className="flex items-center gap-2.5">
                <Brain size={16} className="text-reserved" />
                <div>
                  <p className="text-xs font-bold text-surface-200">Surge & Peak Congestion Warnings</p>
                  <p className="text-2xs text-surface-400">Notify when saved facilities are predicted to reach &gt;85% capacity.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={congestionAlerts}
                onChange={e => setCongestionAlerts(e.target.checked)}
                className="accent-brand-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-surface-800/40 border border-surface-700/60 rounded-xl cursor-pointer">
              <div className="flex items-center gap-2.5">
                <CheckCircle size={16} className="text-available" />
                <div>
                  <p className="text-xs font-bold text-surface-200">Auto-Extend Overstay Grace Period</p>
                  <p className="text-2xs text-surface-400">Gracefully extend slot reservation by 15 mins if delayed at exit.</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoExtend}
                onChange={e => setAutoExtend(e.target.checked)}
                className="accent-brand-500 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSaving}
            leftIcon={<Save size={15} />}
          >
            {isSaving ? 'Saving Changes…' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  )
}
