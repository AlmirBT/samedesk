import { motion } from 'framer-motion'
import { Clock, Coins, Edit2, UserPlus } from 'lucide-react'
import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import StatusDot from '../ui/StatusDot'
import Button from '../ui/Button'
import { getStaffById } from '../../data/mockData'

const statusLabels = { scheduled: 'Запланирована', active: 'Активна', ended: 'Завершена' }
const statusColors = { scheduled: 'gray', active: 'green', ended: 'gray' }

export default function ShiftCard({ shift }) {
  const staffMembers = shift.staff.map(id => getStaffById(id)).filter(Boolean)
  const totalTickets = staffMembers.reduce((sum, s) => sum + s.stats.todayTickets, 0)
  const avgTime = staffMembers.length > 0
    ? Math.round(staffMembers.reduce((sum, s) => sum + s.stats.avgResponseTime, 0) / staffMembers.length)
    : 0

  return (
    <Card
      hover={false}
      className={`min-w-[300px] max-w-[380px] shrink-0 ${shift.status === 'active' ? '!border-red-primary/30 shadow-lg shadow-red-primary/5' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {shift.status === 'active' && <StatusDot status="active" pulse />}
          <h4 className="font-heading font-semibold text-sm">{shift.name}</h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={statusColors[shift.status]}>{statusLabels[shift.status]}</Badge>
          <button className="p-1 rounded text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer">
            <Edit2 size={12} />
          </button>
        </div>
      </div>

      {/* Time + tokens */}
      <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
        <div className="flex items-center gap-1">
          <Clock size={12} />
          {shift.startTime} - {shift.endTime}
        </div>
        <div className="flex items-center gap-1">
          <Coins size={12} className="text-warning" />
          {shift.payTokens} токенов
        </div>
      </div>

      {/* Staff table */}
      <div className="mb-3">
        <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">Сотрудники</p>
        <div className="space-y-1.5">
          {staffMembers.map(s => (
            <div key={s.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-bg-base/50">
              <StatusDot status={s.status} size="sm" />
              <Avatar nick={s.login} size="xs" />
              <span className="text-xs text-text-primary flex-1 truncate">{s.firstName} {s.lastName}</span>
              <span className="text-[10px] font-mono text-text-secondary">{s.stats.todayTickets} тик.</span>
              <span className="text-[10px] font-mono text-text-muted">{Math.round(s.stats.avgResponseTime / 60)}м</span>
            </div>
          ))}
        </div>
        <button className="w-full mt-1.5 py-1.5 flex items-center justify-center gap-1 text-[10px] text-text-muted hover:text-red-light rounded-lg hover:bg-bg-hover/50 transition-colors cursor-pointer">
          <UserPlus size={10} />
          Добавить сотрудника
        </button>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3 pt-2 border-t border-border/50 text-[10px] text-text-muted">
        <span>Всего: <strong className="text-text-secondary">{totalTickets}</strong> обращений</span>
        <span>Среднее: <strong className="text-text-secondary">{avgTime}с</strong></span>
      </div>

      {/* Ready button for scheduled */}
      {shift.status === 'scheduled' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-3 py-2 text-xs font-medium rounded-lg bg-red-primary/10 text-red-light hover:bg-red-primary/20 transition-colors cursor-pointer"
          style={{ animation: 'pulse-red 2s ease-in-out infinite' }}
        >
          Готов
        </motion.button>
      )}
    </Card>
  )
}
