import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: 'border-success/50 text-success',
  error: 'border-red-primary/50 text-red-light',
  warning: 'border-warning/50 text-warning',
  info: 'border-text-muted/50 text-text-secondary',
}

export function ToastItem({ toast, onRemove }) {
  const Icon = icons[toast.type] || icons.info

  return (
    <motion.div
      layout
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`glass-card flex items-center gap-3 px-4 py-3 min-w-[280px] border-l-2 ${colors[toast.type] || colors.info}`}
    >
      <Icon size={18} className="shrink-0" />
      <span className="text-sm text-text-primary flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-text-muted hover:text-text-primary shrink-0 cursor-pointer"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}
