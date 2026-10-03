import { useState } from 'react'
import {
  Building2, Plus, MapPin, DollarSign, Layers, CheckCircle,
  Sliders, Trash2, Edit2, Shield, Save
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { DEMO_FACILITIES } from '@/services/demoData'
import { formatCurrency } from '@/lib/utils'
import type { ParkingFacility } from '@/types'
import toast from 'react-hot-toast'

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<ParkingFacility[]>(DEMO_FACILITIES)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('Chennai')
  const [slots, setSlots] = useState('200')
  const [rate, setRate] = useState('50')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !address) return

    const newFac: ParkingFacility = {
      id: Date.now(),
      name,
      address,
      city,
      latitude: 13.04,
      longitude: 80.24,
      totalSlots: Number(slots) || 200,
      availableSlots: Number(slots) || 200,
      reservedSlots: 0,
      occupiedSlots: 0,
      maintenanceSlots: 0,
      occupancyRate: 0,
      floors: [
        {
          id: Date.now() + 1,
          facilityId: Date.now(),
          level: 1,
          name: 'Ground Level',
          totalSlots: Number(slots) || 200,
          availableSlots: Number(slots) || 200,
          zones: [
            {
              id: Date.now() + 2,
              floorId: Date.now() + 1,
              name: 'Zone A',
              type: 'STANDARD',
              slots: [],
              totalSlots: Number(slots) || 200,
              availableSlots: Number(slots) || 200,
              priceMultiplier: 1.0,
            }
          ]
        }
      ],
      amenities: ['CCTV', 'SECURITY', 'EV_CHARGING', 'ACCESSIBLE'],
      operatorId: 2,
      status: 'ACTIVE',
      pricePerHour: Number(rate) || 50,
      currency: 'INR',
      distanceKm: 2.5,
      congestionLevel: 'LOW',
      carbonScore: 88,
      createdAt: new Date().toISOString(),
    }

    setFacilities(prev => [newFac, ...prev])
    setCreateModalOpen(false)
    setName('')
    setAddress('')
    toast.success(`Facility "${newFac.name}" added to ParkSense-X!`)
  }

  const handleDelete = (id: number) => {
    setFacilities(prev => prev.filter(f => f.id !== id))
    toast.success('Facility deleted')
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
            <h1 className="text-2xl font-bold text-surface-50">Facility Directory Management</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Admin console to provision new parking facilities, coordinate geo-coordinates, and configure capacity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Provision Facility
          </Button>
        </div>
      </div>

      {/* Facilities List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map(f => (
          <Card key={f.id} className="p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-2xs font-bold px-2 py-0.5 rounded-full bg-brand-900/50 text-brand-300 border border-brand-800">
                  {f.status}
                </span>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="text-surface-500 hover:text-occupied p-1 rounded transition-colors"
                  title="Delete facility"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 className="font-bold text-surface-100 text-base">{f.name}</h3>
              <p className="text-xs text-surface-400 flex items-center gap-1 mt-1 truncate">
                <MapPin size={11} className="text-surface-500" /> {f.address}, {f.city}
              </p>

              <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-surface-800 text-center">
                <div>
                  <p className="text-2xs text-surface-500">Capacity</p>
                  <p className="text-xs font-bold text-surface-200">{f.totalSlots} slots</p>
                </div>
                <div>
                  <p className="text-2xs text-surface-500">Base Price</p>
                  <p className="text-xs font-bold text-available">{formatCurrency(f.pricePerHour, 'INR')}/hr</p>
                </div>
                <div>
                  <p className="text-2xs text-surface-500">Floors</p>
                  <p className="text-xs font-bold text-surface-200">{f.floors.length}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xs text-surface-500 flex-1">Geo: {f.latitude}, {f.longitude}</span>
              <Badge variant="info" size="sm">Active Hub</Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Provision Facility Modal */}
      {createModalOpen && (
        <Modal isOpen onClose={() => setCreateModalOpen(false)} title="Provision New Parking Facility" size="md">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Facility Name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Marina Beach Multi-Level Parking"
              required
            />

            <Input
              label="Street Address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="e.g. Kamarajar Salai, Triplicane"
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Chennai"
                required
              />
              <Input
                label="Total Capacity (Slots)"
                value={slots}
                onChange={e => setSlots(e.target.value)}
                type="number"
                required
              />
            </div>

            <Input
              label="Base Price (₹/hr)"
              value={rate}
              onChange={e => setRate(e.target.value)}
              type="number"
              leftIcon={<DollarSign size={14} />}
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Plus size={14} />}>
                Provision Facility
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
