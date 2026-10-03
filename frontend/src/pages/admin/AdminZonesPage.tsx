import { useState } from 'react'
import {
  Layers, Plus, Zap, Accessibility, Shield, DollarSign,
  Building2, CheckCircle, Edit3, Trash2
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { DEMO_FACILITIES } from '@/services/demoData'
import type { Zone, ZoneType } from '@/types'
import toast from 'react-hot-toast'

export default function AdminZonesPage() {
  const [selectedFacilityId, setSelectedFacilityId] = useState('1')
  const facility = DEMO_FACILITIES.find(f => String(f.id) === selectedFacilityId) ?? DEMO_FACILITIES[0]
  const [selectedFloorId, setSelectedFloorId] = useState<string>(String(facility.floors[0]?.id ?? 1))

  const currentFloor = facility.floors.find(fl => String(fl.id) === selectedFloorId) ?? facility.floors[0]
  const [zones, setZones] = useState<Zone[]>(currentFloor?.zones ?? [])

  const [addZoneModalOpen, setAddZoneModalOpen] = useState(false)
  const [newZoneName, setNewZoneName] = useState('')
  const [newZoneType, setNewZoneType] = useState<ZoneType>('STANDARD')
  const [newSlotCount, setNewSlotCount] = useState('30')
  const [newMultiplier, setNewMultiplier] = useState('1.0')

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newZoneName) return

    const newZone: Zone = {
      id: Date.now(),
      floorId: Number(selectedFloorId),
      name: newZoneName,
      type: newZoneType,
      slots: [],
      totalSlots: Number(newSlotCount) || 30,
      availableSlots: Number(newSlotCount) || 30,
      priceMultiplier: Number(newMultiplier) || 1.0,
    }

    setZones(prev => [...prev, newZone])
    setAddZoneModalOpen(false)
    setNewZoneName('')
    toast.success(`Zone "${newZone.name}" (${newZone.type}) added to ${currentFloor.name}!`)
  }

  const handleDeleteZone = (id: number) => {
    setZones(prev => prev.filter(z => z.id !== id))
    toast.success('Zone removed')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Layers size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">Zones &amp; Slot Topologies</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Configure floor levels, zone categories, EV charging capabilities, and price multipliers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setAddZoneModalOpen(true)}
          >
            Add New Zone
          </Button>
        </div>
      </div>

      {/* Selectors */}
      <Card className="p-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Select Parking Facility"
            value={selectedFacilityId}
            onChange={e => {
              setSelectedFacilityId(e.target.value)
              const fac = DEMO_FACILITIES.find(f => String(f.id) === e.target.value)
              if (fac?.floors[0]) {
                setSelectedFloorId(String(fac.floors[0].id))
                setZones(fac.floors[0].zones)
              }
            }}
            options={DEMO_FACILITIES.map(f => ({ value: String(f.id), label: f.name }))}
          />

          <Select
            label="Select Floor Level"
            value={selectedFloorId}
            onChange={e => {
              setSelectedFloorId(e.target.value)
              const fl = facility.floors.find(f => String(f.id) === e.target.value)
              if (fl) setZones(fl.zones)
            }}
            options={facility.floors.map(fl => ({ value: String(fl.id), label: `${fl.name} (${fl.totalSlots} slots)` }))}
          />
        </div>
      </Card>

      {/* Zones Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {zones.map(z => (
          <Card key={z.id} className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Badge
                  variant={
                    z.type === 'EV' ? 'info' : z.type === 'ACCESSIBLE' ? 'available' : z.type === 'PREMIUM' ? 'warning' : 'default'
                  }
                  size="sm"
                  className="mb-1"
                >
                  {z.type}
                </Badge>
                <h3 className="font-bold text-surface-100 text-base">{z.name}</h3>
              </div>
              <button
                onClick={() => handleDeleteZone(z.id)}
                className="text-surface-500 hover:text-occupied p-1 rounded transition-colors"
                title="Delete zone"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 border-y border-surface-800 text-center">
              <div>
                <p className="text-2xs text-surface-500">Capacity</p>
                <p className="text-xs font-bold text-surface-200">{z.totalSlots} slots</p>
              </div>
              <div>
                <p className="text-2xs text-surface-500">Price Multiplier</p>
                <p className="text-xs font-bold text-available">{z.priceMultiplier}x Base</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-2xs text-surface-400">
              <span>Available: {z.availableSlots} slots</span>
              <span className="text-brand-400 font-semibold">{currentFloor?.name}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Zone Modal */}
      {addZoneModalOpen && (
        <Modal isOpen onClose={() => setAddZoneModalOpen(false)} title="Create New Zone" size="md">
          <form onSubmit={handleAddZone} className="space-y-4">
            <Input
              label="Zone Name"
              value={newZoneName}
              onChange={e => setNewZoneName(e.target.value)}
              placeholder="e.g. Zone F (Fast EV)"
              required
            />

            <Select
              label="Zone Type"
              value={newZoneType}
              onChange={e => setNewZoneType(e.target.value as ZoneType)}
              options={[
                { value: 'STANDARD', label: '🚗 STANDARD — Regular vehicle spaces' },
                { value: 'EV', label: '⚡ EV — Dedicated high-speed charging bays' },
                { value: 'ACCESSIBLE', label: '♿ ACCESSIBLE — Wide bays near entrances/elevators' },
                { value: 'PREMIUM', label: '⭐ PREMIUM — Reserved covered priority bays' },
                { value: 'MOTORCYCLE', label: '🏍️ MOTORCYCLE — Compact two-wheeler slots' },
                { value: 'COMPACT', label: '🚗 COMPACT — Small car slots' },
              ]}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Slot Count"
                value={newSlotCount}
                onChange={e => setNewSlotCount(e.target.value)}
                type="number"
                required
              />
              <Input
                label="Price Multiplier (e.g. 1.3)"
                value={newMultiplier}
                onChange={e => setNewMultiplier(e.target.value)}
                type="number"
                step="0.1"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setAddZoneModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Plus size={14} />}>
                Create Zone
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
