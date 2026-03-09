import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import CurrentShiftWidget from '../components/shifts/CurrentShiftWidget'
import DayNavigator from '../components/shifts/DayNavigator'
import ShiftsTimeline from '../components/shifts/ShiftsTimeline'
import ShiftCard from '../components/shifts/ShiftCard'
import ActivityLog from '../components/shifts/ActivityLog'
import ShiftCreateModal from '../components/shifts/ShiftCreateModal'
import StaffProfileModal from '../components/shifts/StaffProfileModal'

export default function Shifts() {
  const { shifts, shiftLogs } = useApp()
  const todayStr = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedStaffId, setSelectedStaffId] = useState(null)

  const activeShift = shifts.find(s => s.status === 'active' && s.date === todayStr)
  const dayShifts = shifts.filter(s => s.date === selectedDate)
  const dayLogs = shiftLogs.filter(log => dayShifts.some(s => s.id === log.shiftId))
  const isToday = selectedDate === todayStr

  // Shifts per day for dot indicators
  const shiftsPerDay = {}
  shifts.forEach(s => {
    shiftsPerDay[s.date] = (shiftsPerDay[s.date] || 0) + 1
  })

  const handleStaffClick = (staffId) => {
    setSelectedStaffId(staffId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Active shift widget */}
      {activeShift && (
        <div>
          <h3 className="text-sm font-heading font-semibold text-text-secondary mb-3">Текущая смена</h3>
          <CurrentShiftWidget shift={activeShift} />
        </div>
      )}

      {/* Day navigator */}
      <DayNavigator
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onCreateClick={() => setShowCreateModal(true)}
        shiftsPerDay={shiftsPerDay}
      />

      {/* Timeline */}
      <div>
        <h3 className="text-sm font-heading font-semibold text-text-secondary mb-3">
          Таймлайн {isToday ? '(сегодня)' : ''}
        </h3>
        <ShiftsTimeline shifts={dayShifts} isToday={isToday} onStaffClick={handleStaffClick} />
      </div>

      {/* Shift detail cards */}
      {dayShifts.length > 0 && (
        <div>
          <h3 className="text-sm font-heading font-semibold text-text-secondary mb-3">Смены</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {dayShifts.map((shift, i) => (
              <motion.div
                key={shift.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
              >
                <ShiftCard shift={shift} onStaffClick={handleStaffClick} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Activity log */}
      {dayLogs.length > 0 && (
        <div>
          <h3 className="text-sm font-heading font-semibold text-text-secondary mb-3">Лог активности</h3>
          <ActivityLog logs={dayLogs} shifts={dayShifts} />
        </div>
      )}

      {/* Create modal */}
      <ShiftCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        selectedDate={selectedDate}
      />

      {/* Staff profile modal */}
      <StaffProfileModal
        isOpen={!!selectedStaffId}
        onClose={() => setSelectedStaffId(null)}
        staffId={selectedStaffId}
      />
    </motion.div>
  )
}
