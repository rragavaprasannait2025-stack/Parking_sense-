import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export function PublicFooter() {
  return (
    <footer className="bg-surface-950 border-t border-surface-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <span className="font-black text-base text-surface-50">ParkSense<span className="text-brand-400">-X</span></span>
            </Link>
            <p className="text-xs text-surface-500 leading-relaxed">
              Predictive Digital Twin and Multi-Objective AI Framework for Intelligent Parking Allocation.
              Final-year IT project — demo build.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3">Product</h4>
            <ul className="space-y-2">
              {['Features', 'How It Works', 'For Drivers', 'For Operators', 'Pricing'].map(l => (
                <li key={l}><a href={`/#${l.toLowerCase().replace(/\s/g, '-')}`} className="text-sm text-surface-500 hover:text-surface-300 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3">Company</h4>
            <ul className="space-y-2">
              {[['About', '/about'], ['FAQ', '/faq'], ['Contact', '/contact']].map(([l, h]) => (
                <li key={l}><Link to={h} className="text-sm text-surface-500 hover:text-surface-300 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wide mb-3">Legal</h4>
            <ul className="space-y-2">
              {[['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms']].map(([l, h]) => (
                <li key={l}><Link to={h} className="text-sm text-surface-500 hover:text-surface-300 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-surface-600">© 2026 ParkSense-X. Final-year IT project — demonstration build.</p>
          <p className="text-xs text-surface-700">⚡ All ML predictions and analytics are SIMULATION / DEMO DATA</p>
        </div>
      </div>
    </footer>
  )
}
