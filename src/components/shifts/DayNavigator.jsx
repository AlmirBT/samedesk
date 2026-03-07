import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from 'lucide-react'
import Button from '../ui/Button'

const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function getWeekDates(referenceDate) {
  const d = new Date(referenceDate)
  const day = d.getDay() === 0 ? 6 : d.getDay() - 1
  const monday = new Date(d)
  monday.setDate(d.getDate() - day)
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    return date.toISOString().split('T')[0]
  })
}

export default function DayNavigator({ selectedDate, onSelectDate, onCreateClick, shiftsPerDay = {} }) {
  const todayStr = new Date().toISOString().split('T')[0]
  const weekDates = getWeekDates(selectedDate)

  const prevWeek = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() - 7)
    onSelectDate(d.toISOString().split('T')[0])
  }

  const nextWeek = () => {
    const d = new Date(selectedDate)
    d.setDate(d.getDate() + 7)
    onSelectDate(d.toISOString().split('T')[0])
  }

  const goToday = () => onSelectDate(todayStr)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="flex flex-wrap items-center gap-3"
    >
      <button
        onClick={prevWeek}
        className="p-2 rounded-lg bg-bg-card text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
      >
        <ChevronLeft size={16} />
      </button>

      <div className="flex gap-1">
        {weekDates.map((date, i) => {
          const dayNum = new Date(date).getDate()
          const isToday = date === todayStr
          const isSelected = date === selectedDate
          const hasShifts = (shiftsPerDay[date] || 0) > 0

          return (
            <motion.button
              key={date}
              onClick={() => onSelectDate(date)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative flex flex-col items-center justify-center w-11 h-14 rounded-lg text-xs font-medium transition-colors cursor-pointer
                ${isSelected
                  ? 'bg-red-primary text-white'
                  : isToday
                    ? 'bg-bg-card border border-red-primary/50 text-text-primary'
                    : 'bg-bg-card text-text-secondary hover:bg-bg-hover'
                }
              `}
            >
              <span className="text-[10px] opacity-70">{dayNames[i]}</span>
              <span className="font-bold">{dayNum}</span>
              {hasShifts && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-red-primary" />
              )}
            </motion.button>
          )
        })}
      </div>

      <button
        onClick={nextWeek}
        className="p-2 rounded-lg bg-bg-card text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
      >
        <ChevronRight size={16} />
      </button>

      <div className="flex gap-2 ml-auto">
        <Button variant="ghost" size="sm" icon={<CalendarDays size={14} />} onClick={goToday}>
          Сегодня
        </Button>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={onCreateClick}>
          Создать смену
        </Button>
      </div>
    </motion.div>
  )
}
