import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'

export default function LiveActivityBar() {
  const { tickets } = useApp()
  const hasUnread = tickets.some(t => t.unread)

  return (
    <div className="h-[2px] w-full relative bg-bg-deep">
      {hasUnread && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-primary via-red-glow to-red-primary"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}
