import { Link } from 'react-router-dom'
import { Users, Building2, Cpu, FileText, Settings, Sliders, Activity, BarChart2, ChevronRight, Shield } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { DemoBadge } from '@/components/ui/Badge'
import { DEMO_USERS, DEMO_FACILITIES, DEMO_MODEL_METRICS } from '@/services/demoData'

function AdminNavCard({ title, description, icon, href, color }: { title: string; description: string; icon: React.ReactNode; href: string; color: string }) {
  return (
    <Link to={href}>
      <Card hover className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-surface-100 text-sm">{title}</p>
          <p className="text-xs text-surface-400 mt-0.5 leading-relaxed">{description}</p>
        </div>
        <ChevronRight size={14} className="text-surface-600 mt-1 flex-shrink-0" />
      </Card>
    </Link>
  )
}

export default function AdminDashboard() {
  const healthyModels = DEMO_MODEL_METRICS.filter(m => m.status === 'HEALTHY').length
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-50">Admin Panel</h1>
          <p className="text-surface-400 text-sm mt-0.5">Platform management and system configuration</p>
        </div>
        <DemoBadge />
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users"      value={DEMO_USERS.length}         icon={<Users size={18} className="text-brand-400" />}    iconBg="bg-brand-900/50" />
        <StatCard title="Facilities"       value={DEMO_FACILITIES.length}    icon={<Building2 size={18} className="text-available" />} iconBg="bg-available/10" color="text-available" />
        <StatCard title="Healthy Models"   value={`${healthyModels}/${DEMO_MODEL_METRICS.length}`} icon={<Cpu size={18} className="text-reserved" />}   iconBg="bg-reserved/10" color="text-reserved" />
        <StatCard title="System Status"    value="Nominal"                   icon={<Shield size={18} className="text-available" />}  iconBg="bg-available/10" color="text-available" />
      </div>

      {/* Admin sections */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AdminNavCard title="Users"         description="Manage driver and operator accounts, roles, permissions" icon={<Users size={18} className="text-brand-400" />} href="/admin/users" color="bg-brand-900/50" />
        <AdminNavCard title="Facilities"    description="Add, edit, manage parking facilities and floors" icon={<Building2 size={18} className="text-available" />} href="/admin/facilities" color="bg-available/10" />
        <AdminNavCard title="ML Models"     description="Monitor model health, drift, accuracy and trigger retraining" icon={<Cpu size={18} className="text-reserved" />} href="/admin/ml-models" color="bg-reserved/10" />
        <AdminNavCard title="Model Evaluation" description="Compare XGBoost, LSTM, Random Forest model metrics" icon={<BarChart2 size={18} className="text-brand-300" />} href="/admin/evaluation" color="bg-brand-900/50" />
        <AdminNavCard title="Audit Logs"    description="Review all system actions and changes" icon={<FileText size={18} className="text-surface-300" />} href="/admin/audit" color="bg-surface-800" />
        <AdminNavCard title="System Settings" description="Configure platform parameters, pricing limits, alerts" icon={<Settings size={18} className="text-surface-300" />} href="/admin/settings" color="bg-surface-800" />
      </div>

      {/* Users table preview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-surface-200">Recent Users</p>
          <Link to="/admin/users" className="text-xs text-brand-400 flex items-center gap-1">All users <ChevronRight size={12} /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                {['Name', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-surface-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_USERS.map(u => (
                <tr key={u.id} className="border-b border-surface-900 hover:bg-surface-800/30">
                  <td className="py-2.5 px-3 font-medium text-surface-200">{u.name}</td>
                  <td className="py-2.5 px-3 text-surface-400">{u.email}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${u.role === 'ADMIN' ? 'bg-brand-900/60 text-brand-300' : u.role === 'OPERATOR' ? 'bg-reserved/10 text-reserved' : 'bg-surface-800 text-surface-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-surface-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
