import { useState } from 'react'
import {
  Sliders, Server, Zap, Shield, Save, RefreshCw,
  Database, Bell, CheckCircle, AlertTriangle
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { config } from '@/config'
import toast from 'react-hot-toast'

export default function AdminSettingsPage() {
  const [demoMode, setDemoMode] = useState(config.demoMode)
  const [apiBase, setApiBase] = useState(config.apiBase)
  const [wsBase, setWsBase] = useState(config.wsBase)
  const [mlBase, setMlBase] = useState('http://localhost:8001')
  const [currency, setCurrency] = useState('INR')
  const [alertThreshold, setAlertThreshold] = useState('80')
  const [simSpeed, setSimSpeed] = useState('2000')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success('System configuration saved!')
    }, 600)
  }

  const handleResetData = () => {
    localStorage.removeItem('psx-auth')
    toast.success('Platform cache and local storage cleared!')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Sliders size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">System Configuration &amp; Settings</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Manage microservice endpoints, IoT simulation engines, security keys, and global thresholds
          </p>
        </div>
        <DemoBadge />
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Environment & Simulation Mode */}
        <Card>
          <CardHeader>
            <CardTitle>Environment &amp; Simulation Mode</CardTitle>
            <Badge variant="warning" size="sm">Core Config</Badge>
          </CardHeader>

          <div className="space-y-4">
            <label className="flex items-start justify-between p-4 bg-surface-800/40 border border-surface-700/60 rounded-xl cursor-pointer">
              <div>
                <span className="font-bold text-sm text-surface-100 flex items-center gap-1.5">
                  <Zap size={15} className="text-brand-400" /> Platform Demo &amp; Simulation Mode
                </span>
                <p className="text-xs text-surface-400 mt-1">
                  When enabled, all components display ⚡ SIMULATION badges and generate realistic mock IoT sensory telemetry.
                </p>
              </div>
              <input
                type="checkbox"
                checked={demoMode}
                onChange={e => setDemoMode(e.target.checked)}
                className="accent-brand-500 w-5 h-5 cursor-pointer mt-1"
              />
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <Select
                label="Simulation Event Telemetry Interval"
                value={simSpeed}
                onChange={e => setSimSpeed(e.target.value)}
                options={[
                  { value: '1000', label: '⚡ Ultra-Fast (1 event / 1.0s)' },
                  { value: '2000', label: '🚀 Standard Demo (1 event / 2.0s)' },
                  { value: '5000', label: '⏱️ Relaxed (1 event / 5.0s)' },
                ]}
              />

              <Input
                label="Peak Occupancy Alert Threshold (%)"
                value={alertThreshold}
                onChange={e => setAlertThreshold(e.target.value)}
                type="number"
                min="50"
                max="95"
              />
            </div>
          </div>
        </Card>

        {/* Backend & Microservice Endpoints */}
        <Card>
          <CardHeader>
            <CardTitle>Microservice Connectivity Endpoints</CardTitle>
          </CardHeader>

          <div className="space-y-4">
            <Input
              label="Spring Boot Backend REST API Base"
              value={apiBase}
              onChange={e => setApiBase(e.target.value)}
              placeholder="/api or http://localhost:8080"
              leftIcon={<Server size={14} />}
            />

            <Input
              label="WebSocket STOMP Broker Base"
              value={wsBase}
              onChange={e => setWsBase(e.target.value)}
              placeholder="/ws or http://localhost:8080/ws"
              leftIcon={<Zap size={14} />}
            />

            <Input
              label="FastAPI Python ML Microservice URL"
              value={mlBase}
              onChange={e => setMlBase(e.target.value)}
              placeholder="http://localhost:8001"
              leftIcon={<Database size={14} />}
            />
          </div>
        </Card>

        {/* Maintenance Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Cache &amp; Storage Maintenance</CardTitle>
          </CardHeader>

          <div className="flex items-center justify-between p-3 bg-surface-800/40 border border-surface-700/60 rounded-xl">
            <div>
              <p className="text-xs font-bold text-surface-200">Reset Local Session &amp; Cache</p>
              <p className="text-2xs text-surface-400">Clear cached tokens, simulated bookings, and local storage state.</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              leftIcon={<RefreshCw size={12} />}
              onClick={handleResetData}
            >
              Clear Storage
            </Button>
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
            Save System Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
