import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Undo2 } from 'lucide-react'
import Button from '../ui/Button'

export default function UndoToast({ ticketId, onUndo, onExpire, duration = 5 }) {
  const [remaining, setRemaining] = useState(duration)

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [onExpire, duration])

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="glass-card border-l-2 border-success/50 px-4 py-3 min-w-[300px] flex items-center gap-3"
    >
      <div className="flex-1">
        <p className="text-sm text-text-primary">
          Тикет <span className="font-mono text-red-light">{ticketId}</span> закрыт
        </p>
        <div className="mt-1.5 h-1 bg-bg-hover rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-success/60 rounded-full"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration, ease: 'linear' }}
          />
        </div>
      </div>
      <span className="text-xs text-text-muted tabular-nums">{remaining}с</span>
      <Button
        variant="ghost"
        size="sm"
        icon={<Undo2 size={14} />}
        onClick={onUndo}
      >
        Отменить
      </Button>
    </motion.div>
  )
}
