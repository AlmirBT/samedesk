import { motion } from 'framer-motion'
import { useState } from 'react'

const HOUR_WIDTH = 56

const statusStyles = {
  active: 'bg-red-primary/80 border-red-primary',
  ended: 'bg-success/30 border-success/40',
  scheduled: 'bg-text-muted/40 border-text-muted/50',
}

export default function ShiftBar({ shift, index = 0 }) {
  const [hovered, setHovered] = useState(false)

  const [startH, startM] = shift.startTime.split(':').map(Number)
  let [endH, endM] = shift.endTime.split(':').map(Number)
  let endTotal = endH * 60 + endM
  const startTotal = startH * 60 + startM
  if (endTotal <= startTotal) endTotal = 24 * 60

  const left = (startTotal / 60) * HOUR_WIDTH
  const width = ((endTotal - startTotal) / 60) * HOUR_WIDTH

  return (
    <motion.div
      className={`absolute top-1 h-[32px] rounded-md border cursor-pointer flex items-center overflow-hidden ${statusStyles[shift.status] || statusStyles.scheduled}`}
      style={{ left: `${left}px`, width: `${width}px`, transformOrigin: 'left center' }}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1, scaleY: hovered ? 1.15 : 1 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.4, 0, 0.2, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {shift.status === 'active' && (
        <div className="absolute inset-0 rounded-md" style={{ boxShadow: 'inset 0 0 12px rgba(229,62,62,0.3), 0 0 8px rgba(229,62,62,0.2)' }} />
      )}
      {width > 80 && (
        <span className="relative z-10 px-2 text-[10px] font-medium text-text-primary truncate">
          {shift.name}
        </span>
      )}

      {hovered && (
        <div className="absolute -top-[72px] left-1/2 -translate-x-1/2 z-30 glass-card p-2 text-xs whitespace-nowrap pointer-events-none" style={{ minWidth: '140px' }}>
          <p className="font-medium text-text-primary">{shift.name}</p>
          <p className="text-text-secondary">{shift.startTime} - {shift.endTime}</p>
          <p className="text-text-muted">{shift.staff.length} сотр. | {shift.payTokens} токенов</p>
        </div>
      )}
    </motion.div>
  )
}
