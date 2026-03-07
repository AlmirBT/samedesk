import { motion } from 'framer-motion'
import { List, AlignJustify, LayoutList } from 'lucide-react'

const modes = [
  { key: 'compact', icon: List, label: 'Compact' },
  { key: 'normal', icon: AlignJustify, label: 'Normal' },
  { key: 'detailed', icon: LayoutList, label: 'Detailed' },
]

export default function DensityToggle({ value, onChange }) {
  return (
    <div className="flex bg-bg-card rounded-lg p-0.5 border border-border">
      {modes.map(m => (
        <button
          key={m.key}
          onClick={() => onChange(m.key)}
          title={m.label}
          className={`relative p-1.5 rounded-md transition-colors cursor-pointer ${
            value === m.key ? 'text-red-light' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {value === m.key && (
            <motion.div
              layoutId="density-indicator"
              className="absolute inset-0 bg-red-primary/15 rounded-md"
              transition={{ duration: 0.2 }}
            />
          )}
          <m.icon size={14} className="relative z-10" />
        </button>
      ))}
    </div>
  )
}
