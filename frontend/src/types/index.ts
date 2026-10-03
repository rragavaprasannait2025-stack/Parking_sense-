// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = 'DRIVER' | 'OPERATOR' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  avatarUrl?: string
  phone?: string
  createdAt: string
  preferences?: UserPreferences
}

export interface UserPreferences {
  optimizationMode: OptimizationMode
  evOnly: boolean
  accessibleOnly: boolean
  maxWalkDistance: number // metres
  notificationsEnabled: boolean
}

export type OptimizationMode = 'balanced' | 'cheapest' | 'closest' | 'fastest' | 'greenest'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  phone?: string
}

// ─── Parking Facilities ──────────────────────────────────────────────────────

export interface ParkingFacility {
  id: number
  name: string
  address: string
  city: string
  latitude: number
  longitude: number
  totalSlots: number
  availableSlots: number
  reservedSlots: number
  occupiedSlots: number
  maintenanceSlots: number
  occupancyRate: number   // 0-100
  floors: Floor[]
  amenities: FacilityAmenity[]
  operatorId: number
  status: 'ACTIVE' | 'CLOSED' | 'MAINTENANCE'
  pricePerHour: number
  currency: string
  distanceKm?: number
  predictedOccupancyIn30m?: number
  predictedOccupancyIn60m?: number
  congestionLevel: CongestionLevel
  carbonScore: number     // 0-100 higher = greener
  createdAt: string
}

export type FacilityAmenity = 'EV_CHARGING' | 'ACCESSIBLE' | 'COVERED' | 'CCTV' | 'SECURITY' | 'ELEVATOR' | '24_HOURS'
export type CongestionLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Floor {
  id: number
  facilityId: number
  level: number
  name: string
  zones: Zone[]
  totalSlots: number
  availableSlots: number
}

export interface Zone {
  id: number
  floorId: number
  name: string
  type: ZoneType
  slots: ParkingSlot[]
  totalSlots: number
  availableSlots: number
  priceMultiplier: number
}

export type ZoneType = 'STANDARD' | 'EV' | 'ACCESSIBLE' | 'PREMIUM' | 'MOTORCYCLE' | 'COMPACT'

export interface ParkingSlot {
  id: number
  zoneId: number
  facilityId: number
  slotCode: string        // e.g. "B24"
  status: SlotStatus
  type: SlotType
  floor: number
  zone: string
  pricePerHour: number
  hasEvCharger: boolean
  isAccessible: boolean
  isCovered: boolean
  nearEntrance: boolean
  nearElevator: boolean
  suitabilityScore?: number  // 0-100 from AI
  currentBookingId?: number
  lastUpdated: string
}

export type SlotStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE' | 'INACTIVE'
export type SlotType = 'STANDARD' | 'EV' | 'ACCESSIBLE' | 'PREMIUM' | 'MOTORCYCLE' | 'COMPACT'

// ─── Bookings ────────────────────────────────────────────────────────────────

