import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Coins, Edit2, UserPlus, X, Check, Shield, Zap, LogOut, ArrowLeftRight } from 'lucide-react'
import Card from '../ui/Card'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import StatusDot from '../ui/StatusDot'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'
import { getStaffById } from '../../data/mockData'

const statusLabels = { scheduled: 'Запланирована', active: 'Активна', ended: 'Завершена' }
const statusColors = { scheduled: 'gray', active: 'green', ended: 'gray' }

const typeLabels = { regular: null, reinforcement: 'Подкрепление', early_leave: 'Ранний уход', replacement: 'Замена' }
const typeColors = { regular: null, reinforcement: 'blue', early_leave: 'yellow', replacement: 'purple' }
const typeIcons = { regular: null, reinforcement: Zap, early_leave: LogOut, replacement: ArrowLeftRight }

function MiniTimeBar({ entry, shiftStart, shiftEnd }) {
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  const sMin = toMin(shiftStart)
  let eMin = toMin(shiftEnd)
  if (eMin <= sMin) eMin += 24 * 60
  const totalDuration = eMin - sMin

  let entryStart = toMin(entry.startTime)
  let entryEnd = toMin(entry.endTime)
  if (entryStart < sMin && entryStart < 12 * 60) entryStart += 24 * 60
  if (entryEnd <= entryStart) entryEnd += 24 * 60
  if (entryEnd <= sMin && entryEnd < 12 * 60) entryEnd += 24 * 60

  const left = ((entryStart - sMin) / totalDuration) * 100
  const width = ((entryEnd - entryStart) / totalDuration) * 100

  const barColor = entry.type === 'reinforcement' ? 'bg-blue-400/60'
    : entry.type === 'early_leave' ? 'bg-warning/50'
    : entry.type === 'replacement' ? 'bg-purple-400/60'
    : 'bg-red-primary/50'

  return (
    <div className="w-full h-1.5 rounded-full bg-bg-base/80 overflow-hidden relative">
      <div
        className={`absolute top-0 h-full rounded-full ${barColor}`}
        style={{ left: `${Math.max(0, left)}%`, width: `${Math.min(100, width)}%` }}
      />
    </div>
  )
}

