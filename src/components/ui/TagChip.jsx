import { X } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TagChip({ name, color = '#E53E3E', onRemove, className = '' }) {
  return (
    <motion.span
      layout
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full border ${className}`}
      style={{
        borderColor: `${color}40`,
        backgroundColor: `${color}15`,
        color: color,
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
    >
      {name}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70 cursor-pointer">
          <X size={12} />
        </button>
      )}
    </motion.span>
  )
}
