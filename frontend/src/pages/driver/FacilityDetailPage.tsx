import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin, TrendingUp, DollarSign, Zap, Accessibility, Shield,
  Camera, Clock, Leaf, ChevronLeft, Calendar, Brain, Activity
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge, CongestionBadge, DemoBadge } from '@/components/ui/Badge'
import { ProgressBar, OccupancyGauge } from '@/components/ui/ProgressBar'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'
import { ParkingSlotGrid } from '@/components/parking/ParkingSlotGrid'
import { BookingModal } from '@/components/booking/BookingModal'
import { DEMO_FACILITIES, DEMO_DEMAND_PREDICTIONS } from '@/services/demoData'
import { formatCurrency } from '@/lib/utils'
import type { ParkingSlot } from '@/types'

const AMENITY_ICONS: Record<string, { icon: React.ReactNode; label: string }> = {
  EV_CHARGING: { icon: <Zap size={14} />,       label: 'EV Charging' },
  ACCESSIBLE:  { icon: <Accessibility size={14} />, label: 'Accessible' },
  COVERED:     { icon: <Shield size={14} />,     label: 'Covered' },
  CCTV:        { icon: <Camera size={14} />,     label: 'CCTV' },
  SECURITY:    { icon: <Shield size={14} />,     label: 'Security' },
  ELEVATOR:    { icon: <Activity size={14} />,   label: 'Elevator' },
  '24_HOURS':  { icon: <Clock size={14} />,      label: '24 Hours' },
}

