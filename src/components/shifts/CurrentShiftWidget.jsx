import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Pause, Square, Play } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import StatusDot from '../ui/StatusDot'
import { getStaffById } from '../../data/mockData'

export default function CurrentShiftWidget({ shift }) {
  const [elapsed, setElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const [startH, startM] = shift.startTime.split(':').map(Number)
  const [endH, endM] = shift.endTime.split(':').map(Number)
  const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM)
  const totalSeconds = (totalMinutes > 0 ? totalMinutes : totalMinutes + 1440) * 60

  useEffect(() => {
    setElapsed(Math.floor(totalSeconds * 0.4))
    const interval = setInterval(() => {
      if (!isPaused) setElapsed(prev => Math.min(prev + 1, totalSeconds))
    }, 1000)
    return () => clearInterval(interval)
  }, [isPaused, totalSeconds])

  const progress = Math.min((elapsed / totalSeconds) * 100, 100)
  const hours = Math.floor(elapsed / 3600)
  const minutes = Math.floor((elapsed % 3600) / 60)
  const seconds = elapsed % 60
  const staffMembers = shift.staff.map(id => getStaffById(id)).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 border-l-4 border-l-red-primary"
      style={{
        background: 'linear-gradient(135deg, #1A0A0A, #1E1010)',
        boxShadow: '0 0 30px rgba(229,62,62,0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
        border: '1px solid rgba(42,42,42,0.8)',
        borderLeftWidth: '4px',
        borderLeftColor: '#E53E3E',
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Left: LIVE badge + name + time */}
        <div className="flex items-center gap-3 lg:min-w-[200px]">
          <div className="flex items-center gap-2">
            <StatusDot status="active" pulse />
            <Badge color="red">LIVE</Badge>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-sm">{shift.name}</h4>
            <p className="text-xs text-text-muted">{shift.startTime} - {shift.endTime}</p>
          </div>
        </div>

        {/* Center: Timer + progress */}
        <div className="flex-1 min-w-0">
          <p className="text-[32px] leading-none font-mono font-bold text-red-light text-center mb-2">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
          <div className="relative h-2 bg-bg-card rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #C53030, #E53E3E, #FC8181)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-muted mt-1">
            <span>{shift.startTime}</span>
            <span>{Math.round(progress)}%</span>
            <span>{shift.endTime}</span>
          </div>
        </div>

        {/* Right: Avatars + stats + buttons */}
        <div className="flex items-center gap-4 lg:min-w-[300px] lg:justify-end">
          <div className="flex -space-x-2">
            {staffMembers.map(s => (
              <Avatar key={s.id} nick={s.login} size="sm" status={s.status} className="ring-2 ring-[#1A0A0A]" />
            ))}
          </div>

          <div className="flex gap-2">
            <div className="px-2 py-1 rounded-md bg-bg-card/60 text-center">
              <p className="text-xs font-mono font-bold text-text-primary">{staffMembers.reduce((sum, s) => sum + s.stats.todayTickets, 0)}</p>
              <p className="text-[9px] text-text-muted">тикетов</p>
            </div>
            <div className="px-2 py-1 rounded-md bg-bg-card/60 text-center">
              <p className="text-xs font-mono font-bold text-warning">{shift.payTokens}</p>
              <p className="text-[9px] text-text-muted">токенов</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant={isPaused ? 'primary' : 'secondary'}
              size="sm"
              icon={isPaused ? <Play size={14} /> : <Pause size={14} />}
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? 'Далее' : 'Пауза'}
            </Button>
            <Button variant="danger" size="sm" icon={<Square size={14} />}>
              Стоп
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
