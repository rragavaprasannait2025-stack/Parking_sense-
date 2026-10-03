import { useEffect, useRef, useState, useCallback } from 'react'
import { simulationEngine, type SimulationEvent } from '@/services/simulationEngine'
import type { WsSlotUpdate, WsOccupancyUpdate } from '@/types'

interface UseSimulationOptions {
  facilityIds: number[]
  autoStart?: boolean
  intervalMs?: number
}

export function useSimulation({ facilityIds, autoStart = false, intervalMs = 2500 }: UseSimulationOptions) {
  const [isRunning, setIsRunning] = useState(false)
  const [slotUpdates, setSlotUpdates] = useState<WsSlotUpdate[]>([])
  const [occupancyMap, setOccupancyMap] = useState<Map<number, WsOccupancyUpdate>>(new Map())
  const [eventLog, setEventLog] = useState<{ time: string; message: string; category: string }[]>([])
  const unsubRef = useRef<(() => void) | null>(null)

  const handleEvent = useCallback((ev: SimulationEvent) => {
    if (ev.type === 'SLOT_UPDATE')
      setSlotUpdates(p => [ev.payload, ...p.slice(0, 49)])
    else if (ev.type === 'OCCUPANCY_UPDATE')
      setOccupancyMap(p => { const n = new Map(p); n.set(ev.payload.facilityId, ev.payload); return n })
    else if (ev.type === 'LOG')
      setEventLog(p => [ev.payload, ...p.slice(0, 49)])
  }, [])

  const start = useCallback(() => {
    if (simulationEngine.isRunning()) return
    simulationEngine.start(facilityIds, intervalMs)
    setIsRunning(true)
  }, [facilityIds, intervalMs])

  const stop = useCallback(() => {
    simulationEngine.stop()
    setIsRunning(false)
  }, [])

  const toggle = useCallback(() => { isRunning ? stop() : start() }, [isRunning, start, stop])

  useEffect(() => {
    unsubRef.current = simulationEngine.subscribe(handleEvent)
    if (autoStart) start()
    return () => { unsubRef.current?.(); simulationEngine.stop(); setIsRunning(false) }
  }, []) // intentionally run once on mount

  return { isRunning, slotUpdates, occupancyMap, eventLog, start, stop, toggle }
}
