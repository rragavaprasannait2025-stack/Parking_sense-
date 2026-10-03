import { useState } from 'react'
import {
  Users, Search, Plus, Shield, UserCheck, UserX,
  Edit2, Trash2, Mail, Phone, Calendar, CheckCircle
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { DEMO_USERS } from '@/services/demoData'
import type { User, UserRole } from '@/types'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(DEMO_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')

  // Create User Modal
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('DRIVER')
  const [newPhone, setNewPhone] = useState('')

  const filtered = users.filter(u => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false
    return true
  })

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName || !newEmail) return

    const newUser: User = {
      id: Date.now(),
      name: newName,
      email: newEmail,
      role: newRole,
      phone: newPhone || '+91 98000 00000',
      createdAt: new Date().toISOString(),
      preferences: {
        optimizationMode: 'balanced',
        evOnly: false,
        accessibleOnly: false,
        maxWalkDistance: 400,
        notificationsEnabled: true,
      },
    }

    setUsers(prev => [newUser, ...prev])
    setCreateModalOpen(false)
    setNewName('')
    setNewEmail('')
    setNewPhone('')
    toast.success(`User ${newUser.name} (${newUser.role}) created successfully!`)
  }

  const handleToggleRole = (userId: number) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextRole: UserRole = u.role === 'DRIVER' ? 'OPERATOR' : u.role === 'OPERATOR' ? 'ADMIN' : 'DRIVER'
        toast.success(`Updated ${u.name}'s role to ${nextRole}`)
        return { ...u, role: nextRole }
      }
      return u
    }))
  }

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
    toast.success('User removed from directory')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Users size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">User Management Directory</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Admin console for driver accounts, facility operators, role assignments, and permissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create New User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users by name, email…"
            leftIcon={<Search size={14} />}
          />
          <Select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Roles (Driver, Operator, Admin)' },
              { value: 'DRIVER', label: 'Drivers Only' },
              { value: 'OPERATOR', label: 'Operators Only' },
              { value: 'ADMIN', label: 'Admins Only' },
            ]}
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>User Directory ({filtered.length} users)</CardTitle>
            <p className="text-xs text-surface-500 mt-0.5">Role-based access control (RBAC) enforced</p>
          </div>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800">
                {['User', 'Email & Phone', 'Role', 'Joined Date', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-2xs font-semibold text-surface-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-surface-900 hover:bg-surface-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {u.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-surface-200 text-xs">{u.name}</p>
                        <p className="text-2xs text-surface-500">ID #{u.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-xs">
                    <p className="text-surface-300 flex items-center gap-1"><Mail size={11} className="text-surface-500" /> {u.email}</p>
                    <p className="text-2xs text-surface-500 flex items-center gap-1 mt-0.5"><Phone size={10} /> {u.phone ?? '+91 98400 00000'}</p>
                  </td>

                  <td className="py-3 px-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      u.role === 'ADMIN'
                        ? 'bg-brand-900/60 text-brand-300 border border-brand-700/50'
                        : u.role === 'OPERATOR'
                        ? 'bg-reserved/10 text-reserved border border-reserved/30'
                        : 'bg-available/10 text-available border border-available/30'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-xs text-surface-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => handleToggleRole(u.id)}
                        title="Cycle role: DRIVER -> OPERATOR -> ADMIN"
                      >
                        Change Role
                      </Button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="text-surface-500 hover:text-occupied p-1.5 rounded-lg hover:bg-surface-800 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create User Modal */}
      {createModalOpen && (
        <Modal isOpen onClose={() => setCreateModalOpen(false)} title="Create User Account" size="md">
          <form onSubmit={handleCreateUser} className="space-y-4">
            <Input
              label="Full Name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Anand Ranganathan"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="e.g. anand@company.com"
              required
            />

            <Input
              label="Phone Number"
              value={newPhone}
              onChange={e => setNewPhone(e.target.value)}
              placeholder="e.g. +91 98412 99999"
            />

            <Select
              label="Assigned System Role"
              value={newRole}
              onChange={e => setNewRole(e.target.value as UserRole)}
              options={[
                { value: 'DRIVER', label: '🚗 DRIVER — Search, AI Recommend, Bookings, Pass' },
                { value: 'OPERATOR', label: '👨‍💼 OPERATOR — Digital Twin, What-If, Live Occupancy, Pricing' },
                { value: 'ADMIN', label: '🛠️ ADMIN — Platform Control, ML Monitoring, Full Access' },
              ]}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" leftIcon={<Plus size={14} />}>
                Create User
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
