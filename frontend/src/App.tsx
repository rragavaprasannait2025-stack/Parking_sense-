import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { PublicLayout } from '@/layouts/PublicLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PageLoader } from '@/components/ui/Spinner'
import { useAuthStore } from '@/store/authStore'

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────

// Public
const HomePage        = lazy(() => import('@/pages/public/HomePage'))
const AboutPage       = lazy(() => import('@/pages/public/AboutPage'))
const FAQPage         = lazy(() => import('@/pages/public/FAQPage'))
const ContactPage     = lazy(() => import('@/pages/public/ContactPage'))
const PrivacyPage     = lazy(() => import('@/pages/public/PrivacyPage'))
const TermsPage       = lazy(() => import('@/pages/public/TermsPage'))

// Auth
const LoginPage       = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage    = lazy(() => import('@/pages/auth/RegisterPage'))

// Driver
const DriverDashboard   = lazy(() => import('@/pages/driver/DriverDashboard'))
const ParkingSearchPage = lazy(() => import('@/pages/driver/ParkingSearchPage'))
const FacilityDetailPage = lazy(() => import('@/pages/driver/FacilityDetailPage'))
const AIRecommendPage   = lazy(() => import('@/pages/driver/AIRecommendPage'))
const BookingsPage      = lazy(() => import('@/pages/driver/BookingsPage'))
const SavedPlacesPage   = lazy(() => import('@/pages/driver/SavedPlacesPage'))
const DriverCarbonPage  = lazy(() => import('@/pages/driver/DriverCarbonPage'))
const AIAssistantPage   = lazy(() => import('@/pages/driver/AIAssistantPage'))
const PreferencesPage   = lazy(() => import('@/pages/driver/PreferencesPage'))
const NotificationsPage = lazy(() => import('@/pages/driver/NotificationsPage'))

// Operator
const OperatorDashboard    = lazy(() => import('@/pages/operator/OperatorDashboard'))
const DigitalTwinPage      = lazy(() => import('@/pages/operator/DigitalTwinPage'))
const LiveOccupancyPage    = lazy(() => import('@/pages/operator/LiveOccupancyPage'))
const DemandForecastPage   = lazy(() => import('@/pages/operator/DemandForecastPage'))
const CongestionPage       = lazy(() => import('@/pages/operator/CongestionPage'))
const NoShowRiskPage       = lazy(() => import('@/pages/operator/NoShowRiskPage'))
const WhatIfSimulatorPage  = lazy(() => import('@/pages/operator/WhatIfSimulatorPage'))
const DynamicPricingPage   = lazy(() => import('@/pages/operator/DynamicPricingPage'))
const OptimizationPage     = lazy(() => import('@/pages/operator/OptimizationPage'))
const OperatorReservationsPage = lazy(() => import('@/pages/operator/OperatorReservationsPage'))
const OperatorFacilitiesPage   = lazy(() => import('@/pages/operator/OperatorFacilitiesPage'))
const OperatorAnalyticsPage    = lazy(() => import('@/pages/operator/OperatorAnalyticsPage'))
const SustainabilityPage   = lazy(() => import('@/pages/operator/SustainabilityPage'))

// Admin
const AdminDashboard       = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminUsersPage       = lazy(() => import('@/pages/admin/AdminUsersPage'))
const AdminOperatorsPage   = lazy(() => import('@/pages/admin/AdminOperatorsPage'))
const AdminFacilitiesPage  = lazy(() => import('@/pages/admin/AdminFacilitiesPage'))
const AdminZonesPage       = lazy(() => import('@/pages/admin/AdminZonesPage'))
const AdminPricingPage     = lazy(() => import('@/pages/admin/AdminPricingPage'))
const MLModelsPage         = lazy(() => import('@/pages/admin/MLModelsPage'))
const AdminModelEvaluationPage = lazy(() => import('@/pages/admin/AdminModelEvaluationPage'))
const AdminAuditPage       = lazy(() => import('@/pages/admin/AdminAuditPage'))
const AdminSettingsPage    = lazy(() => import('@/pages/admin/AdminSettingsPage'))

// ─── Query client ─────────────────────────────────────────────────────────────

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, retry: 1 },
  },
})

