import { Shield, Lock, Eye, Server } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PublicFooter } from './PublicFooter'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-surface-100 flex flex-col pt-16">
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8 w-full">
        <div className="space-y-2">
          <Badge variant="info" size="md">Compliance &amp; Governance</Badge>
          <h1 className="text-3xl sm:text-4xl font-black text-surface-50">Privacy Policy</h1>
          <p className="text-surface-400 text-xs">Last updated: August 2026 · ParkSense-X Platform</p>
        </div>

        <Card className="p-6 sm:p-8 space-y-6 text-sm text-surface-300 leading-relaxed bg-surface-900 border-surface-800">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              <Shield size={16} className="text-brand-400" /> 1. Project Purpose &amp; Scope
            </h2>
            <p>
              ParkSense-X is an academic research demonstration platform designed to illustrate predictive digital twin modeling and AI-based parking allocation. In this development build, all mock telemetry and simulation data are generated synthetic records.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              <Lock size={16} className="text-available" /> 2. Data Collection &amp; Encryption
            </h2>
            <p>
              When user accounts are registered, passwords are encrypted using industry-standard BCrypt hashing (strength factor 12). Authentication utilizes stateless HMAC-SHA256 JWT tokens. No private telemetry or payment information is shared with third-party advertising networks.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              <Eye size={16} className="text-reserved" /> 3. Vehicle &amp; Location Telemetry
            </h2>
            <p>
              Simulated vehicle coordinates, arrival timestamps, and parking passes are processed solely within the platform to evaluate occupancy prediction models (XGBoost, LSTM) and calculate carbon savings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-surface-100 flex items-center gap-2">
              <Server size={16} className="text-brand-300" /> 4. Local Storage &amp; Session Management
            </h2>
            <p>
              Session tokens and user optimization weights are stored locally in the user's browser session. You may clear this data at any time via the System Settings interface.
            </p>
          </section>
        </Card>
      </div>

      <PublicFooter />
    </div>
  )
}
