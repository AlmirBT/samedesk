import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Square, Pause, MessageCircle } from 'lucide-react'

const typeConfig = {
  start: { icon: Play, color: 'text-success', bg: 'bg-success/10' },
  end: { icon: Square, color: 'text-text-secondary', bg: 'bg-bg-hover' },
  break_start: { icon: Pause, color: 'text-warning', bg: 'bg-warning/10' },
  break_end: { icon: Play, color: 'text-warning', bg: 'bg-warning/10' },
  ticket: { icon: MessageCircle, color: 'text-red-light', bg: 'bg-red-primary/10' },
}

const tabs = [
  { key: 'all', label: 'Все' },
  { key: 'start_end', label: 'Начало/конец' },
  { key: 'breaks', label: 'Перерывы' },
  { key: 'tickets', label: 'Обращения' },
]

export default function ActivityLog({ logs, shifts }) {
  const [activeTab, setActiveTab] = useState('all')

  const filteredLogs = logs.filter(log => {
    if (activeTab === 'all') return true
    if (activeTab === 'start_end') return log.type === 'start' || log.type === 'end'
    if (activeTab === 'breaks') return log.type === 'break_start' || log.type === 'break_end'
    if (activeTab === 'tickets') return log.type === 'ticket'
    return true
  })

  // Group by shift
  const grouped = {}
  filteredLogs.forEach(log => {
    if (!grouped[log.shiftId]) grouped[log.shiftId] = []
    grouped[log.shiftId].push(log)
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer
              ${activeTab === tab.key
                ? 'bg-red-primary/20 text-red-light'
                : 'bg-bg-card text-text-secondary hover:bg-bg-hover'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {Object.entries(grouped).map(([shiftId, shiftLogs]) => {
            const shift = shifts.find(s => s.id === shiftId)
            return (
              <div key={shiftId}>
                {shift && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-px flex-1 bg-border/50" />
                    <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">
                      {shift.name} ({shift.startTime}-{shift.endTime})
                    </span>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                )}
                <div className="space-y-1">
                  {shiftLogs.map((log, i) => {
                    const config = typeConfig[log.type] || typeConfig.start
                    const Icon = config.icon
                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg bg-bg-card/50 hover:bg-bg-hover/50 transition-colors"
                      >
                        <div className={`p-1 rounded ${config.bg}`}>
                          <Icon size={12} className={config.color} />
                        </div>
                        <span className="text-xs font-mono text-text-muted w-10 shrink-0">{log.time}</span>
                        <span className="text-sm text-text-secondary">{log.text}</span>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </AnimatePresence>

        {filteredLogs.length === 0 && (
          <div className="text-center py-6 text-sm text-text-muted">Нет записей</div>
        )}
      </div>
    </motion.div>
  )
}