export default function ShiftCard({ shift, onStaffClick }) {
  const { staff, addStaffToShift, removeStaffFromShift, updateShiftStaffEntry } = useApp()
  const [showAddStaff, setShowAddStaff] = useState(false)
  const [addSearch, setAddSearch] = useState('')
  const [editingStaffId, setEditingStaffId] = useState(null)
  const [editStart, setEditStart] = useState('')
  const [editEnd, setEditEnd] = useState('')

  const staffEntries = shift.staffEntries || []
  const staffMembers = staffEntries.map(e => ({ ...e, member: getStaffById(e.staffId) })).filter(e => e.member)
  const totalTickets = staffMembers.reduce((sum, e) => sum + e.member.stats.todayTickets, 0)
  const avgTime = staffMembers.length > 0
    ? Math.round(staffMembers.reduce((sum, e) => sum + e.member.stats.avgResponseTime, 0) / staffMembers.length)
    : 0

  const existingStaffIds = staffEntries.map(e => e.staffId)
  const availableStaff = staff.filter(s =>
    !existingStaffIds.includes(s.id) &&
    (`${s.firstName} ${s.lastName} ${s.login}`).toLowerCase().includes(addSearch.toLowerCase())
  )

  const handleAddStaff = (staffId) => {
    addStaffToShift(shift.id, {
      staffId,
      startTime: shift.startTime,
      endTime: shift.endTime,
      type: 'regular',
    })
    setShowAddStaff(false)
    setAddSearch('')
  }

  const startEditing = (entry, e) => {
    e.stopPropagation()
    setEditingStaffId(entry.staffId)
    setEditStart(entry.startTime)
    setEditEnd(entry.endTime)
  }

  const saveEdit = (e) => {
    e.stopPropagation()
    updateShiftStaffEntry(shift.id, editingStaffId, { startTime: editStart, endTime: editEnd })
    setEditingStaffId(null)
  }

  const inputClass = 'px-1.5 py-0.5 rounded bg-bg-base border border-border text-[10px] font-mono text-text-primary focus:border-red-primary/50 focus:outline-none w-[58px]'

  return (
    <Card
      hover={false}
      className={`min-w-[320px] max-w-[400px] shrink-0 ${shift.status === 'active' ? '!border-red-primary/30 shadow-lg shadow-red-primary/5' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {shift.status === 'active' && <StatusDot status="active" pulse />}
          <h4 className="font-heading font-semibold text-sm">{shift.name}</h4>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={statusColors[shift.status]}>{statusLabels[shift.status]}</Badge>
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
          {staffMembers.map(({ member, staffId, startTime, endTime, type }) => {
            const TypeIcon = typeIcons[type]
            const isEditing = editingStaffId === staffId

            return (
              <motion.div
                key={staffId}
                layout
                className="rounded-lg bg-bg-base/50 overflow-hidden"
              >
                <div
                  className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-bg-hover/30 transition-colors"
                  onClick={() => onStaffClick?.(staffId)}
                >
                  <StatusDot status={member.status} size="sm" />
                  <Avatar nick={member.login} size="xs" />
                  <span className="text-xs text-text-primary flex-1 truncate">{member.firstName} {member.lastName}</span>
                  {typeLabels[type] && (
                    <span className={`flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-full ${
                      type === 'reinforcement' ? 'bg-blue-500/10 text-blue-400'
                      : type === 'early_leave' ? 'bg-warning/10 text-warning'
                      : type === 'replacement' ? 'bg-purple-500/10 text-purple-400'
                      : ''
                    }`}>
                      {TypeIcon && <TypeIcon size={8} />}
                      {typeLabels[type]}
                    </span>
                  )}
                  {isEditing ? (
                    <button onClick={saveEdit} className="p-0.5 text-success hover:text-success/80 transition-colors cursor-pointer">
                      <Check size={10} />
                    </button>
                  ) : (
                    <button onClick={(e) => startEditing({ staffId, startTime, endTime }, e)} className="p-0.5 text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                      <Edit2 size={10} />
                    </button>
                  )}
                </div>
                {isEditing ? (
                  <div className="flex items-center gap-1.5 px-2 pb-1.5" onClick={e => e.stopPropagation()}>
                    <input type="time" value={editStart} onChange={e => setEditStart(e.target.value)} className={inputClass} />
                    <span className="text-[10px] text-text-muted">—</span>
                    <input type="time" value={editEnd} onChange={e => setEditEnd(e.target.value)} className={inputClass} />
                    <button onClick={() => { removeStaffFromShift(shift.id, staffId); setEditingStaffId(null) }} className="ml-auto p-0.5 text-red-light hover:text-red-primary transition-colors cursor-pointer">
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <div className="px-2 pb-1.5 flex items-center gap-2">
                    <span className="text-[10px] font-mono text-text-muted">{startTime}-{endTime}</span>
                    <div className="flex-1">
                      <MiniTimeBar entry={{ startTime, endTime, type }} shiftStart={shift.startTime} shiftEnd={shift.endTime} />
                    </div>
                    <span className="text-[10px] font-mono text-text-secondary">{member.stats.todayTickets} тик.</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Add staff button/popover */}
        <div className="relative">
          <button
            onClick={() => setShowAddStaff(!showAddStaff)}
            className="w-full mt-1.5 py-1.5 flex items-center justify-center gap-1 text-[10px] text-text-muted hover:text-red-light rounded-lg hover:bg-bg-hover/50 transition-colors cursor-pointer"
          >
            <UserPlus size={10} />
            Добавить сотрудника
          </button>
          <AnimatePresence>
            {showAddStaff && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="absolute left-0 right-0 top-full z-20 mt-1 glass-card p-2 space-y-1 max-h-[160px] overflow-y-auto"
              >
                <input
                  type="text"
                  value={addSearch}
                  onChange={e => setAddSearch(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full px-2 py-1 text-[10px] rounded bg-bg-base border border-border text-text-primary focus:border-red-primary/50 focus:outline-none mb-1"
                  autoFocus
                />
                {availableStaff.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleAddStaff(s.id)}
                    className="w-full flex items-center gap-2 px-2 py-1 rounded hover:bg-bg-hover transition-colors cursor-pointer text-left"
                  >
                    <Avatar nick={s.login} size="xs" />
                    <span className="text-[10px] text-text-primary">{s.firstName} {s.lastName}</span>
                  </button>
                ))}
                {availableStaff.length === 0 && (
                  <p className="text-[10px] text-text-muted text-center py-1">Нет доступных</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
