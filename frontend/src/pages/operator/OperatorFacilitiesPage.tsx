import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, MapPin, Edit3, Plus, Settings, DollarSign,
  Activity, CheckCircle, AlertTriangle, Layers, Save, Sliders
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge, DemoBadge, CongestionBadge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { DEMO_FACILITIES } from '@/services/demoData'
import { formatCurrency, getOccupancyColor } from '@/lib/utils'
import type { ParkingFacility } from '@/types'
import toast from 'react-hot-toast'

export default function OperatorFacilitiesPage() {
  const [facilities, setFacilities] = useState<ParkingFacility[]>(DEMO_FACILITIES)
  const [editFacility, setEditFacility] = useState<ParkingFacility | null>(null)
  const [editRate, setEditRate] = useState<string>('')
  const [editStatus, setEditStatus] = useState<ParkingFacility['status']>('ACTIVE')

  const handleOpenEdit = (fac: ParkingFacility) => {
    setEditFacility(fac)
    setEditRate(String(fac.pricePerHour))
    setEditStatus(fac.status)
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editFacility) return

    setFacilities(prev => prev.map(f => {
      if (f.id === editFacility.id) {
        return {
          ...f,
          pricePerHour: Number(editRate) || f.pricePerHour,
          status: editStatus,
        }
      }
      return f
    }))

    toast.success(`Updated settings for ${editFacility.name}`)
    setEditFacility(null)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Building2 size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">Facility Infrastructure Manager</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Manage parking facilities, operating status, floor plans, and base pricing structures
          </p>
        </div>
        <DemoBadge />
      </div>

      {/* Facilities Grid */}
      <div className="space-y-4">
        {facilities.map(fac => {
          const occColor = getOccupancyColor(fac.occupancyRate)
          return (
            <Card key={fac.id} className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                      fac.status === 'ACTIVE'
                        ? 'bg-available/10 text-available border border-available/30'
                        : 'bg-reserved/10 text-reserved border border-reserved/30'
                    }`}>
                      {fac.status}
                    </span>
                    <span className="text-2xs text-surface-500">ID #{fac.id} · Operator Assigned</span>
                  </div>
                  <h3 className="text-lg font-bold text-surface-100">{fac.name}</h3>
                  <p className="text-xs text-surface-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-surface-500" /> {fac.address}, {fac.city}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-surface-500">Base Price</p>
                    <p className="text-lg font-black text-available">{formatCurrency(fac.pricePerHour, 'INR')}/hr</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit3 size={13} />}
                    onClick={() => handleOpenEdit(fac)}
                  >
                    Edit Rates &amp; Status
                  </Button>
                </div>
              </div>

              {/* Occupancy and capacity progress */}
              <div className="space-y-1.5 pt-2 border-t border-surface-800">
                <div className="flex justify-between text-xs">
                  <span className="text-surface-400">Total Capacity Utilization ({fac.availableSlots} free / {fac.totalSlots} slots)</span>
                  <span className="font-bold" style={{ color: occColor }}>{fac.occupancyRate}%</span>
                </div>
                <ProgressBar value={fac.occupancyRate} occupancyColor size="sm" />
              </div>

              {/* Floor and Zone Breakdown */}
              <div className="space-y-2 pt-2">
                <p className="text-2xs font-bold text-surface-400 uppercase tracking-wide">Floors &amp; Zones Layout</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {fac.floors.map(fl => (
                    <div key={fl.id} className="p-3 bg-surface-800/40 rounded-xl border border-surface-700/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-surface-200">{fl.name}</span>
                        <span className="text-2xs text-available font-semibold">{fl.availableSlots} free</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {fl.zones.map(z => (
                          <span key={z.id} className="text-2xs px-2 py-0.5 bg-surface-900 border border-surface-800 rounded text-surface-300">
                            {z.name} ({z.type}): {z.totalSlots} slots
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Edit Modal */}
      {editFacility && (
        <Modal isOpen onClose={() => setEditFacility(null)} title={`Configure ${editFacility.name}`} size="md">
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <Input
              label="Base Hourly Rate (₹/hr)"
              value={editRate}
              onChange={e => setEditRate(e.target.value)}
              type="number"
              leftIcon={<DollarSign size={14} />}
              required
            />

            <Select
              label="Facility Operational Status"
              value={editStatus}
              onChange={e => setEditStatus(e.target.value as any)}
              options={[
                { value: 'ACTIVE', label: '🟢 ACTIVE — Open for bookings and live sensor streams' },
                { value: 'MAINTENANCE', label: '🟡 MAINTENANCE — Restricted admittance' },
                { value: 'CLOSED', label: '🔴 CLOSED — Facility shut' },
              ]}
            />

            <div className="p-3 bg-brand-900/30 border border-brand-800/40 rounded-xl text-xs text-brand-300 leading-relaxed">
              Price updates propagate instantly to the Dynamic Pricing Optimizer and User Search pages.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditFacility(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Save size={14} />}>
                Save Facility
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
