import { motion } from 'framer-motion'
import Avatar from '../ui/Avatar'
import StatusDot from '../ui/StatusDot'
import ShiftBar from './ShiftBar'
import NowLine from './NowLine'
import { getStaffById } from '../../data/mockData'

const HOUR_WIDTH = 56
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const TOTAL_WIDTH = 120 + 24 * HOUR_WIDTH

export default function ShiftsTimeline({ shifts, isToday }) {
  const staffIds = [...new Set(shifts.flatMap(s => s.staff))]
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
            const memberShifts = shifts.filter(s => s.staff.includes(member.id))

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="flex items-center h-[48px] border-b border-border/30 hover:bg-bg-hover/30 transition-colors"
              >
                <div className="w-[120px] shrink-0 px-3 flex items-center gap-2 sticky left-0 z-10 bg-bg-card/80 backdrop-blur-sm h-full">
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
                  {memberShifts.map((shift, si) => (
                    <ShiftBar key={shift.id} shift={shift} index={i * 2 + si} />
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
