/**
 * ParkSense-X Demo Data Service
 * ─────────────────────────────────────────────────────────────────────────────
 * All values here are SIMULATION / DEMO DATA generated for academic demonstration.
 * They do NOT represent real sensor data or real-world measurements.
 */

import type {
  ParkingFacility, Floor, Zone, ParkingSlot,
  Booking, DemandPrediction, OccupancyDataPoint,
  NoShowPrediction, CongestionPrediction, AIRecommendation,
  OptimizationResult, DynamicPriceRecommendation, AnalyticsSummary,
  ModelMetrics, User, Notification, SimulationResult
} from '@/types'
import { generateBookingRef } from '@/lib/utils'

// ─── Facilities ───────────────────────────────────────────────────────────────

export const DEMO_FACILITIES: ParkingFacility[] = [
  {
    id: 1,
    name: 'Chennai Trade Centre Parking',
    address: '18/1 Nandambakkam, Kathipara Junction',
    city: 'Chennai',
    latitude: 13.0067,
    longitude: 80.2206,
    totalSlots: 240,
    availableSlots: 62,
    reservedSlots: 41,
    occupiedSlots: 131,
    maintenanceSlots: 6,
    occupancyRate: 72,
    floors: [],
    amenities: ['EV_CHARGING', 'COVERED', 'CCTV', 'SECURITY', 'ELEVATOR', '24_HOURS'],
    operatorId: 2,
    status: 'ACTIVE',
    pricePerHour: 60,
    currency: 'INR',
    distanceKm: 1.2,
    predictedOccupancyIn30m: 81,
    predictedOccupancyIn60m: 91,
    congestionLevel: 'MEDIUM',
    carbonScore: 74,
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Phoenix Marketcity Smart Parking',
    address: 'Velachery Tambaram Main Road, Velachery',
    city: 'Chennai',
    latitude: 12.9757,
    longitude: 80.2218,
    totalSlots: 380,
    availableSlots: 145,
    reservedSlots: 52,
    occupiedSlots: 175,
    maintenanceSlots: 8,
    occupancyRate: 48,
    floors: [],
    amenities: ['EV_CHARGING', 'COVERED', 'CCTV', 'ACCESSIBLE', 'ELEVATOR'],
    operatorId: 2,
    status: 'ACTIVE',
    pricePerHour: 40,
    currency: 'INR',
    distanceKm: 3.5,
    predictedOccupancyIn30m: 54,
    predictedOccupancyIn60m: 67,
    congestionLevel: 'LOW',
    carbonScore: 88,
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: 3,
    name: 'Express Avenue Parking',
    address: 'Whites Road, Royapettah',
    city: 'Chennai',
    latitude: 13.0569,
    longitude: 80.2590,
    totalSlots: 300,
    availableSlots: 18,
    reservedSlots: 67,
    occupiedSlots: 207,
    maintenanceSlots: 8,
    occupancyRate: 92,
    floors: [],
    amenities: ['COVERED', 'CCTV', 'SECURITY', 'ACCESSIBLE'],
    operatorId: 3,
    status: 'ACTIVE',
    pricePerHour: 50,
    currency: 'INR',
    distanceKm: 2.1,
    predictedOccupancyIn30m: 96,
    predictedOccupancyIn60m: 98,
    congestionLevel: 'CRITICAL',
    carbonScore: 42,
    createdAt: '2024-01-20T10:00:00Z',
  },
]

// ─── Slot generation ──────────────────────────────────────────────────────────

function generateSlots(zoneId: number, facilityId: number, zoneCode: string, floor: number, count: number, evCount = 2, accessCount = 1): ParkingSlot[] {
  const statuses: ParkingSlot['status'][] = ['AVAILABLE', 'OCCUPIED', 'RESERVED', 'AVAILABLE', 'AVAILABLE', 'OCCUPIED', 'AVAILABLE', 'OCCUPIED']
  return Array.from({ length: count }, (_, i) => {
    const num = String(i + 1).padStart(2, '0')
    const isEv = i < evCount
    const isAccessible = i === evCount
    const status: ParkingSlot['status'] = i === count - 1 ? 'MAINTENANCE' : statuses[i % statuses.length]
    return {
      id: zoneId * 100 + i + 1,
      zoneId,
      facilityId,
      slotCode: `${zoneCode}${num}`,
      status,
      type: isEv ? 'EV' : isAccessible ? 'ACCESSIBLE' : 'STANDARD',
      floor,
      zone: zoneCode,
      pricePerHour: isEv ? 80 : isAccessible ? 50 : 60,
      hasEvCharger: isEv,
      isAccessible,
      isCovered: true,
      nearEntrance: i < 3,
      nearElevator: i < 2,
      suitabilityScore: Math.floor(70 + Math.random() * 30),
      lastUpdated: new Date().toISOString(),
    }
  })
}

