import { motion } from 'framer-motion'
import { useState } from 'react'
import Avatar from '../ui/Avatar'
import StatusDot from '../ui/StatusDot'
import NowLine from './NowLine'
import { getStaffById } from '../../data/mockData'

const HOUR_WIDTH = 56
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const TOTAL_WIDTH = 120 + 24 * HOUR_WIDTH

const entryTypeStyles = {
  regular: 'bg-red-primary/60 border-red-primary/80',
  reinforcement: 'bg-blue-400/50 border-blue-400/60',
  early_leave: 'bg-warning/40 border-warning/50',
  replacement: 'bg-purple-400/50 border-purple-400/60',
}

const entryTypeLabels = {
  regular: '',
  reinforcement: 'Подкр.',
  early_leave: 'Ран. уход',
  replacement: 'Замена',
}

function StaffEntryBar({ entry, shift, index, onStaffClick }) {
  const [hovered, setHovered] = useState(false)

  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m }
  const startTotal = toMin(entry.startTime)
  let endTotal = toMin(entry.endTime)
  if (endTotal <= startTotal) endTotal = 24 * 60

  const left = (startTotal / 60) * HOUR_WIDTH
  const width = ((endTotal - startTotal) / 60) * HOUR_WIDTH

  const style = entryTypeStyles[entry.type] || entryTypeStyles.regular
  const isActive = shift.status === 'active'

  return (
    <motion.div
      className={`absolute top-1 h-[32px] rounded-md border cursor-pointer flex items-center overflow-hidden ${style}`}
      style={{ left: `${left}px`, width: `${width}px`, transformOrigin: 'left center' }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1, scaleY: hovered ? 1.15 : 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onStaffClick?.(entry.staffId)}
    >
      {isActive && entry.type === 'regular' && (
        <div className="absolute inset-0 rounded-md" style={{ boxShadow: 'inset 0 0 12px rgba(229,62,62,0.3), 0 0 8px rgba(229,62,62,0.2)' }} />
      )}
      {width > 80 && (
        <span className="relative z-10 px-2 text-[10px] font-medium text-text-primary truncate">
          {shift.name}{entryTypeLabels[entry.type] ? ` · ${entryTypeLabels[entry.type]}` : ''}
        </span>
      )}

      {hovered && (
        <div className="absolute -top-[72px] left-1/2 -translate-x-1/2 z-30 glass-card p-2 text-xs whitespace-nowrap pointer-events-none" style={{ minWidth: '140px' }}>
          <p className="font-medium text-text-primary">{shift.name}</p>
          <p className="text-text-secondary">{entry.startTime} - {entry.endTime}</p>
          <p className="text-text-muted">{entry.type !== 'regular' ? entryTypeLabels[entry.type] + ' · ' : ''}{shift.payTokens} токенов</p>
        </div>
      )}
    </motion.div>
  )
}

export default function ShiftsTimeline({ shifts, isToday, onStaffClick }) {
  // Collect unique staff from all staffEntries
  const staffIds = [...new Set(shifts.flatMap(s => (s.staffEntries || []).map(e => e.staffId)))]
  const staffMembers = staffIds.map(id => getStaffById(id)).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-card overflow-hidden"
    >
      <div className="overflow-x-auto">
        <div className="relative" style={{ minWidth: `${TOTAL_WIDTH}px` }}>
          {/* Hour header */}
          <div className="flex items-center h-8 border-b border-border/50">
            <div className="w-[120px] shrink-0 px-3 text-[10px] text-text-muted uppercase tracking-wider font-medium">
              Сотрудник
            </div>
            <div className="relative flex-1">
              {HOURS.map(h => (
                <div
                  key={h}
                  className="absolute top-0 h-full flex items-center"
                  style={{ left: `${h * HOUR_WIDTH}px`, width: `${HOUR_WIDTH}px` }}
                >
                  <span className="text-[10px] text-text-muted font-mono pl-1">
                    {String(h).padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Staff rows */}
          {staffMembers.map((member, i) => {
            // Find all entries for this staff across all shifts for this day
            const memberEntries = shifts.flatMap(s =>
              (s.staffEntries || [])
                .filter(e => e.staffId === member.id)
                .map(e => ({ ...e, shift: s }))
            )

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center h-[48px] border-b border-border/30 hover:bg-bg-hover/30 transition-colors"
              >
                <div
                  className="w-[120px] shrink-0 px-3 flex items-center gap-2 sticky left-0 z-10 bg-bg-card/80 backdrop-blur-sm h-full cursor-pointer"
                  onClick={() => onStaffClick?.(member.id)}
                >
                  <Avatar nick={member.login} size="xs" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-text-primary truncate">{member.firstName}</p>
                  </div>
                  <StatusDot status={member.status} size="sm" />
                </div>

                <div
                  className="relative flex-1 h-full"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 55px, var(--timeline-grid) 55px, var(--timeline-grid) 56px)',
                  }}
                >
                  {memberEntries.map((entry, si) => (
                    <StaffEntryBar
                      key={`${entry.shift.id}-${entry.staffId}`}
                      entry={entry}
                      shift={entry.shift}
                      index={i * 2 + si}
                      onStaffClick={onStaffClick}
                    />
                  ))}
                </div>
              </motion.div>
            )
          })}

          {staffMembers.length === 0 && (
            <div className="flex items-center justify-center h-24 text-sm text-text-muted">
              Нет смен на этот день
            </div>
          )}

          {/* Now line overlay */}
          {isToday && staffMembers.length > 0 && (
            <div className="absolute top-8 bottom-0 left-0 right-0 pointer-events-none z-20">
              <NowLine />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
