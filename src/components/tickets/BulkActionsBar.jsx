import { motion } from 'framer-motion'
import { UserPlus, Tag, XCircle, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export default function BulkActionsBar() {
  const { selectedTicketIds, clearSelection, updateTicketStatus } = useApp()
  const count = selectedTicketIds.size

  if (count === 0) return null

  const handleCloseSelected = () => {
    selectedTicketIds.forEach(id => updateTicketStatus(id, 'closed'))
    clearSelection()
  }

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-3 rounded-2xl border border-border shadow-2xl"
      style={{
        backgroundColor: 'rgba(30, 30, 30, 0.85)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <span className="text-sm font-medium text-text-primary">
        <span className="text-red-light font-mono">{count}</span> выбрано
      </span>

      <div className="w-px h-5 bg-border" />

      <button
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
      >
        <UserPlus size={14} /> Назначить
      </button>

      <button
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
      >
        <Tag size={14} /> Добавить тег
      </button>

      <button
        onClick={handleCloseSelected}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-light hover:bg-red-primary/10 rounded-lg transition-colors cursor-pointer"
      >
        <XCircle size={14} /> Закрыть
      </button>

      <div className="w-px h-5 bg-border" />

      <button
        onClick={clearSelection}
        className="p-1.5 text-text-muted hover:text-text-secondary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}
