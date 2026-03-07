import { motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function ReplyPreview({ message, onCancel }) {
  if (!message) return null

  const authorLabel = message.from === 'staff' ? 'Сотрудник' : message.from === 'player' ? 'Игрок' : message.from

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-2 flex items-start gap-2 pl-3 border-l-2 border-red-primary py-1"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-red-light font-medium">{authorLabel}</p>
        <p className="text-xs text-text-muted truncate">{message.text}</p>
      </div>
      <button
        onClick={onCancel}
        className="p-0.5 text-text-muted hover:text-text-secondary cursor-pointer shrink-0"
      >
        <X size={12} />
      </button>
    </motion.div>
  )
}