export default function FacilityDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)

  const facility = DEMO_FACILITIES.find(f => f.id === Number(id))
  if (!facility) return (
    <div className="flex flex-col items-center justify-center min-h-64 text-center">
      <p className="text-surface-400 font-medium">Facility not found</p>
      <Link to="/driver/search"><Button variant="ghost" size="sm" className="mt-3">← Back to search</Button></Link>
    </div>
  )

  const preds = DEMO_DEMAND_PREDICTIONS.filter(p => p.facilityId === facility.id)

  const handleSlotSelect = (slot: ParkingSlot) => {
    setSelectedSlot(slot)
    setBookingOpen(true)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Back */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-surface-400 hover:text-surface-200 transition-colors">
          <ChevronLeft size={16} /> Back
        </button>
        <DemoBadge />
      </div>

      {/* Facility header */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h1 className="text-2xl font-bold text-surface-50">{facility.name}</h1>
                <p className="text-surface-400 mt-1 flex items-center gap-1">
                  <MapPin size={13} /> {facility.address}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {facility.amenities.map(a => AMENITY_ICONS[a] && (
                    <Badge key={a} variant="default" size="sm">
                      {AMENITY_ICONS[a].icon} {AMENITY_ICONS[a].label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <OccupancyGauge value={facility.occupancyRate} />
                <p className="text-xs text-surface-400 mt-1">Occupancy</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Available',    value: facility.availableSlots,     color: 'text-available' },
                { label: 'Reserved',     value: facility.reservedSlots,      color: 'text-reserved' },
                { label: 'Occupied',     value: facility.occupiedSlots,      color: 'text-occupied' },
                { label: 'Maintenance',  value: facility.maintenanceSlots,   color: 'text-surface-400' },
              ].map(s => (
                <div key={s.label} className="bg-surface-800/50 rounded-lg p-3 text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Congestion + price */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-surface-800">
              <div>
                <p className="text-xs text-surface-500">Congestion</p>
                <CongestionBadge level={facility.congestionLevel} />
              </div>
              <div>
                <p className="text-xs text-surface-500">Base price</p>
                <p className="font-bold text-surface-100">{formatCurrency(facility.pricePerHour, 'INR')}/hr</p>
              </div>
              <div>
                <p className="text-xs text-surface-500">Distance</p>
                <p className="font-bold text-surface-100">{facility.distanceKm} km</p>
              </div>
              <div className="ml-auto">
                <Button
                  variant="primary" size="sm"
                  leftIcon={<Calendar size={14} />}
                  onClick={() => { setSelectedSlot(null); setBookingOpen(true) }}
                >
                  Book Now
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Predictions */}
        <div className="space-y-3">
          <Card>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3">Demand Forecast</p>
            <div className="space-y-2">
              {preds.map(p => (
                <div key={p.horizon} className="flex items-center justify-between">
                  <span className="text-xs text-surface-400">In {p.horizon}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <ProgressBar value={p.predictedOccupancy} occupancyColor size="xs" />
                    </div>
                    <span className="text-xs font-semibold w-8 text-right" style={{ color: p.predictedOccupancy > 85 ? '#ef4444' : '#f59e0b' }}>
                      {p.predictedOccupancy}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-2xs text-surface-600 mt-3">⚡ SIMULATION DATA</p>
          </Card>

          <Card>
            <p className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3">Sustainability</p>
            <div className="flex items-center gap-2">
              <Leaf size={16} className="text-eco" />
              <div>
                <p className="text-sm font-bold text-eco">{facility.carbonScore}/100</p>
                <p className="text-xs text-surface-400">Eco score</p>
              </div>
            </div>
            <p className="text-xs text-surface-500 mt-2 leading-relaxed">
              Optimizing for Greenest mode could save ~0.8 kg CO₂ per trip to this facility.
            </p>
          </Card>
        </div>
      </div>

      {/* Tabs: Parking map, Floors */}
      <Tabs defaultTab="map">
        <TabList>
          <Tab value="map" icon={<Activity size={14} />}>Parking Map</Tab>
          <Tab value="predict" icon={<TrendingUp size={14} />}>Prediction</Tab>
          <Tab value="ai" icon={<Brain size={14} />}>AI Recommend</Tab>
        </TabList>

        <TabPanel value="map" className="mt-5">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-surface-100">Live Slot View</h3>
                <p className="text-xs text-surface-400 mt-0.5">Click an available slot to book it</p>
              </div>
              <DemoBadge />
            </div>
            {facility.floors.length > 0 ? (
              <ParkingSlotGrid
                floors={facility.floors}
                recommendedSlotId={204}
                onSlotBook={handleSlotSelect}
              />
            ) : (
              <p className="text-surface-400 text-sm text-center py-8">No floor data available.</p>
            )}
          </Card>
        </TabPanel>

        <TabPanel value="predict" className="mt-5">
          <Card>
            <h3 className="font-bold text-surface-100 mb-4">Occupancy Forecast</h3>
            <div className="space-y-3">
              {preds.map(p => (
                <div key={p.horizon} className="flex items-center gap-4">
                  <span className="text-sm text-surface-400 w-16">In {p.horizon}</span>
                  <div className="flex-1">
                    <ProgressBar value={p.predictedOccupancy} occupancyColor showValue label="" size="md" />
                  </div>
                  <div className="text-xs text-surface-400 w-28 text-right">
                    Confidence: {p.confidence}%
                    {p.isPeakPeriod && <Badge variant="warning" size="sm" className="ml-1">Peak</Badge>}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-surface-800/50 rounded-lg">
              <p className="text-xs text-surface-400 leading-relaxed">
                Predictions generated by XGBoost demand model trained on historical occupancy data. 
                Confidence decreases for longer horizons.
              </p>
            </div>
          </Card>
        </TabPanel>

        <TabPanel value="ai" className="mt-5">
          <Link to="/driver/recommend">
            <Card hover className="flex items-center gap-4 p-5">
              <div className="w-12 h-12 rounded-xl bg-brand-900/50 border border-brand-700/40 flex items-center justify-center">
                <Brain size={22} className="text-brand-400" />
              </div>
              <div>
                <h3 className="font-bold text-surface-100">Get AI Slot Recommendation</h3>
                <p className="text-sm text-surface-400 mt-1">Let the multi-objective optimizer find your best slot at this facility.</p>
              </div>
              <ChevronLeft size={16} className="text-surface-600 rotate-180 ml-auto" />
            </Card>
          </Link>
        </TabPanel>
      </Tabs>

      {/* Booking modal */}
      {bookingOpen && (
        <BookingModal
          facility={facility}
          preselectedSlot={selectedSlot}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </div>
  )
}