// ─── Floors/Zones for facility 1 ─────────────────────────────────────────────

const zoneA: Zone = {
  id: 1, floorId: 1, name: 'Zone A', type: 'STANDARD',
  slots: generateSlots(1, 1, 'A', 1, 8),
  totalSlots: 8, availableSlots: 3, priceMultiplier: 1,
}
const zoneB: Zone = {
  id: 2, floorId: 1, name: 'Zone B', type: 'STANDARD',
  slots: generateSlots(2, 1, 'B', 1, 8),
  totalSlots: 8, availableSlots: 2, priceMultiplier: 1,
}
const zoneC: Zone = {
  id: 3, floorId: 1, name: 'Zone C (EV)', type: 'EV',
  slots: generateSlots(3, 1, 'C', 1, 6, 6, 0),
  totalSlots: 6, availableSlots: 2, priceMultiplier: 1.3,
}
const floor1: Floor = {
  id: 1, facilityId: 1, level: 1, name: 'Level 1 (Ground)',
  zones: [zoneA, zoneB, zoneC], totalSlots: 22, availableSlots: 7,
}
const zoneD: Zone = {
  id: 4, floorId: 2, name: 'Zone D', type: 'STANDARD',
  slots: generateSlots(4, 1, 'D', 2, 8),
  totalSlots: 8, availableSlots: 4, priceMultiplier: 1,
}
const zoneE: Zone = {
  id: 5, floorId: 2, name: 'Zone E (Premium)', type: 'PREMIUM',
  slots: generateSlots(5, 1, 'E', 2, 6),
  totalSlots: 6, availableSlots: 1, priceMultiplier: 1.5,
}
const floor2: Floor = {
  id: 2, facilityId: 1, level: 2, name: 'Level 2',
  zones: [zoneD, zoneE], totalSlots: 14, availableSlots: 5,
}

DEMO_FACILITIES[0].floors = [floor1, floor2]

// ─── Occupancy time series ────────────────────────────────────────────────────

export function generateOccupancyTimeSeries(hours = 24): OccupancyDataPoint[] {
  const now = Date.now()
  const points: OccupancyDataPoint[] = []
  // typical parking demand curve
  const basePattern = [15, 12, 10, 9, 10, 18, 35, 55, 72, 80, 82, 78, 70, 65, 68, 75, 85, 88, 82, 72, 58, 42, 28, 20]
  for (let i = 0; i < hours; i++) {
    const base = basePattern[i % 24]
    const noise = (Math.random() - 0.5) * 8
    const actual = Math.min(100, Math.max(0, base + noise))
    const predNoise = (Math.random() - 0.5) * 5
    const predicted = Math.min(100, Math.max(0, base + predNoise + 2))
    points.push({
      timestamp: new Date(now - (hours - i) * 3600000).toISOString(),
      actual: parseFloat(actual.toFixed(1)),
      predicted: parseFloat(predicted.toFixed(1)),
      confidence: parseFloat((85 + Math.random() * 10).toFixed(1)),
    })
  }
  return points
}

export function generateFuturePredictions(): OccupancyDataPoint[] {
  const now = Date.now()
  const current = 72
  const points: OccupancyDataPoint[] = []
  const targets = [75, 81, 86, 91, 93, 90, 84, 76]
  for (let i = 0; i < targets.length; i++) {
    const noise = (Math.random() - 0.5) * 4
    points.push({
      timestamp: new Date(now + (i + 1) * 900000).toISOString(), // +15m each
      predicted: parseFloat(Math.min(100, Math.max(0, targets[i] + noise)).toFixed(1)),
      confidence: parseFloat((90 - i * 3).toFixed(1)),
    })
  }
  return points
}

// ─── Demand predictions ───────────────────────────────────────────────────────