export interface Booking {
  id: number
  bookingRef: string      // e.g. "PX2048"
  userId: number
  facilityId: number
  facilityName: string
  slotId: number
  slotCode: string
  floor: number
  zone: string
  startTime: string
  endTime: string
  duration: number        // minutes
  status: BookingStatus
  totalAmount: number
  currency: string
  qrCode?: string
  noShowProbability?: number
  createdAt: string
  cancelledAt?: string
  checkInTime?: string
  checkOutTime?: string
  carbonKg?: number
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW' | 'EXPIRED'

export interface BookingRequest {
  facilityId: number
  slotId?: number         // optional — AI recommends if omitted
  startTime: string
  endTime: string
  preferences: UserPreferences
}

// ─── AI / Predictions ────────────────────────────────────────────────────────

export interface DemandPrediction {
  facilityId: number
  timestamp: string
  predictedOccupancy: number    // 0-100
  confidence: number            // 0-100
  horizon: '15m' | '30m' | '60m' | '3h' | '6h' | '24h'
  isPeakPeriod: boolean
  dataSource: 'REAL' | 'SIMULATED'
}

export interface OccupancyDataPoint {
  timestamp: string
  actual?: number
  predicted: number
  confidence?: number
}

export interface NoShowPrediction {
  bookingId: number
  bookingRef: string
  probability: number     // 0-100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  factors: NoShowFactor[]
  dataSource: 'REAL' | 'SIMULATED'
}

export interface NoShowFactor {
  name: string
  impact: 'POSITIVE' | 'NEGATIVE'
  weight: number
  description: string
}

export interface CongestionPrediction {
  facilityId: number
  current: CongestionLevel
  in30m: CongestionLevel
  in60m: CongestionLevel
  in3h: CongestionLevel
  dataSource: 'REAL' | 'SIMULATED'
}

export interface AIRecommendation {
  slot: ParkingSlot
  facilityName: string
  suitabilityScore: number    // 0-100
  factors: RecommendationFactor[]
  explanation: string
  alternativeSlots?: ParkingSlot[]
  optimizationMode: OptimizationMode
  dataSource: 'REAL' | 'SIMULATED'
}

export interface RecommendationFactor {
  name: string
  score: number             // 0-100
  weight: number            // 0-1
  icon: string
  description: string
}

// ─── Optimization ────────────────────────────────────────────────────────────

export interface OptimizationResult {
  bestSlot: ParkingSlot
  suitabilityScore: number
  objectives: OptimizationObjective[]
  tradeoffs: string[]
  carbonImpact: CarbonImpact
  computedAt: string
  mode: OptimizationMode
}

export interface OptimizationObjective {
  name: string
  value: number         // 0-100
  weight: number        // 0-1
  unit: string
  direction: 'minimize' | 'maximize'
}

export interface CarbonImpact {
  distanceKm: number
  fuelLitres: number
  co2Kg: number
  co2Saved?: number
  comparedTo: string
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

export interface DynamicPriceRecommendation {
  facilityId: number
  zoneId?: number
  currentPrice: number
  recommendedPrice: number
  currency: string
  demand: number          // 0-100
  occupancy: number       // 0-100
  reason: string
  effectivePeriod: string
  dataSource: 'REAL' | 'SIMULATED'
}

// ─── Simulation ───────────────────────────────────────────────────────────────

export interface SimulationScenario {
  id?: number
  name: string
  type: ScenarioType
  facilityId: number
  parameters: Record<string, unknown>
  duration?: number       // minutes
}

export type ScenarioType =
  | 'CLOSE_ZONE'
  | 'CLOSE_ENTRANCE'
  | 'DEMAND_INCREASE'
  | 'DEMAND_DECREASE'
  | 'PRICE_CHANGE'
  | 'ADD_SLOTS'
  | 'REMOVE_SLOTS'
  | 'EVENT'
  | 'WEATHER'
  | 'CUSTOM'

export interface SimulationResult {
  scenarioId: number
  baseline: SimulationState
  simulated: SimulationState
  optimized: SimulationState
  impact: SimulationImpact
  computedAt: string
  dataSource: 'SIMULATED'
}

export interface SimulationState {
  occupancyRate: number
  availableSlots: number
  congestionLevel: CongestionLevel
  revenue: number
  searchTimeMinutes: number
  avgPricePerHour: number
  carbonKg: number
}

export interface SimulationImpact {
  occupancyChange: number
  revenueChange: number
  congestionChange: string
  searchTimeChange: number
  carbonChange: number
  recommendations: string[]
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export interface AnalyticsSummary {
  facilityId?: number
  period: string
  totalRevenue: number
  totalBookings: number
  avgOccupancy: number
  avgDuration: number
  cancellationRate: number
  noShowRate: number
  utilization: number
  carbonSaved: number
  dataSource: 'REAL' | 'SIMULATED'
}

export interface ModelMetrics {
  modelName: string
  task: string
  mae: number
  rmse: number
  mape: number
  accuracy?: number
  precision?: number
  recall?: number
  f1?: number
  lastTrained: string
  dataPoints: number
  status: 'HEALTHY' | 'DEGRADED' | 'RETRAIN_NEEDED'
  driftScore: number    // 0-100; >70 = retrain needed
}

// ─── Events ──────────────────────────────────────────────────────────────────

export interface ParkingEvent {
  id: number
  facilityId: number
  name: string
  description?: string
  startTime: string
  endTime: string
  expectedDemandIncrease: number    // percent
  location: string
  createdBy: number
}

// ─── Notifications ───────────────────────────────────────────────────────────

export interface Notification {
  id: number
  userId: number
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  createdAt: string
  actionUrl?: string
}

export type NotificationType =
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_REMINDER'
  | 'BOOKING_CANCELLED'
  | 'SLOT_AVAILABLE'
  | 'PREDICTION_ALERT'
  | 'OPERATOR_ALERT'
  | 'ANOMALY_DETECTED'
  | 'SYSTEM'

// ─── WebSocket ───────────────────────────────────────────────────────────────

export interface WsSlotUpdate {
  slotId: number
  slotCode: string
  facilityId: number
  previousStatus: SlotStatus
  newStatus: SlotStatus
  timestamp: string
  source: 'SENSOR' | 'BOOKING' | 'SIMULATION' | 'MANUAL'
}

export interface WsOccupancyUpdate {
  facilityId: number
  occupancyRate: number
  availableSlots: number
  timestamp: string
  source: 'SENSOR' | 'SIMULATION'
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: number
  userId: number
  userName: string
  action: string
  resource: string
  resourceId?: number
  details?: string
  ipAddress?: string
  timestamp: string
  result: 'SUCCESS' | 'FAILURE'
}

export interface SystemConfig {
  key: string
  value: string
  description: string
  category: string
  isEditable: boolean
  lastUpdated: string
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

export interface PagedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

export interface ApiError {
  message: string
  code?: string
  field?: string
  status: number
}

// ─── Search ──────────────────────────────────────────────────────────────────

export interface ParkingSearchParams {
  query?: string
  latitude?: number
  longitude?: number
  startTime?: string
  endTime?: string
  maxPricePerHour?: number
  maxDistanceKm?: number
  requireEv?: boolean
  requireAccessible?: boolean
  requireCovered?: boolean
  optimizationMode?: OptimizationMode
}
