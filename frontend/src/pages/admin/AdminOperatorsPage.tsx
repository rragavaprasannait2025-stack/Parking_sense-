import { useState } from 'react'
import {
  Building2, UserCheck, Shield, Plus, Phone, Mail,
  CheckCircle, Clock, MapPin, Search
} from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Badge, DemoBadge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { DEMO_FACILITIES, DEMO_USERS } from '@/services/demoData'
import type { User } from '@/types'
import toast from 'react-hot-toast'

export default function AdminOperatorsPage() {
  const operators = DEMO_USERS.filter(u => u.role === 'OPERATOR' || u.role === 'ADMIN')
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [selectedOperator, setSelectedOperator] = useState<string>(String(operators[0]?.id ?? 2))
  const [selectedFacility, setSelectedFacility] = useState<string>('1')

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault()
    const op = operators.find(o => String(o.id) === selectedOperator)
    const fac = DEMO_FACILITIES.find(f => String(f.id) === selectedFacility)
    toast.success(`Assigned ${op?.name} to manage ${fac?.name}`)
    setAssignModalOpen(false)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <UserCheck size={18} />
            </div>
            <h1 className="text-2xl font-bold text-surface-50">Facility Operator Assignments</h1>
          </div>
          <p className="text-surface-400 text-sm mt-0.5">
            Supervise facility control room operators, shifts, assignments, and authorization levels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={() => setAssignModalOpen(true)}
          >
            Assign Operator
          </Button>
        </div>
      </div>

      {/* Operators & Facilities Matrix */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEMO_FACILITIES.map(fac => {
          const op = operators.find(o => o.id === fac.operatorId) || operators[0]

          return (
            <Card key={fac.id} className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="available" size="sm" className="mb-1">Active Shift</Badge>
                  <h3 className="font-bold text-surface-100 text-sm">{fac.name}</h3>
                  <p className="text-2xs text-surface-400 mt-0.5">{fac.address}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-brand-900/50 border border-brand-800 flex items-center justify-center text-brand-400 flex-shrink-0">
                  <Building2 size={16} />
                </div>
              </div>

              {/* Operator details */}
              <div className="p-3 bg-surface-800/50 rounded-xl border border-surface-700/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                  {op.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-surface-100 truncate">{op.name}</p>
                  <p className="text-2xs text-surface-400 truncate">{op.email}</p>
                  <p className="text-2xs text-brand-400 font-semibold mt-0.5">{op.role} Role</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-2xs text-surface-400 pt-2 border-t border-surface-800">
                <span className="flex items-center gap-1"><Clock size={11} /> Shift: 08:00 - 20:00</span>
                <span className="text-available font-bold">{fac.totalSlots} Slots Monitored</span>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Assign Modal */}
      {assignModalOpen && (
        <Modal isOpen onClose={() => setAssignModalOpen(false)} title="Assign Facility Operator" size="md">
          <form onSubmit={handleAssign} className="space-y-4">
            <Select
              label="Select Operator"
              value={selectedOperator}
              onChange={e => setSelectedOperator(e.target.value)}
              options={operators.map(o => ({ value: String(o.id), label: `${o.name} (${o.email})` }))}
            />

            <Select
              label="Select Parking Facility"
              value={selectedFacility}
              onChange={e => setSelectedFacility(e.target.value)}
              options={DEMO_FACILITIES.map(f => ({ value: String(f.id), label: `${f.name} (${f.totalSlots} slots)` }))}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Confirm Assignment
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