export const DEMO_DEMAND_PREDICTIONS: DemandPrediction[] = [
  { facilityId: 1, timestamp: new Date(Date.now() + 900000).toISOString(),  predictedOccupancy: 77, confidence: 92, horizon: '15m', isPeakPeriod: false, dataSource: 'SIMULATED' },
  { facilityId: 1, timestamp: new Date(Date.now() + 1800000).toISOString(), predictedOccupancy: 81, confidence: 89, horizon: '30m', isPeakPeriod: false, dataSource: 'SIMULATED' },
  { facilityId: 1, timestamp: new Date(Date.now() + 3600000).toISOString(), predictedOccupancy: 91, confidence: 84, horizon: '60m', isPeakPeriod: true,  dataSource: 'SIMULATED' },
  { facilityId: 1, timestamp: new Date(Date.now() + 10800000).toISOString(),predictedOccupancy: 85, confidence: 78, horizon: '3h',  isPeakPeriod: true,  dataSource: 'SIMULATED' },
]

// ─── No-show predictions ──────────────────────────────────────────────────────

export const DEMO_NOSHOWS: NoShowPrediction[] = [
  {
    bookingId: 1001, bookingRef: 'PX2048', probability: 78, riskLevel: 'HIGH',
    factors: [
      { name: 'Previous cancellations', impact: 'NEGATIVE', weight: 0.35, description: '2 cancellations in last 30 days' },
      { name: 'Booking lead time', impact: 'NEGATIVE', weight: 0.25, description: 'Booked 3 days in advance' },
      { name: 'Historical no-show rate', impact: 'NEGATIVE', weight: 0.20, description: 'User no-show rate: 42%' },
      { name: 'Arrival pattern', impact: 'POSITIVE', weight: 0.20, description: 'Usually arrives before slot start' },
    ],
    dataSource: 'SIMULATED',
  },
  {
    bookingId: 1002, bookingRef: 'PX3071', probability: 22, riskLevel: 'LOW',
    factors: [
      { name: 'Booking lead time', impact: 'POSITIVE', weight: 0.30, description: 'Booked 2 hours in advance' },
      { name: 'Historical no-show rate', impact: 'POSITIVE', weight: 0.40, description: 'User no-show rate: 5%' },
      { name: 'Previous cancellations', impact: 'POSITIVE', weight: 0.30, description: 'No recent cancellations' },
    ],
    dataSource: 'SIMULATED',
  },
]

// ─── Congestion predictions ───────────────────────────────────────────────────

export const DEMO_CONGESTION: CongestionPrediction[] = [
  { facilityId: 1, current: 'MEDIUM', in30m: 'HIGH', in60m: 'CRITICAL', in3h: 'HIGH', dataSource: 'SIMULATED' },
  { facilityId: 2, current: 'LOW',    in30m: 'LOW',  in60m: 'MEDIUM',  in3h: 'MEDIUM', dataSource: 'SIMULATED' },
  { facilityId: 3, current: 'CRITICAL', in30m: 'CRITICAL', in60m: 'CRITICAL', in3h: 'HIGH', dataSource: 'SIMULATED' },
]

// ─── AI Recommendation ────────────────────────────────────────────────────────

export const DEMO_RECOMMENDATION: AIRecommendation = {
  slot: { ...zoneB.slots[3], slotCode: 'B24', suitabilityScore: 94 },
  facilityName: 'Chennai Trade Centre Parking',
  suitabilityScore: 94,
  factors: [
    { name: 'Availability',     score: 96, weight: 0.25, icon: '🅿️', description: 'High probability of slot availability' },
    { name: 'Distance',         score: 91, weight: 0.20, icon: '📍', description: '120m from destination entrance' },
    { name: 'Price',            score: 88, weight: 0.20, icon: '💰', description: '₹60/hr — below zone average' },
    { name: 'Congestion',       score: 92, weight: 0.15, icon: '🚦', description: 'Low congestion in Zone B' },
    { name: 'Walking distance', score: 94, weight: 0.10, icon: '🚶', description: '45m walk to elevator' },
    { name: 'Carbon impact',    score: 90, weight: 0.10, icon: '🌱', description: 'Optimal route — 0.8 kg CO₂' },
  ],
  explanation: 'B24 is recommended because it provides the best balance between availability (96%), walking distance (120m), price (₹60/hr), and congestion level based on your Balanced preference. The slot is near the elevator on Level 1, and Zone B has historically lower no-show rates.',
  optimizationMode: 'balanced',
  dataSource: 'SIMULATED',
}

