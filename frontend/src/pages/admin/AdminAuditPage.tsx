import { useState } from 'react'
import {
  FileText, Search, Shield, CheckCircle, XCircle,
  Download, Filter, RefreshCw
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import type { AuditLog } from '@/types'
import toast from 'react-hot-toast'

const DEMO_AUDIT_LOGS: AuditLog[] = [
  { id: 1, userId: 1, userName: 'Arjun Krishnamurthy', action: 'BOOKING_CREATE', resource: 'Booking', resourceId: 204, details: 'Created reservation PX2048 at Chennai Trade Centre', ipAddress: '192.168.1.42', timestamp: '2026-08-23T10:45:00Z', result: 'SUCCESS' },
  { id: 2, userId: 2, userName: 'Priya Venkataraman', action: 'PRICE_OVERRIDE', resource: 'Facility', resourceId: 1, details: 'Applied dynamic pricing rate ₹75/hr for Trade Centre', ipAddress: '10.0.0.15', timestamp: '2026-08-23T10:30:12Z', result: 'SUCCESS' },
  { id: 3, userId: 2, userName: 'Priya Venkataraman', action: 'SIMULATION_TRIGGER', resource: 'WhatIf', resourceId: 101, details: 'Ran scenario Close Zone A for 2 hours', ipAddress: '10.0.0.15', timestamp: '2026-08-23T10:15:00Z', result: 'SUCCESS' },
  { id: 4, userId: 3, userName: 'Rajan Subramaniam', action: 'ROLE_UPDATE', resource: 'User', resourceId: 4, details: 'Updated user Divya Nair role to OPERATOR', ipAddress: '10.0.0.1', timestamp: '2026-08-23T09:50:33Z', result: 'SUCCESS' },
  { id: 5, userId: 0, userName: 'System Automated', action: 'ML_MODEL_EVAL', resource: 'XGBoost', resourceId: 1, details: 'Evaluated drift score on 42,000 data points (Drift: 12%)', ipAddress: '127.0.0.1', timestamp: '2026-08-23T08:00:00Z', result: 'SUCCESS' },
  { id: 6, userId: 1, userName: 'Arjun Krishnamurthy', action: 'AUTH_LOGIN', resource: 'Auth', details: 'Successful JWT login via email driver@demo.com', ipAddress: '192.168.1.42', timestamp: '2026-08-23T07:45:00Z', result: 'SUCCESS' },
]

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>(DEMO_AUDIT_LOGS)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')

  const filtered = logs.filter(l => {
    if (search && !l.userName.toLowerCase().includes(search.toLowerCase()) && !l.action.toLowerCase().includes(search.toLowerCase()) && !l.details?.toLowerCase().includes(search.toLowerCase())) return false
    if (actionFilter !== 'ALL' && !l.action.includes(actionFilter)) return false
    return true
  })

  const handleExport = () => {
    const jsonStr = JSON.stringify(logs, null, 2)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `parksensex-audit-logs-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    toast.success('Audit logs exported successfully!')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <FileText size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">System Audit &amp; Compliance Logs</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Immutable audit trail of all platform logins, booking actions, pricing changes, and simulation triggers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={handleExport}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by User, Action, or Resource details…"
            leftIcon={<Search size={14} />}
          />
          <Select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Action Categories' },
              { value: 'BOOKING', label: 'Bookings & Reservations' },
              { value: 'PRICE', label: 'Price Overrides' },
              { value: 'SIMULATION', label: 'Simulations & Scenarios' },
              { value: 'ROLE', label: 'Role & User Management' },
              { value: 'AUTH', label: 'Authentication & Logins' },
            ]}
          />
        </div>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Audit Trail ({filtered.length} entries)</CardTitle>
            <p className="text-xs text-surface-500 mt-0.5">SHA-256 compliant audit records</p>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                {['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address', 'Result'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-2xs font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} className="border-b border-surface-900 hover:bg-surface-800/40 transition-colors">
                  <td className="py-3 px-3 text-xs text-surface-400 whitespace-nowrap">
                    {new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    <span className="text-2xs text-surface-600 block">{new Date(l.timestamp).toLocaleDateString()}</span>
                  </td>

                  <td className="py-3 px-3">
                    <p className="font-bold text-surface-200 text-xs">{l.userName}</p>
                    <p className="text-2xs text-surface-500">ID #{l.userId}</p>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-2xs font-mono font-bold px-2 py-0.5 rounded bg-surface-800 text-brand-300 border border-surface-700">
                      {l.action}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-xs text-surface-300 font-semibold">{l.resource}</td>

                  <td className="py-3 px-3 text-xs text-surface-300 max-w-xs">{l.details}</td>

                  <td className="py-3 px-3 text-xs font-mono text-surface-400">{l.ipAddress}</td>

                  <td className="py-3 px-3">
                    <span className="text-2xs font-bold text-available flex items-center gap-1">
                      <CheckCircle size={12} /> {l.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
