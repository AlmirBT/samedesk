import { motion, AnimatePresence } from 'framer-motion'
import { Eye } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Avatar from '../ui/Avatar'

export default function ActiveViewers({ viewers }) {
  const { staff } = useApp()

  const viewerStaff = viewers
    .map(id => staff.find(s => s.id === id))
    .filter(Boolean)

  return (
    <div className="flex items-center gap-2 text-xs text-text-muted">
      <Eye size={14} className="text-text-muted" />
      <span className="text-text-muted">
        {viewerStaff.length > 0 ? 'Просматривают:' : 'Только вы'}
      </span>
      <div className="flex -space-x-1.5">
        <AnimatePresence>
          {viewerStaff.map(s => (
            <motion.div
              key={s.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              title={`${s.firstName} ${s.lastName}`}
            >
              <Avatar nick={s.login} size="xs" status={s.status} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
