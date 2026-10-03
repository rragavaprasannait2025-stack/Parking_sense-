import { useState } from 'react'
import {
  Calendar, Search, Filter, CheckCircle, Clock, AlertTriangle,
  QrCode, User, Car, XCircle, ArrowRight, Eye, RefreshCw
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge, BookingStatusBadge, DemoBadge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { DEMO_BOOKINGS, DEMO_FACILITIES } from '@/services/demoData'
import { formatDateTime, formatCurrency, formatDuration } from '@/lib/utils'
import type { Booking, BookingStatus } from '@/types'
import toast from 'react-hot-toast'

export default function OperatorReservationsPage() {
  const [bookings, setBookings] = useState<Booking[]>(DEMO_BOOKINGS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [facilityFilter, setFacilityFilter] = useState<string>('ALL')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)

  const filtered = bookings.filter(b => {
    if (search && !b.bookingRef.toLowerCase().includes(search.toLowerCase()) && !b.slotCode.toLowerCase().includes(search.toLowerCase()) && !b.facilityName.toLowerCase().includes(search.toLowerCase())) return false
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false
    if (facilityFilter !== 'ALL' && String(b.facilityId) !== facilityFilter) return false
    return true
  })

  const handleSimulateCheckIn = (bookingId: number) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'ACTIVE',
          checkInTime: new Date().toISOString(),
        }
      }
      return b
    }))
    toast.success('Simulated Gate Check-In: Vehicle admitted and slot marked OCCUPIED!')
  }

  const handleSimulateCheckOut = (bookingId: number) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'COMPLETED',
          checkOutTime: new Date().toISOString(),
        }
      }
      return b
    }))
    toast.success('Simulated Gate Check-Out: Vehicle exited and slot marked AVAILABLE!')
  }

  const handleMarkNoShow = (bookingId: number) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'NO_SHOW',
        }
      }
      return b
    }))
    toast.error('Reservation marked as NO-SHOW. Slot released back to available pool.')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Calendar size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">Reservation Management</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Real-time booking ledger, gate admittance simulation, and no-show enforcement
          </p>
        </div>
        <DemoBadge />
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 space-y-3">
        <div className="grid sm:grid-cols-3 gap-3">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Booking Ref, Slot code, Facility…"
            leftIcon={<Search size={14} />}
          />

          <Select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'CONFIRMED', label: 'Confirmed (Awaiting Entry)' },
              { value: 'ACTIVE', label: 'Active (Parked Inside)' },
              { value: 'COMPLETED', label: 'Completed (Exited)' },
              { value: 'CANCELLED', label: 'Cancelled' },
              { value: 'NO_SHOW', label: 'No-Show' },
            ]}
          />

          <Select
            value={facilityFilter}
            onChange={e => setFacilityFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Facilities' },
              ...DEMO_FACILITIES.map(f => ({ value: String(f.id), label: f.name })),
            ]}
          />
        </div>
      </Card>

      {/* Bookings Master Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Active &amp; Historical Bookings</CardTitle>
            <p className="text-xs text-surface-500 mt-0.5">Showing {filtered.length} reservations</p>
          </div>
          <Button
            variant="ghost"
            size="xs"
            leftIcon={<RefreshCw size={12} />}
            onClick={() => setBookings(DEMO_BOOKINGS)}
          >
            Reset Demo State
          </Button>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                {['Ref & Status', 'Facility / Slot', 'Entry - Exit', 'Duration & Amount', 'No-Show Risk', 'Operator Gate Action'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-2xs font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-b border-surface-900 hover:bg-surface-800/40 transition-colors">
                  {/* Ref & Status */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-brand-400">{b.bookingRef}</span>
                      <button
                        onClick={() => {
                          setSelectedBooking(b)
                          setQrModalOpen(true)
                        }}
                        className="text-surface-400 hover:text-brand-300"
                        title="View QR"
                      >
                        <QrCode size={13} />
                      </button>
                    </div>
                    <div className="mt-1">
                      <BookingStatusBadge status={b.status} />
                    </div>
                  </td>

                  {/* Facility & Slot */}
                  <td className="py-3 px-3">
                    <p className="font-semibold text-surface-200 text-xs">{b.facilityName}</p>
                    <p className="text-2xs text-surface-400">Slot <strong className="text-surface-100">{b.slotCode}</strong> (Level {b.floor} · Zone {b.zone})</p>
                  </td>

                  {/* Time */}
                  <td className="py-3 px-3 text-xs">
                    <p className="text-surface-300">{formatDateTime(b.startTime)}</p>
                    <p className="text-2xs text-surface-500">to {formatDateTime(b.endTime)}</p>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-3 text-xs">
                    <p className="font-bold text-available">{formatCurrency(b.totalAmount, b.currency)}</p>
                    <p className="text-2xs text-surface-500">{formatDuration(b.duration)}</p>
                  </td>

                  {/* No-show probability */}
                  <td className="py-3 px-3">
                    {b.noShowProbability ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-bold"
                          style={{ color: b.noShowProbability > 50 ? '#ef4444' : b.noShowProbability > 25 ? '#f59e0b' : '#10b981' }}
                        >
                          {b.noShowProbability}%
                        </span>
                        <div className="w-14 bg-surface-800 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${b.noShowProbability}%`,
                              backgroundColor: b.noShowProbability > 50 ? '#ef4444' : b.noShowProbability > 25 ? '#f59e0b' : '#10b981'
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-surface-500">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {b.status === 'CONFIRMED' && (
                        <>
                          <Button
                            variant="primary"
                            size="xs"
                            onClick={() => handleSimulateCheckIn(b.id)}
                            title="Simulate vehicle arrival at entry gate"
                          >
                            Gate Check-In
                          </Button>
                          <Button
                            variant="danger"
                            size="xs"
                            onClick={() => handleMarkNoShow(b.id)}
                          >
                            No-Show
                          </Button>
                        </>
                      )}

                      {b.status === 'ACTIVE' && (
                        <Button
                          variant="secondary"
                          size="xs"
                          onClick={() => handleSimulateCheckOut(b.id)}
                          title="Simulate vehicle exit at barrier"
                        >
                          Gate Check-Out
                        </Button>
                      )}

                      {b.status === 'COMPLETED' && (
                        <span className="text-2xs text-available font-semibold flex items-center gap-1">
                          <CheckCircle size={11} /> Exited Gate
                        </span>
                      )}

                      {b.status === 'NO_SHOW' && (
                        <span className="text-2xs text-occupied font-semibold flex items-center gap-1">
                          <XCircle size={11} /> Slot Released
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* QR Modal */}
      {qrModalOpen && selectedBooking && (
        <Modal isOpen onClose={() => setQrModalOpen(false)} title="Simulated QR Gate Pass" size="sm">
          <div className="flex flex-col items-center gap-4 py-2 text-center">
            <div className="p-4 bg-white rounded-2xl">
              <QRCodeSVG
                value={JSON.stringify({
                  ref: selectedBooking.bookingRef,
                  slot: selectedBooking.slotCode,
                  fac: selectedBooking.facilityId,
                  status: selectedBooking.status,
                })}
                size={180}
              />
            </div>
            <div>
              <p className="text-xl font-bold font-mono text-surface-50">{selectedBooking.bookingRef}</p>
              <p className="text-xs text-surface-400 mt-0.5">{selectedBooking.facilityName} · Slot {selectedBooking.slotCode}</p>
            </div>
            <Button variant="primary" size="sm" fullWidth onClick={() => setQrModalOpen(false)}>
              Close Pass
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
