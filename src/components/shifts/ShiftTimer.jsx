import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Pause, Square } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

export default function ShiftTimer({ shift }) {
  const [elapsed, setElapsed] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Calculate total shift duration in seconds
  const [startH, startM] = shift.startTime.split(':').map(Number)
  const [endH, endM] = shift.endTime.split(':').map(Number)
  const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM)
  const totalSeconds = (totalMinutes > 0 ? totalMinutes : totalMinutes + 1440) * 60

  useEffect(() => {
    // Simulate elapsed time (start from ~40% through)
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

  return (
    <Card hover={false} className="!border-red-primary/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-heading font-semibold">{shift.name}</h3>
          <p className="text-xs text-text-muted">{shift.startTime} — {shift.endTime}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-mono font-bold text-red-light">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-bg-card rounded-full overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gradient-to-r from-red-primary to-red-light rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant={isPaused ? 'primary' : 'secondary'}
          size="sm"
          icon={<Pause size={14} />}
          onClick={() => setIsPaused(!isPaused)}
          className="flex-1"
        >
          {isPaused ? 'Продолжить' : 'Перерыв'}
        </Button>
        <Button variant="danger" size="sm" icon={<Square size={14} />} className="flex-1">
          Завершить
        </Button>
      </div>
    </Card>
  )
}
