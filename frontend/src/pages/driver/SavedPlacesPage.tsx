import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart, MapPin, Plus, Trash2, Calendar, Navigation,
  DollarSign, Zap, Accessibility, Star, ChevronRight
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, DemoBadge, CongestionBadge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Input'
import { BookingModal } from '@/components/booking/BookingModal'
import { DEMO_FACILITIES } from '@/services/demoData'
import { formatCurrency, getOccupancyColor } from '@/lib/utils'
import type { ParkingFacility } from '@/types'
import toast from 'react-hot-toast'

interface SavedPlace {
  id: string
  facilityId: number
  customLabel: string
  tag: 'Work' | 'Shopping' | 'Home' | 'Weekend' | 'Gym'
  preferredSlot?: string
  addedAt: string
}

const INITIAL_SAVED_PLACES: SavedPlace[] = [
  {
    id: 'sp-1',
    facilityId: 1,
    customLabel: 'Office Hub',
    tag: 'Work',
    preferredSlot: 'B24',
    addedAt: '2026-08-10',
  },
  {
    id: 'sp-2',
    facilityId: 2,
    customLabel: 'Weekend Mall',
    tag: 'Shopping',
    preferredSlot: 'A08',
    addedAt: '2026-08-14',
  },
]

export default function SavedPlacesPage() {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>(INITIAL_SAVED_PLACES)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [newFacilityId, setNewFacilityId] = useState('3')
  const [newLabel, setNewLabel] = useState('')
  const [newTag, setNewTag] = useState<'Work' | 'Shopping' | 'Home' | 'Weekend' | 'Gym'>('Weekend')

  // Booking modal
  const [bookingFacility, setBookingFacility] = useState<ParkingFacility | null>(null)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLabel.trim()) return

    const newPlace: SavedPlace = {
      id: `sp-${Date.now()}`,
      facilityId: Number(newFacilityId),
      customLabel: newLabel.trim(),
      tag: newTag,
      addedAt: new Date().toISOString().split('T')[0],
    }

    setSavedPlaces(prev => [...prev, newPlace])
    setAddModalOpen(false)
    setNewLabel('')
    toast.success('Place saved successfully!')
  }

  const handleDelete = (id: string) => {
    setSavedPlaces(prev => prev.filter(p => p.id !== id))
    toast.success('Removed from saved places')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-reserved/20 border border-reserved/30 flex items-center justify-center text-reserved">
              <Heart size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">Saved Places & Favorites</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Quick-access bookmark list for your frequent parking destinations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setAddModalOpen(true)}
          >
            Add Saved Place
          </Button>
        </div>
      </div>

      {/* Grid */}
      {savedPlaces.length === 0 ? (
        <Card className="text-center py-16">
          <Heart size={36} className="text-surface-700 mx-auto mb-3" />
          <p className="text-surface-300 font-bold text-base">No saved places yet</p>
          <p className="text-sm text-surface-500 mt-1 max-w-sm mx-auto">
            Bookmark frequent parking facilities for 1-click reservations and personalized occupancy notifications.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => setAddModalOpen(true)}
          >
            Bookmark a Facility
          </Button>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {savedPlaces.map(sp => {
            const fac = DEMO_FACILITIES.find(f => f.id === sp.facilityId)
            if (!fac) return null
            const occColor = getOccupancyColor(fac.occupancyRate)

            return (
              <Card key={sp.id} hover className="flex flex-col justify-between p-5 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="warning" size="sm">{sp.tag}</Badge>
                        <span className="text-2xs text-surface-500">Added {sp.addedAt}</span>
                      </div>
                      <h3 className="font-bold text-surface-50 text-base">{sp.customLabel}</h3>
                      <p className="text-xs text-brand-400 mt-0.5 font-semibold">{fac.name}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(sp.id)}
                      className="text-surface-500 hover:text-occupied p-1.5 rounded-lg hover:bg-surface-800 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p className="text-xs text-surface-400 flex items-center gap-1 mt-1 truncate">
                    <MapPin size={12} className="text-surface-500 flex-shrink-0" /> {fac.address}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-surface-800 text-center">
                    <div>
                      <p className="text-2xs text-surface-500">Rate</p>
                      <p className="text-xs font-bold text-surface-200">{formatCurrency(fac.pricePerHour, 'INR')}/hr</p>
                    </div>
                    <div>
                      <p className="text-2xs text-surface-500">Live Free</p>
                      <p className="text-xs font-bold" style={{ color: occColor }}>{fac.availableSlots} slots</p>
                    </div>
                    <div>
                      <p className="text-2xs text-surface-500">Distance</p>
                      <p className="text-xs font-bold text-surface-200">{fac.distanceKm} km</p>
                    </div>
                  </div>

                  {sp.preferredSlot && (
                    <div className="flex items-center justify-between text-2xs text-surface-400 px-2.5 py-1.5 bg-surface-800/60 rounded-lg">
                      <span>Preferred Slot: <strong className="text-surface-200">{sp.preferredSlot}</strong></span>
                      <span className="text-available">⚡ Quick Allocation</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Link to={`/driver/facility/${fac.id}`} className="flex-1">
                    <Button variant="outline" size="sm" fullWidth>
                      View Facility
                    </Button>
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    leftIcon={<Calendar size={13} />}
                    onClick={() => setBookingFacility(fac)}
                  >
                    1-Click Book
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add Modal */}
      {addModalOpen && (
        <Modal isOpen onClose={() => setAddModalOpen(false)} title="Bookmark a Parking Facility" size="md">
          <form onSubmit={handleAdd} className="space-y-4">
            <Select
              label="Select Parking Facility"
              value={newFacilityId}
              onChange={e => setNewFacilityId(e.target.value)}
              options={DEMO_FACILITIES.map(f => ({
                value: String(f.id),
                label: `${f.name} (${f.city}) - ₹${f.pricePerHour}/hr`,
              }))}
            />

            <Input
              label="Custom Place Name"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="e.g. My Office, Central Mall, Gym"
              required
            />

            <Select
              label="Category / Tag"
              value={newTag}
              onChange={e => setNewTag(e.target.value as any)}
              options={[
                { value: 'Work', label: '💼 Work' },
                { value: 'Shopping', label: '🛍️ Shopping' },
                { value: 'Home', label: '🏠 Home' },
                { value: 'Weekend', label: '🎉 Weekend' },
                { value: 'Gym', label: '🏋️ Gym / Fitness' },
              ]}
            />

            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="ghost" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Plus size={14} />}>
                Save Place
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Booking Modal */}
      {bookingFacility && (
        <BookingModal
          facility={bookingFacility}
          onClose={() => setBookingFacility(null)}
        />
      )}
    </div>
  )
}
