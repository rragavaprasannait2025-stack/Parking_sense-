import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Clock, Brain, ChevronRight, CheckCircle, Leaf } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { ProgressBar, OccupancyGauge } from '@/components/ui/ProgressBar'
import { useAuthStore } from '@/store/authStore'
import { DEMO_RECOMMENDATION } from '@/services/demoData'
import { formatCurrency, generateBookingRef, OPTIMIZATION_MODES } from '@/lib/utils'
import toast from 'react-hot-toast'
import type { ParkingFacility, ParkingSlot, OptimizationMode, Booking } from '@/types'

type Step = 'form' | 'recommend' | 'confirm' | 'success'

interface BookingModalProps {
  facility: ParkingFacility
  preselectedSlot?: ParkingSlot | null
  onClose: () => void
}

export function BookingModal({ facility, preselectedSlot, onClose }: BookingModalProps) {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [step, setStep] = useState<Step>('form')
  const [mode, setMode] = useState<OptimizationMode>(user?.preferences?.optimizationMode ?? 'balanced')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16))
  const [duration, setDuration] = useState('120')
  const [chosenSlot, setChosenSlot] = useState<ParkingSlot | null>(preselectedSlot ?? null)
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const rec = DEMO_RECOMMENDATION
  const totalMinutes = parseInt(duration)
  const totalHours = totalMinutes / 60
  const slot = chosenSlot ?? rec.slot
  const totalAmount = slot.pricePerHour * totalHours

  const handleGetRecommendation = () => {
    if (!chosenSlot) setChosenSlot(rec.slot)
    setStep('recommend')
  }

  const handleConfirm = async () => {
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 1500)) // simulate API
    const ref = generateBookingRef()
    const newBooking: Booking = {
      id: Date.now(),
      bookingRef: ref,
      userId: user?.id ?? 1,
      facilityId: facility.id,
      facilityName: facility.name,
      slotId: slot.id,
      slotCode: slot.slotCode,
      floor: slot.floor,
      zone: slot.zone,
      startTime: startDate,
      endTime: new Date(new Date(startDate).getTime() + totalMinutes * 60000).toISOString(),
      duration: totalMinutes,
      status: 'CONFIRMED',
      totalAmount,
      currency: 'INR',
      noShowProbability: 20,
      createdAt: new Date().toISOString(),
      carbonKg: 0.8,
    }
    setBooking(newBooking)
    setIsProcessing(false)
    setStep('success')
    toast.success(`Booking ${ref} confirmed!`)
  }

  const stepTitles: Record<Step, string> = {
    form: 'Book Parking',
    recommend: 'AI Recommendation',
    confirm: 'Confirm Booking',
    success: 'Booking Confirmed!',
  }

  return (
    <Modal isOpen onClose={onClose} title={stepTitles[step]} size="md">
      {step === 'form' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-surface-800/50 rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-brand-900/50 flex items-center justify-center">
              <Calendar size={14} className="text-brand-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-surface-200">{facility.name}</p>
              <p className="text-xs text-surface-400">{facility.availableSlots} slots available now</p>
            </div>
          </div>

          {preselectedSlot && (
            <div className="p-3 bg-available/10 border border-available/20 rounded-lg">
              <p className="text-xs font-semibold text-available">Pre-selected: Slot {preselectedSlot.slotCode}</p>
              <p className="text-xs text-surface-400 mt-0.5">{formatCurrency(preselectedSlot.pricePerHour, 'INR')}/hr · Level {preselectedSlot.floor} · Zone {preselectedSlot.zone}</p>
            </div>
          )}

          <Input
            label="Entry date & time"
            type="datetime-local"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            leftIcon={<Calendar size={14} />}
          />

          <Select
            label="Duration"
            value={duration}
            onChange={e => setDuration(e.target.value)}
            options={[
              { value: '30',  label: '30 minutes' },
              { value: '60',  label: '1 hour' },
              { value: '90',  label: '1.5 hours' },
              { value: '120', label: '2 hours' },
              { value: '180', label: '3 hours' },
              { value: '240', label: '4 hours' },
              { value: '480', label: '8 hours' },
            ]}
          />

          <div>
            <p className="text-xs font-semibold text-surface-400 mb-2">Optimize for</p>
            <div className="flex gap-2 flex-wrap">
              {(Object.entries(OPTIMIZATION_MODES) as [OptimizationMode, { label: string; icon: string }][]).map(([key, val]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    mode === key ? 'bg-brand-600 border-brand-500 text-white' : 'bg-surface-800 border-surface-700 text-surface-400'
                  }`}
                >
                  {val.icon} {val.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" fullWidth onClick={onClose}>Cancel</Button>
            {preselectedSlot ? (
              <Button variant="primary" size="sm" fullWidth onClick={() => setStep('confirm')}>
                Confirm Slot {preselectedSlot.slotCode}
              </Button>
            ) : (
              <Button variant="primary" size="sm" fullWidth leftIcon={<Brain size={14} />} onClick={handleGetRecommendation}>
                Get AI Recommendation
              </Button>
            )}
          </div>
        </div>
      )}

      {step === 'recommend' && (
        <div className="space-y-4">
          <DemoBadge />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-surface-400 mb-0.5">Recommended Slot</p>
              <h2 className="text-3xl font-black text-surface-50">{rec.slot.slotCode}</h2>
              <p className="text-sm text-surface-400">{facility.name}</p>
            </div>
            <OccupancyGauge value={rec.suitabilityScore} size={72} />
          </div>

          <div className="space-y-2">
            {rec.factors.map(f => (
              <ProgressBar key={f.name} value={f.score} label={f.name} showValue size="xs" color="#6366f1" />
            ))}
          </div>

          <div className="p-3 bg-brand-900/30 border border-brand-800/40 rounded-lg">
            <p className="text-xs font-semibold text-brand-300 mb-1">Why this slot?</p>
            <p className="text-xs text-surface-300 leading-relaxed">{rec.explanation}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-eco">
            <Leaf size={12} />
            <span>Estimated carbon: 0.8 kg CO₂ · Eco score: 90/100</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" fullWidth onClick={() => setStep('form')}>← Back</Button>
            <Button variant="primary" size="sm" fullWidth onClick={() => { setChosenSlot(rec.slot); setStep('confirm') }}>
              Book Slot {rec.slot.slotCode} <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {step === 'confirm' && (
        <div className="space-y-4">
          <div className="p-4 bg-surface-800/50 rounded-xl space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Facility</span>
              <span className="text-surface-200 font-medium text-right max-w-[60%]">{facility.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Slot</span>
              <span className="text-surface-200 font-medium">{slot.slotCode} · Level {slot.floor} · Zone {slot.zone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Entry</span>
              <span className="text-surface-200 font-medium">{new Date(startDate).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Duration</span>
              <span className="text-surface-200 font-medium">{totalMinutes} min</span>
            </div>
            <div className="divider" />
            <div className="flex justify-between">
              <span className="text-surface-300 font-semibold">Total</span>
              <span className="text-available font-bold text-lg">{formatCurrency(totalAmount, 'INR')}</span>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="ghost" size="sm" fullWidth onClick={() => setStep(preselectedSlot ? 'form' : 'recommend')}>← Back</Button>
            <Button variant="primary" size="sm" fullWidth loading={isProcessing} onClick={handleConfirm}>
              Confirm & Pay
            </Button>
          </div>
        </div>
      )}

      {step === 'success' && booking && (
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-available/20 border-2 border-available mx-auto flex items-center justify-center">
            <CheckCircle size={30} className="text-available" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-surface-50">Booking Confirmed!</h3>
            <p className="text-brand-400 font-mono text-lg font-bold mt-1">{booking.bookingRef}</p>
            <p className="text-sm text-surface-400 mt-1">Slot {booking.slotCode} · {facility.name}</p>
          </div>
          <div className="p-4 bg-surface-800 rounded-xl text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Entry</span>
              <span className="text-surface-200">{new Date(booking.startTime).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Duration</span>
              <span className="text-surface-200">{booking.duration} min</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Amount</span>
              <span className="text-available font-bold">{formatCurrency(booking.totalAmount, 'INR')}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" fullWidth onClick={onClose}>Close</Button>
            <Button variant="primary" size="sm" fullWidth onClick={() => { onClose(); navigate(`/driver/bookings/${booking.id}`) }}>
              View QR Pass
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