// ─── Fallback pages ───────────────────────────────────────────────────────────

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-black text-surface-800">404</p>
        <h1 className="text-2xl font-bold text-surface-100 mt-4">Page not found</h1>
        <p className="text-surface-400 mt-2">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-6 inline-block text-brand-400 hover:text-brand-300 text-sm">← Back to home</a>
      </div>
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const { initFromStorage } = useAuthStore()

  useEffect(() => {
    initFromStorage()
  }, [initFromStorage])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155', borderRadius: 10, fontSize: 13 },
            success: { iconTheme: { primary: '#10b981', secondary: '#f1f5f9' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' } },
          }}
        />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ─── Public ──────────────────────────────────────────────────── */}
            <Route element={<PublicLayout />}>
              <Route path="/"         element={<HomePage />} />
              <Route path="/about"    element={<AboutPage />} />
              <Route path="/faq"      element={<FAQPage />} />
              <Route path="/contact"  element={<ContactPage />} />
              <Route path="/privacy"  element={<PrivacyPage />} />
              <Route path="/terms"    element={<TermsPage />} />
            </Route>

            {/* ─── Auth ────────────────────────────────────────────────────── */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ─── Driver ──────────────────────────────────────────────────── */}
            <Route element={<DashboardLayout requiredRole="DRIVER" />}>
              <Route path="/driver"                    element={<DriverDashboard />} />
              <Route path="/driver/search"             element={<ParkingSearchPage />} />
              <Route path="/driver/facility/:id"       element={<FacilityDetailPage />} />
              <Route path="/driver/recommend"          element={<AIRecommendPage />} />
              <Route path="/driver/bookings"           element={<BookingsPage />} />
              <Route path="/driver/bookings/:id"       element={<BookingsPage />} />
              <Route path="/driver/history"            element={<BookingsPage />} />
              <Route path="/driver/saved"              element={<SavedPlacesPage />} />
              <Route path="/driver/carbon"             element={<DriverCarbonPage />} />
              <Route path="/driver/assistant"          element={<AIAssistantPage />} />
              <Route path="/driver/preferences"        element={<PreferencesPage />} />
              <Route path="/notifications"             element={<NotificationsPage />} />
            </Route>

            {/* ─── Operator ────────────────────────────────────────────────── */}
            <Route element={<DashboardLayout requiredRole="OPERATOR" />}>
              <Route path="/operator"                  element={<OperatorDashboard />} />
              <Route path="/operator/digital-twin"     element={<DigitalTwinPage />} />
              <Route path="/operator/occupancy"        element={<LiveOccupancyPage />} />
              <Route path="/operator/forecast"         element={<DemandForecastPage />} />
              <Route path="/operator/congestion"       element={<CongestionPage />} />
              <Route path="/operator/noshow"           element={<NoShowRiskPage />} />
              <Route path="/operator/simulator"        element={<WhatIfSimulatorPage />} />
              <Route path="/operator/pricing"          element={<DynamicPricingPage />} />
              <Route path="/operator/optimization"     element={<OptimizationPage />} />
              <Route path="/operator/reservations"     element={<OperatorReservationsPage />} />
              <Route path="/operator/facilities"       element={<OperatorFacilitiesPage />} />
              <Route path="/operator/analytics"        element={<OperatorAnalyticsPage />} />
              <Route path="/operator/sustainability"   element={<SustainabilityPage />} />
            </Route>

            {/* ─── Admin ───────────────────────────────────────────────────── */}
            <Route element={<DashboardLayout requiredRole="ADMIN" />}>
              <Route path="/admin"                     element={<AdminDashboard />} />
              <Route path="/admin/users"               element={<AdminUsersPage />} />
              <Route path="/admin/operators"           element={<AdminOperatorsPage />} />
              <Route path="/admin/facilities"          element={<AdminFacilitiesPage />} />
              <Route path="/admin/zones"               element={<AdminZonesPage />} />
              <Route path="/admin/pricing"             element={<AdminPricingPage />} />
              <Route path="/admin/ml-models"           element={<MLModelsPage />} />
              <Route path="/admin/evaluation"          element={<AdminModelEvaluationPage />} />
              <Route path="/admin/audit"               element={<AdminAuditPage />} />
              <Route path="/admin/settings"            element={<AdminSettingsPage />} />
            </Route>

            {/* ─── Fallback ────────────────────────────────────────────────── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