// ─── Dynamic Pricing ──────────────────────────────────────────────────────────

export const DEMO_PRICING: DynamicPriceRecommendation[] = [
  {
    facilityId: 1, currentPrice: 60, recommendedPrice: 80, currency: 'INR',
    demand: 91, occupancy: 72,
    reason: 'Predicted peak demand in next 60 minutes (+42% demand expected due to Trade Centre Exhibition)',
    effectivePeriod: '14:00 – 18:00',
    dataSource: 'SIMULATED',
  },
  {
    facilityId: 2, currentPrice: 40, recommendedPrice: 35, currency: 'INR',
    demand: 48, occupancy: 48,
    reason: 'Below-average demand. Reduced price to attract drivers and improve utilization.',
    effectivePeriod: '13:00 – 16:00',
    dataSource: 'SIMULATED',
  },
]

// ─── Simulation result ────────────────────────────────────────────────────────

export const DEMO_SIMULATION_RESULT: SimulationResult = {
  scenarioId: 1,
  baseline: { occupancyRate: 72, availableSlots: 62, congestionLevel: 'MEDIUM', revenue: 18400, searchTimeMinutes: 4.2, avgPricePerHour: 60, carbonKg: 124 },
  simulated: { occupancyRate: 86, availableSlots: 28, congestionLevel: 'HIGH',  revenue: 19100, searchTimeMinutes: 7.8, avgPricePerHour: 60, carbonKg: 148 },
  optimized: { occupancyRate: 79, availableSlots: 44, congestionLevel: 'MEDIUM',revenue: 21200, searchTimeMinutes: 5.1, avgPricePerHour: 76, carbonKg: 131 },
  impact: {
    occupancyChange: 14,
    revenueChange: 2800,
    congestionChange: 'MEDIUM → HIGH (without optimization)',
    searchTimeChange: 3.6,
    carbonChange: 24,
    recommendations: [
      'Redirect 18 vehicles from Zone A to Zone D & E on Level 2',
      'Increase price in Zone A to ₹90/hr to manage demand',
      'Open overflow parking on Level 3 (currently closed)',
      'Issue congestion alert to drivers within 500m radius',
    ],
  },
  computedAt: new Date().toISOString(),
  dataSource: 'SIMULATED',
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export const DEMO_ANALYTICS: AnalyticsSummary = {
  period: 'Last 30 days',
  totalRevenue: 824000,
  totalBookings: 6241,
  avgOccupancy: 68,
  avgDuration: 142,
  cancellationRate: 8.4,
  noShowRate: 12.1,
  utilization: 71,
  carbonSaved: 2840,
  dataSource: 'SIMULATED',
}

// ─── Model metrics ────────────────────────────────────────────────────────────

export const DEMO_MODEL_METRICS: ModelMetrics[] = [
  {
    modelName: 'XGBoost Demand Predictor',
    task: 'Occupancy Demand Prediction',
    mae: 3.24, rmse: 4.81, mape: 4.2,
    lastTrained: '2026-08-20T08:00:00Z',
    dataPoints: 42000,
    status: 'HEALTHY',
    driftScore: 12,
  },
  {
    modelName: 'LSTM Sequence Model',
    task: 'Short-term Occupancy Prediction',
    mae: 2.91, rmse: 4.12, mape: 3.7,
    lastTrained: '2026-08-18T10:30:00Z',
    dataPoints: 38000,
    status: 'HEALTHY',
    driftScore: 18,
  },
  {
    modelName: 'Random Forest No-Show',
    task: 'No-Show Probability Classification',
    mae: 0, rmse: 0, mape: 0,
    accuracy: 87.4, precision: 84.1, recall: 81.2, f1: 82.6,
    lastTrained: '2026-08-15T14:00:00Z',
    dataPoints: 15200,
    status: 'HEALTHY',
    driftScore: 24,
  },
  {
    modelName: 'Linear Regression (Baseline)',
    task: 'Occupancy Demand Prediction',
    mae: 8.42, rmse: 11.34, mape: 11.8,
    lastTrained: '2026-08-01T08:00:00Z',
    dataPoints: 42000,
    status: 'DEGRADED',
    driftScore: 62,
  },
]

// ─── Users (demo) ─────────────────────────────────────────────────────────────

export const DEMO_USERS: User[] = [
  { id: 1, name: 'Arjun Krishnamurthy', email: 'arjun@example.com', role: 'DRIVER', phone: '+91 98412 34567', createdAt: '2025-06-10T10:00:00Z', preferences: { optimizationMode: 'balanced', evOnly: false, accessibleOnly: false, maxWalkDistance: 500, notificationsEnabled: true } },
  { id: 2, name: 'Priya Venkataraman',  email: 'priya@example.com', role: 'OPERATOR', phone: '+91 98765 12345', createdAt: '2025-01-15T10:00:00Z' },
  { id: 3, name: 'Rajan Subramaniam',   email: 'rajan@example.com', role: 'ADMIN',    phone: '+91 94433 56789', createdAt: '2024-12-01T10:00:00Z' },
  { id: 4, name: 'Divya Nair',          email: 'divya@example.com', role: 'DRIVER',   phone: '+91 99001 23456', createdAt: '2025-09-05T10:00:00Z', preferences: { optimizationMode: 'greenest', evOnly: true, accessibleOnly: false, maxWalkDistance: 300, notificationsEnabled: true } },
]

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const DEMO_BOOKINGS: Booking[] = [
  {
    id: 1001, bookingRef: 'PX2048', userId: 1, facilityId: 1, facilityName: 'Chennai Trade Centre Parking',
    slotId: 204, slotCode: 'B24', floor: 1, zone: 'B',
    startTime: new Date(Date.now() + 3600000).toISOString(),
    endTime: new Date(Date.now() + 10800000).toISOString(),
    duration: 120, status: 'CONFIRMED', totalAmount: 120, currency: 'INR',
    noShowProbability: 78, createdAt: new Date(Date.now() - 7200000).toISOString(), carbonKg: 0.8,
  },
  {
    id: 1002, bookingRef: 'PX3071', userId: 1, facilityId: 2, facilityName: 'Phoenix Marketcity Smart Parking',
    slotId: 312, slotCode: 'D06', floor: 1, zone: 'D',
    startTime: new Date(Date.now() - 86400000).toISOString(),
    endTime: new Date(Date.now() - 79200000).toISOString(),
    duration: 120, status: 'COMPLETED', totalAmount: 80, currency: 'INR',
    noShowProbability: 22, createdAt: new Date(Date.now() - 172800000).toISOString(),
    checkInTime: new Date(Date.now() - 86700000).toISOString(),
    checkOutTime: new Date(Date.now() - 79200000).toISOString(),
    carbonKg: 1.1,
  },
]

// ─── Notifications ────────────────────────────────────────────────────────────

export const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 1, userId: 1, type: 'BOOKING_CONFIRMED', title: 'Booking Confirmed', message: 'Your booking PX2048 at Chennai Trade Centre Parking is confirmed for slot B24.', isRead: false, priority: 'HIGH', createdAt: new Date(Date.now() - 7200000).toISOString(), actionUrl: '/driver/bookings/1001' },
  { id: 2, userId: 1, type: 'PREDICTION_ALERT',  title: 'Congestion Alert',  message: 'Chennai Trade Centre Parking is predicted to reach 91% occupancy in 60 minutes. Consider arriving early.', isRead: false, priority: 'MEDIUM', createdAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 3, userId: 1, type: 'BOOKING_REMINDER',  title: 'Parking Reminder',  message: 'Your booking PX2048 starts in 1 hour at slot B24, Level 1.', isRead: true, priority: 'LOW', createdAt: new Date(Date.now() - 900000).toISOString() },
]

// ─── Revenue chart data ───────────────────────────────────────────────────────

export function generateRevenueData(days = 30) {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date(Date.now() - (days - i) * 86400000)
    const base = 25000 + Math.sin(i / 7) * 5000
    return {
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(base + (Math.random() - 0.5) * 4000),
      bookings: Math.floor(180 + (Math.random() - 0.5) * 40),
    }
  })
}

export function generateWeeklyOccupancy() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const pattern = [61, 65, 68, 72, 82, 91, 78]
  return days.map((day, i) => ({
    day,
    occupancy: pattern[i] + Math.floor((Math.random() - 0.5) * 6),
  }))
}

export function generateHourlyPattern() {
  const pattern = [12, 10, 8, 8, 11, 22, 42, 62, 75, 80, 82, 79, 72, 67, 70, 76, 82, 88, 85, 74, 58, 40, 26, 16]
  return pattern.map((v, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    occupancy: v + Math.floor((Math.random() - 0.5) * 6),
  }))
}
