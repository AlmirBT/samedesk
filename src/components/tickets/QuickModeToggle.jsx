import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function QuickModeToggle() {
  const { quickMode, setQuickMode } = useApp()

  return (
    <button
      onClick={() => setQuickMode(prev => !prev)}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
        quickMode
          ? 'bg-red-primary/12 text-red-light'
          : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
      }`}
      title="Быстрый режим — автопереход к следующему тикету после ответа"
    >
      <motion.div
        animate={quickMode ? {
          filter: ['drop-shadow(0 0 2px rgba(229,62,62,0.5))', 'drop-shadow(0 0 6px rgba(229,62,62,0.8))', 'drop-shadow(0 0 2px rgba(229,62,62,0.5))'],
        } : {}}
        transition={quickMode ? { duration: 2, repeat: Infinity } : {}}
      >
        <Zap size={14} fill={quickMode ? 'currentColor' : 'none'} />
      </motion.div>
      <span className="hidden sm:inline">Быстрый</span>
    </button>
  )
}
