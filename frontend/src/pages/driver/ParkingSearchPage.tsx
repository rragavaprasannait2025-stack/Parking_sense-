import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Filter, MapPin, Clock, DollarSign, Zap, Accessibility,
  TrendingUp, Leaf, AlertTriangle, LayoutList, Map, ChevronRight, SlidersHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge, CongestionBadge, DemoBadge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Select } from '@/components/ui/Input'
import { DEMO_FACILITIES } from '@/services/demoData'
import { InteractiveParkingMap } from '@/components/parking/InteractiveParkingMap'
import { formatCurrency, getOccupancyColor, OPTIMIZATION_MODES } from '@/lib/utils'
import type { ParkingFacility, OptimizationMode } from '@/types'

function FacilityCard({ facility }: { facility: ParkingFacility }) {
  const occupancyColor = getOccupancyColor(facility.occupancyRate)
  const pred60 = facility.predictedOccupancyIn60m ?? 0

  return (
    <Card hover className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-900/50 border border-brand-800/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin size={16} className="text-brand-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-surface-100 truncate">{facility.name}</h3>
              <p className="text-xs text-surface-400 truncate mt-0.5">{facility.address}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs text-surface-400 flex items-center gap-1">
                  <MapPin size={10} /> {facility.distanceKm} km
                </span>
                <span className="text-xs text-surface-400 flex items-center gap-1">
                  <DollarSign size={10} /> {formatCurrency(facility.pricePerHour, 'INR')}/hr
                </span>
                {facility.amenities.includes('EV_CHARGING') && (
                  <Badge variant="info" size="sm"><Zap size={9} /> EV</Badge>
                )}
                {facility.amenities.includes('ACCESSIBLE') && (
                  <Badge variant="default" size="sm"><Accessibility size={9} /> Accessible</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-black" style={{ color: occupancyColor }}>
            {facility.availableSlots}
          </p>
          <p className="text-xs text-surface-500">slots free</p>
          <CongestionBadge level={facility.congestionLevel} />
        </div>
      </div>

      {/* Occupancy */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-surface-400">Current occupancy</span>
          <span className="font-medium" style={{ color: occupancyColor }}>{facility.occupancyRate}%</span>
        </div>
        <ProgressBar value={facility.occupancyRate} occupancyColor size="sm" />
      </div>

      {/* Prediction */}
      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-800/50 border border-surface-700/50">
        <TrendingUp size={13} className={pred60 > 85 ? 'text-occupied' : 'text-reserved'} />
        <div>
          <p className="text-xs font-semibold text-surface-300">
            60-min forecast: <span className={pred60 > 85 ? 'text-occupied' : 'text-reserved'}>{pred60}%</span>
          </p>
          {pred60 > 85 && <p className="text-xs text-surface-500 mt-0.5">⚠ Near capacity predicted — book now</p>}
        </div>
      </div>

      {/* Eco score */}
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-eco"><Leaf size={12} /> Eco score: {facility.carbonScore}/100</span>
        <Link to={`/driver/facility/${facility.id}`}>
          <Button variant="primary" size="xs" rightIcon={<ChevronRight size={12} />}>
            View &amp; Book
          </Button>
        </Link>
      </div>
    </Card>
  )
}

export default function ParkingSearchPage() {
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'list' | 'map'>('list')
  const [mode, setMode] = useState<OptimizationMode>('balanced')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ ev: false, accessible: false, covered: false, maxPrice: '' })

  const filtered = DEMO_FACILITIES.filter(f => {
    if (query && !f.name.toLowerCase().includes(query.toLowerCase()) && !f.address.toLowerCase().includes(query.toLowerCase())) return false
    if (filters.ev && !f.amenities.includes('EV_CHARGING')) return false
    if (filters.accessible && !f.amenities.includes('ACCESSIBLE')) return false
    if (filters.covered && !f.amenities.includes('COVERED')) return false
    if (filters.maxPrice && f.pricePerHour > parseInt(filters.maxPrice)) return false
    return true
  })

  // Sort by mode
  const sorted = [...filtered].sort((a, b) => {
    switch (mode) {
      case 'cheapest':  return a.pricePerHour - b.pricePerHour
      case 'closest':   return (a.distanceKm ?? 99) - (b.distanceKm ?? 99)
      case 'greenest':  return b.carbonScore - a.carbonScore
      default:          return a.occupancyRate - b.occupancyRate
    }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">Find Parking</h1>
          <p className="text-surface-400 text-sm mt-0.5">Smart search with AI-powered recommendations</p>
        </div>
        <DemoBadge />
      </div>

      {/* Search bar */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by location, facility name…"
            leftIcon={<Search size={15} />}
          />
        </div>
        <Button variant="secondary" size="md" leftIcon={<SlidersHorizontal size={14} />} onClick={() => setShowFilters(!showFilters)}>
          Filters
        </Button>
        <div className="hidden sm:flex border border-surface-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setView('list')}
            className={`p-2 ${view === 'list' ? 'bg-surface-700 text-surface-100' : 'bg-surface-900 text-surface-400 hover:bg-surface-800'}`}
            aria-label="List view"
          ><LayoutList size={16} /></button>
          <button
            onClick={() => setView('map')}
            className={`p-2 ${view === 'map' ? 'bg-surface-700 text-surface-100' : 'bg-surface-900 text-surface-400 hover:bg-surface-800'}`}
            aria-label="Map view"
          ><Map size={16} /></button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <Card className="p-4 animate-slide-down">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-semibold text-surface-400 mb-2">Amenities</p>
              <div className="space-y-2">
                {[
                  { key: 'ev', label: 'EV Charging' },
                  { key: 'accessible', label: 'Accessible' },
                  { key: 'covered', label: 'Covered' },
                ].map(f => (
                  <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters[f.key as keyof typeof filters] as boolean}
                      onChange={e => setFilters(prev => ({ ...prev, [f.key]: e.target.checked }))}
                      className="accent-brand-500"
                    />
                    <span className="text-sm text-surface-300">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-surface-400 mb-2">Max price (₹/hr)</p>
              <Input
                value={filters.maxPrice}
                onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                placeholder="e.g. 80"
                type="number"
                leftIcon={<DollarSign size={13} />}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Optimization mode */}
      <div>
        <p className="text-xs font-semibold text-surface-400 mb-2">Optimize for</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {(Object.entries(OPTIMIZATION_MODES) as [OptimizationMode, { label: string; icon: string; description: string }][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex-shrink-0 border ${
                mode === key
                  ? 'bg-brand-600 text-white border-brand-500'
                  : 'bg-surface-800 text-surface-400 border-surface-700 hover:border-surface-600'
              }`}
            >
              {val.icon} {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-xs text-surface-500 mb-3">{sorted.length} facility{sorted.length !== 1 ? 'ies' : 'y'} found · sorted by {OPTIMIZATION_MODES[mode].label.toLowerCase()}</p>

        {view === 'list' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map(f => <FacilityCard key={f.id} facility={f} />)}
          </div>
        ) : (
          <InteractiveParkingMap facilities={sorted} />
        )}

        {sorted.length === 0 && (
          <div className="text-center py-16">
            <Search size={32} className="text-surface-700 mx-auto mb-3" />
            <p className="text-surface-400 font-medium">No facilities found</p>
            <p className="text-sm text-surface-600 mt-1">Try adjusting your filters or search query.</p>
            <Button variant="ghost" size="sm" className="mt-4" onClick={() => { setQuery(''); setFilters({ ev: false, accessible: false, covered: false, maxPrice: '' }) }}>
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

