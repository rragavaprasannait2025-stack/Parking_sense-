import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Navigation, Zap, Accessibility, ChevronRight, DollarSign, Leaf, Layers } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge, CongestionBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { formatCurrency, getOccupancyColor } from '@/lib/utils'
import type { ParkingFacility } from '@/types'

interface InteractiveParkingMapProps {
  facilities: ParkingFacility[]
  onSelectFacility?: (facility: ParkingFacility) => void
}

export function InteractiveParkingMap({ facilities, onSelectFacility }: InteractiveParkingMapProps) {
  const [selectedId, setSelectedId] = useState<number>(facilities[0]?.id ?? 1)
  const [mapLayer, setMapLayer] = useState<'standard' | 'traffic' | 'satellite'>('standard')

  const selectedFacility = facilities.find(f => f.id === selectedId) ?? facilities[0]

  // Map pin positions mapped across Chennai coordinate bounds (normalized for canvas 800x450)
  // Min lat: 12.95, Max lat: 13.08 | Min lng: 80.18, Max lng: 80.28
  const getPinCoords = (f: ParkingFacility) => {
    const minLat = 12.95, maxLat = 13.08
    const minLng = 80.18, maxLng = 80.28

    const x = ((f.longitude - minLng) / (maxLng - minLng)) * 680 + 60
    const y = 420 - ((f.latitude - minLat) / (maxLat - minLat)) * 360 - 30

    return { x: Math.max(80, Math.min(720, x)), y: Math.max(50, Math.min(380, y)) }
  }

  return (
    <div className="relative bg-surface-950 border border-surface-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Map Header & Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 flex-wrap">
        <div className="bg-surface-900/90 backdrop-blur-md border border-surface-700/80 px-3 py-1.5 rounded-xl text-xs font-semibold text-surface-200 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span>Chennai Metro Area (Live Map)</span>
        </div>
        <div className="bg-surface-900/90 backdrop-blur-md border border-surface-700/80 p-1 rounded-xl flex gap-1 shadow-lg">
          {(['standard', 'traffic', 'satellite'] as const).map(layer => (
            <button
              key={layer}
              onClick={() => setMapLayer(layer)}
              className={`px-2.5 py-1 text-2xs font-bold uppercase rounded-lg transition-all ${
                mapLayer === layer
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Interactive Map Grid */}
      <div className="w-full h-[460px] relative overflow-hidden bg-gradient-to-b from-surface-950 via-surface-900/80 to-surface-950 select-none">
        <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Background Grid Pattern */}
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.75" strokeOpacity="0.4" />
            </pattern>
            {/* Road network gradients */}
            <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="trafficGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Map Grid */}
          <rect width="100%" height="100%" fill="url(#mapGrid)" />

          {/* Stylized Coastal Line / Water body */}
          <path
            d="M 680 0 Q 640 180 710 320 Q 740 400 780 450 L 800 450 L 800 0 Z"
            fill="#0f172a"
            fillOpacity="0.7"
            stroke="#1e293b"
            strokeWidth="1.5"
          />
          <text x="730" y="240" fill="#334155" fontSize="11" fontWeight="700" letterSpacing="4" transform="rotate(75, 730, 240)">
            BAY OF BENGAL
          </text>

          {/* Major Arterial Roads / Expressways */}
          <path
            d="M 50 220 C 200 240, 420 180, 700 200"
            fill="none"
            stroke={mapLayer === 'traffic' ? 'url(#trafficGlow)' : 'url(#roadGlow)'}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 280 40 C 310 180, 420 300, 520 440"
            fill="none"
            stroke={mapLayer === 'traffic' ? '#10b981' : '#334155'}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M 120 380 Q 320 280 480 120 Q 560 60 660 30"
            fill="none"
            stroke={mapLayer === 'traffic' ? '#f59e0b' : '#1e293b'}
            strokeWidth="4"
            strokeDasharray={mapLayer === 'traffic' ? '6,4' : undefined}
          />

          {/* Route path from Driver (Simulated) to Selected Facility */}
          {selectedFacility && (() => {
            const dest = getPinCoords(selectedFacility)
            const startX = 140, startY = 320
            return (
              <g>
                <path
                  d={`M ${startX} ${startY} Q ${(startX + dest.x) / 2} ${Math.min(startY, dest.y) - 40} ${dest.x} ${dest.y}`}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="3.5"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
                {/* Driver Origin Marker */}
                <circle cx={startX} cy={startY} r="8" fill="#6366f1" />
                <circle cx={startX} cy={startY} r="14" fill="#6366f1" fillOpacity="0.25" className="animate-ping" />
                <text x={startX - 28} y={startY + 24} fill="#818cf8" fontSize="10" fontWeight="bold">You are here</text>
              </g>
            )
          })()}

          {/* Facility Location Pins */}
          {facilities.map(f => {
            const { x, y } = getPinCoords(f)
            const isSelected = f.id === selectedFacility?.id
            const occColor = getOccupancyColor(f.occupancyRate)

            return (
              <g
                key={f.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer transition-transform duration-200 hover:scale-110"
                onClick={() => {
                  setSelectedId(f.id)
                  onSelectFacility?.(f)
                }}
              >
                {/* Ping animation on selected pin */}
                {isSelected && (
                  <circle cx="0" cy="-24" r="22" fill={occColor} fillOpacity="0.25" className="animate-ping" />
                )}

                {/* Pin Shadow */}
                <ellipse cx="0" cy="0" rx="10" ry="4" fill="#000" fillOpacity="0.4" />

                {/* Pin Body */}
                <path
                  d="M 0 0 C -12 -12 -14 -28 0 -36 C 14 -28 12 -12 0 0 Z"
                  fill={isSelected ? '#6366f1' : '#1e293b'}
                  stroke={isSelected ? '#c7d2fe' : occColor}
                  strokeWidth={isSelected ? '2.5' : '2'}
                  filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                />

                {/* Status Dot */}
                <circle cx="0" cy="-22" r="5" fill={occColor} />

                {/* Slot Badge */}
                <rect x="-24" y="-52" width="48" height="18" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x="0" y="-40" textAnchor="middle" fill="#f8fafc" fontSize="9.5" fontWeight="bold">
                  {f.availableSlots} free
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Selected Facility Overlay Card */}
      {selectedFacility && (
        <div className="absolute bottom-4 left-4 right-4 z-20 max-w-lg mx-auto sm:mx-0 sm:left-4 sm:right-auto sm:w-96">
          <Card className="p-4 bg-surface-900/95 backdrop-blur-md border-surface-700 shadow-2xl animate-slide-up">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getOccupancyColor(selectedFacility.occupancyRate) }} />
                  <span className="text-2xs font-semibold text-surface-400 uppercase tracking-wide">
                    {selectedFacility.status} · {selectedFacility.distanceKm ?? 1.4} km away
                  </span>
                </div>
                <h3 className="font-bold text-surface-100 text-sm truncate">{selectedFacility.name}</h3>
                <p className="text-xs text-surface-400 truncate mt-0.5">{selectedFacility.address}</p>
              </div>
              <CongestionBadge level={selectedFacility.congestionLevel} />
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 py-2 border-y border-surface-800 text-center mb-3">
              <div>
                <p className="text-2xs text-surface-500">Rate</p>
                <p className="text-xs font-bold text-surface-200">{formatCurrency(selectedFacility.pricePerHour, 'INR')}/hr</p>
              </div>
              <div>
                <p className="text-2xs text-surface-500">Occupancy</p>
                <p className="text-xs font-bold" style={{ color: getOccupancyColor(selectedFacility.occupancyRate) }}>
                  {selectedFacility.occupancyRate}%
                </p>
              </div>
              <div>
                <p className="text-2xs text-surface-500">Eco Score</p>
                <p className="text-xs font-bold text-eco">{selectedFacility.carbonScore}/100</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link to={`/driver/facility/${selectedFacility.id}`} className="flex-1">
                <Button variant="primary" size="xs" fullWidth rightIcon={<ChevronRight size={13} />}>
                  View Slots & Book
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
