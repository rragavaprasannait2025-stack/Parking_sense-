import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, QrCode, MapPin, Clock, CheckCircle, XCircle, ChevronLeft } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, BookingStatusBadge, DemoBadge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { DEMO_BOOKINGS } from '@/services/demoData'
import { formatDateTime, formatDuration, formatCurrency } from '@/lib/utils'
import type { Booking } from '@/types'

function QRPassModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const qrData = JSON.stringify({
    ref: booking.bookingRef,
    slot: booking.slotCode,
    facility: booking.facilityId,
    start: booking.startTime,
    end: booking.endTime,
    status: booking.status,
  })

  return (
    <Modal isOpen onClose={onClose} title="QR Parking Pass" size="sm">
      <div className="flex flex-col items-center gap-5 py-2">
        <div className="p-4 bg-white rounded-2xl shadow-inner">
          <QRCodeSVG value={qrData} size={180} level="H" includeMargin />
        </div>

        <div className="text-center">
          <p className="text-2xl font-black font-mono text-surface-50">{booking.bookingRef}</p>
          <BookingStatusBadge status={booking.status} />
        </div>

        <div className="w-full space-y-2 text-sm">
          {[
            { label: 'Facility',   value: booking.facilityName },
            { label: 'Slot',       value: `${booking.slotCode} · Level ${booking.floor} · Zone ${booking.zone}` },
            { label: 'Entry',      value: formatDateTime(booking.startTime) },
            { label: 'Exit',       value: formatDateTime(booking.endTime) },
            { label: 'Duration',   value: formatDuration(booking.duration) },
            { label: 'Amount',     value: formatCurrency(booking.totalAmount, booking.currency) },
          ].map(r => (
            <div key={r.label} className="flex justify-between py-1 border-b border-surface-800">
              <span className="text-surface-400">{r.label}</span>
              <span className="text-surface-200 font-medium text-right max-w-[55%]">{r.value}</span>
            </div>
          ))}
        </div>

        <DemoBadge />

        <div className="text-center">
          <p className="text-xs text-surface-500">Present this QR code at the parking gate for entry.</p>
          <p className="text-xs text-surface-600 mt-1">⚡ Simulated QR — no real gate connection in demo mode.</p>
        </div>
      </div>
    </Modal>
  )
}

function BookingCard({ booking, onViewQR }: { booking: Booking; onViewQR: () => void }) {
  const isUpcoming = booking.status === 'CONFIRMED' || booking.status === 'PENDING'
  return (
    <Card>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-brand-400">{booking.bookingRef}</span>
            <BookingStatusBadge status={booking.status} />
          </div>
          <h3 className="font-semibold text-surface-100">{booking.facilityName}</h3>
          <p className="text-sm text-surface-400 mt-0.5">Slot {booking.slotCode} · Level {booking.floor} · Zone {booking.zone}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-available">{formatCurrency(booking.totalAmount, booking.currency)}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm border-t border-surface-800 pt-3">
        <div>
          <p className="text-2xs text-surface-500 uppercase tracking-wide">Entry</p>
          <p className="text-xs font-medium text-surface-300 mt-0.5">{formatDateTime(booking.startTime)}</p>
        </div>
        <div>
          <p className="text-2xs text-surface-500 uppercase tracking-wide">Duration</p>
          <p className="text-xs font-medium text-surface-300 mt-0.5">{formatDuration(booking.duration)}</p>
        </div>
        <div>
          <p className="text-2xs text-surface-500 uppercase tracking-wide">CO₂</p>
          <p className="text-xs font-medium text-eco mt-0.5">{booking.carbonKg} kg</p>
        </div>
      </div>

      {isUpcoming && (
        <div className="mt-3 flex gap-2">
          <Button variant="primary" size="sm" fullWidth leftIcon={<QrCode size={13} />} onClick={onViewQR}>
            View QR Pass
          </Button>
          <Button variant="danger" size="sm">Cancel</Button>
        </div>
      )}
    </Card>
  )
}

export default function BookingsPage() {
  const { id } = useParams()
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
    id ? DEMO_BOOKINGS.find(b => b.id === Number(id)) ?? null : null
  )
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming')

  const upcoming = DEMO_BOOKINGS.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING' || b.status === 'ACTIVE')
  const history  = DEMO_BOOKINGS.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED' || b.status === 'NO_SHOW')

  const shown = activeTab === 'upcoming' ? upcoming : history

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-50">My Bookings</h1>
        <DemoBadge />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-800">
        {[
          { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { key: 'history',  label: 'History',  count: history.length },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as 'upcoming' | 'history')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === t.key
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-surface-400 hover:text-surface-200'
            }`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === t.key ? 'bg-brand-900 text-brand-300' : 'bg-surface-800 text-surface-400'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="text-center py-16">
          <Calendar size={32} className="text-surface-700 mx-auto mb-3" />
          <p className="text-surface-400 font-medium">No {activeTab === 'upcoming' ? 'upcoming' : 'past'} bookings</p>
          {activeTab === 'upcoming' && (
            <Link to="/driver/search">
              <Button variant="primary" size="sm" className="mt-4">Find Parking</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {shown.map(b => (
            <BookingCard key={b.id} booking={b} onViewQR={() => setSelectedBooking(b)} />
          ))}
        </div>
      )}

      {selectedBooking && (
        <QRPassModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  )
}
