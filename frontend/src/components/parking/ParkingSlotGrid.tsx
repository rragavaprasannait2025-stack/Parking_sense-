import { useState } from 'react'
import { Zap, Accessibility, Car, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ParkingSlot, SlotStatus, Floor } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge, SlotStatusBadge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'

function SlotIcon({ slot }: { slot: ParkingSlot }) {
  if (slot.hasEvCharger) return <Zap size={10} className="text-brand-400" />
  if (slot.isAccessible) return <Accessibility size={10} className="text-blue-400" />
  if (slot.status === 'MAINTENANCE') return <Wrench size={10} className="text-surface-500" />
  return <Car size={10} className="opacity-50" />
}

function SlotCell({ slot, onSelect, isRecommended }: { slot: ParkingSlot; onSelect: (s: ParkingSlot) => void; isRecommended?: boolean }) {
  const isInteractive = slot.status === 'AVAILABLE'

  const statusClass: Record<SlotStatus, string> = {
    AVAILABLE:   'bg-available/15 border-available/50 hover:bg-available/25 hover:border-available cursor-pointer',
    OCCUPIED:    'bg-occupied/15 border-occupied/40 cursor-not-allowed opacity-70',
    RESERVED:    'bg-reserved/15 border-reserved/40 cursor-not-allowed opacity-70',
    MAINTENANCE: 'bg-surface-800 border-surface-700 cursor-not-allowed opacity-50',
    INACTIVE:    'bg-surface-900 border-surface-800 cursor-not-allowed opacity-40',
  }

  return (
    <button
      type="button"
      onClick={() => isInteractive && onSelect(slot)}
      disabled={!isInteractive}
      title={`${slot.slotCode} — ${slot.status}`}
      className={cn(
        'relative border rounded-lg p-1.5 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 min-w-0',
        'text-2xs font-bold leading-none',
        statusClass[slot.status],
        isRecommended && 'ring-2 ring-brand-500 ring-offset-1 ring-offset-surface-900',
      )}
      aria-label={`Slot ${slot.slotCode}, ${slot.status}`}
    >
      <SlotIcon slot={slot} />
      <span className="truncate w-full text-center" style={{ fontSize: '9px' }}>{slot.slotCode}</span>
      {isRecommended && (
        <span className="absolute -top-2 -right-2 text-2xs bg-brand-600 text-white rounded-full w-4 h-4 flex items-center justify-center">★</span>
      )}
    </button>
  )
}

function SlotDetail({ slot, onClose, onBook }: { slot: ParkingSlot; onClose: () => void; onBook: (s: ParkingSlot) => void }) {
  return (
    <Modal isOpen onClose={onClose} title={`Slot ${slot.slotCode}`} size="sm"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" disabled={slot.status !== 'AVAILABLE'} onClick={() => onBook(slot)}>
            Book this Slot
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SlotStatusBadge status={slot.status} />
          <span className="text-lg font-bold text-surface-50">{formatCurrency(slot.pricePerHour, 'INR')}/hr</span>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {[
            { label: 'Level',           value: `Level ${slot.floor}` },
            { label: 'Zone',            value: `Zone ${slot.zone}` },
            { label: 'Type',            value: slot.type },
            { label: 'EV Charging',     value: slot.hasEvCharger ? 'Yes' : 'No' },
            { label: 'Accessible',      value: slot.isAccessible ? 'Yes' : 'No' },
            { label: 'Near Entrance',   value: slot.nearEntrance ? 'Yes' : 'No' },
            { label: 'Near Elevator',   value: slot.nearElevator ? 'Yes' : 'No' },
            { label: 'Covered',         value: slot.isCovered ? 'Yes' : 'No' },
          ].map(r => (
            <div key={r.label}>
              <p className="text-2xs text-surface-500 uppercase tracking-wide">{r.label}</p>
              <p className="text-sm font-medium text-surface-200 mt-0.5">{r.value}</p>
            </div>
          ))}
        </div>
        {slot.suitabilityScore !== undefined && (
          <div className="bg-brand-900/30 border border-brand-800/30 rounded-lg p-3">
            <p className="text-xs text-brand-300 font-semibold">AI Suitability Score: {slot.suitabilityScore}/100</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

interface ParkingSlotGridProps {
  floors: Floor[]
  recommendedSlotId?: number
  onSlotBook?: (slot: ParkingSlot) => void
}

export function ParkingSlotGrid({ floors, recommendedSlotId, onSlotBook }: ParkingSlotGridProps) {
  const [selectedFloor, setSelectedFloor] = useState(floors[0]?.id)
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null)

  const floor = floors.find(f => f.id === selectedFloor)
  if (!floor) return null

  const handleBook = (slot: ParkingSlot) => {
    setSelectedSlot(null)
    onSlotBook?.(slot)
  }

  const legend = [
    { status: 'AVAILABLE',   color: 'bg-available/15 border-available/50', label: 'Available' },
    { status: 'OCCUPIED',    color: 'bg-occupied/15  border-occupied/40',  label: 'Occupied' },
    { status: 'RESERVED',    color: 'bg-reserved/15  border-reserved/40',  label: 'Reserved' },
    { status: 'MAINTENANCE', color: 'bg-surface-800  border-surface-700',  label: 'Maintenance' },
  ]

  return (
    <div className="space-y-4">
      {/* Floor tabs */}
      {floors.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {floors.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFloor(f.id)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex-shrink-0',
                selectedFloor === f.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-800 text-surface-400 hover:text-surface-200',
              )}
            >
              {f.name}
              <span className="ml-1.5 text-xs opacity-70">({f.availableSlots} free)</span>
            </button>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {legend.map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`w-4 h-4 rounded border ${l.color}`} />
            <span className="text-xs text-surface-400">{l.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded border bg-available/15 border-available/50 ring-1 ring-brand-500" />
          <span className="text-xs text-surface-400">Recommended</span>
        </div>
      </div>

      {/* Zones */}
      <div className="space-y-4">
        {floor.zones.map(zone => (
          <div key={zone.id}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-surface-300 uppercase tracking-wide">{zone.name}</span>
              <Badge variant={zone.availableSlots > 0 ? 'available' : 'occupied'} size="sm">
                {zone.availableSlots}/{zone.totalSlots}
              </Badge>
              {zone.type !== 'STANDARD' && <Badge variant="info" size="sm">{zone.type}</Badge>}
            </div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(48px, 1fr))' }}>
              {zone.slots.map(slot => (
                <SlotCell
                  key={slot.id}
                  slot={slot}
                  onSelect={setSelectedSlot}
                  isRecommended={slot.id === recommendedSlotId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Slot detail modal */}
      {selectedSlot && (
        <SlotDetail slot={selectedSlot} onClose={() => setSelectedSlot(null)} onBook={handleBook} />
      )}
    </div>
  )
}

