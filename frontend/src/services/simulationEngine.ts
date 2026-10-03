/**
 * ParkSense-X Demo Simulation Engine
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates realistic parking events for demo/academic demonstration.
 * ⚡ SIMULATION DATA — No real IoT sensors are connected.
 */

import type { SlotStatus, ParkingSlot, WsSlotUpdate, WsOccupancyUpdate } from '@/types'

export type SimulationEvent =
  | { type: 'SLOT_UPDATE';      payload: WsSlotUpdate }
  | { type: 'OCCUPANCY_UPDATE'; payload: WsOccupancyUpdate }
  | { type: 'LOG'; payload: { time: string; message: string; category: 'entry' | 'exit' | 'reserve' | 'alert' } }
  | { type: 'DEMAND_SPIKE'; payload: { facilityId: number; increase: number; reason: string } }

type EventListener = (event: SimulationEvent) => void

interface FacilityState {
  facilityId: number
  occupancyRate: number
  availableSlots: number
  totalSlots: number
  slots: ParkingSlot[]
}

class SimulationEngine {
  private listeners: EventListener[] = []
  private intervalIds: ReturnType<typeof setInterval>[] = []
  private timeoutIds: ReturnType<typeof setTimeout>[] = []
  private states = new Map<number, FacilityState>()
  private _running = false

  subscribe(listener: EventListener) {
    this.listeners.push(listener)
    return () => { this.listeners = this.listeners.filter(l => l !== listener) }
  }

  private emit(event: SimulationEvent) {
    this.listeners.forEach(l => l(event))
  }

  registerFacility(facilityId: number, totalSlots: number, initialOccupancy: number, slots: ParkingSlot[]) {
    this.states.set(facilityId, {
      facilityId, occupancyRate: initialOccupancy, totalSlots,
      availableSlots: Math.round(totalSlots * (1 - initialOccupancy / 100)),
      slots: slots.map(s => ({ ...s })),
    })
  }

  getState(facilityId: number) { return this.states.get(facilityId) }
  isRunning() { return this._running }

  start(facilityIds: number[], intervalMs = 2500) {
    if (this._running) return
    this._running = true
    facilityIds.forEach(id => {
      const iid = setInterval(() => this.generateEvent(id), intervalMs + Math.random() * 1000)
      this.intervalIds.push(iid)
    })
    // Demand spike after 45s
    const tid = setTimeout(() => {
      if (this._running && facilityIds.length > 0) {
        this.emit({ type: 'DEMAND_SPIKE', payload: { facilityId: facilityIds[0], increase: 28, reason: 'Trade Centre Exhibition — demand surge' } })
      }
    }, 45000)
    this.timeoutIds.push(tid)
  }

  stop() {
    this._running = false
    this.intervalIds.forEach(clearInterval)
    this.timeoutIds.forEach(clearTimeout)
    this.intervalIds = []
    this.timeoutIds = []
  }

  /** Manually trigger one event (for demo step-through) */
  triggerManual(facilityId: number) { this.generateEvent(facilityId) }

  private generateEvent(facilityId: number) {
    const state = this.states.get(facilityId)
    if (!state) return
    const rand = Math.random()
    const now = new Date().toLocaleTimeString()
    if      (rand < 0.40 && state.availableSlots > 2) this.handleArrival(state, now)
    else if (rand < 0.72 && state.occupancyRate > 15)  this.handleExit(state, now)
    else if (rand < 0.88)                              this.handleReservation(state, now)
    else                                               this.handleAlert(state, now)

    this.emit({
      type: 'OCCUPANCY_UPDATE',
      payload: {
        facilityId,
        occupancyRate: parseFloat(state.occupancyRate.toFixed(1)),
        availableSlots: state.availableSlots,
        timestamp: new Date().toISOString(),
        source: 'SIMULATION',
      },
    })
  }

  private handleArrival(state: FacilityState, now: string) {
    const avail = state.slots.filter(s => s.status === 'AVAILABLE')
    if (!avail.length) return
    const slot = avail[Math.floor(Math.random() * avail.length)]
    this.mutateSlot(state, slot, 'OCCUPIED')
    state.occupancyRate = Math.min(100, state.occupancyRate + this.delta(state.totalSlots))
    state.availableSlots = Math.max(0, state.availableSlots - 1)
    this.emit({ type: 'LOG', payload: { time: now, message: `Vehicle entered — Slot ${slot.slotCode} occupied`, category: 'entry' } })
  }

  private handleExit(state: FacilityState, now: string) {
    const occ = state.slots.filter(s => s.status === 'OCCUPIED')
    if (!occ.length) return
    const slot = occ[Math.floor(Math.random() * occ.length)]
    this.mutateSlot(state, slot, 'AVAILABLE')
    state.occupancyRate = Math.max(0, state.occupancyRate - this.delta(state.totalSlots))
    state.availableSlots = Math.min(state.totalSlots, state.availableSlots + 1)
    this.emit({ type: 'LOG', payload: { time: now, message: `Vehicle exited — Slot ${slot.slotCode} released`, category: 'exit' } })
  }

  private handleReservation(state: FacilityState, now: string) {
    const avail = state.slots.filter(s => s.status === 'AVAILABLE')
    if (!avail.length) return
    const slot = avail[Math.floor(Math.random() * avail.length)]
    this.mutateSlot(state, slot, 'RESERVED')
    this.emit({ type: 'LOG', payload: { time: now, message: `Booking confirmed — Slot ${slot.slotCode} reserved`, category: 'reserve' } })
  }

  private handleAlert(state: FacilityState, now: string) {
    if (state.occupancyRate > 82) {
      this.emit({ type: 'LOG', payload: { time: now, message: `⚠ High occupancy — ${state.occupancyRate.toFixed(0)}% capacity`, category: 'alert' } })
    }
  }

  private mutateSlot(state: FacilityState, slot: ParkingSlot, status: SlotStatus) {
    const prev = slot.status
    slot.status = status
    slot.lastUpdated = new Date().toISOString()
    this.emit({ type: 'SLOT_UPDATE', payload: { slotId: slot.id, slotCode: slot.slotCode, facilityId: state.facilityId, previousStatus: prev, newStatus: status, timestamp: new Date().toISOString(), source: 'SIMULATION' } })
  }

  private delta(totalSlots: number) { return parseFloat((100 / totalSlots).toFixed(2)) }
}

export const simulationEngine = new SimulationEngine()
