import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Hash } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const statusLabels = { created: 'Создан', processed: 'Обработан', custom: 'Кастомный' }
const statusColors = { created: 'gray', processed: 'green', custom: 'yellow' }
const statusFilters = ['all', 'created', 'processed', 'custom']

export default function Tags() {
  const { tags } = useApp()
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? tags : tags.filter(t => t.status === filter)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {statusFilters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
                filter === f ? 'bg-red-primary/15 text-red-light' : 'text-text-muted hover:bg-bg-hover'
              }`}
            >
              {f === 'all' ? 'Все' : statusLabels[f]}
            </button>
          ))}
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={16} />}>Создать тег</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((tag, i) => (
            <motion.div
              key={tag.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${tag.color}20` }}
                    >
                      <Hash size={18} style={{ color: tag.color }} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{tag.name}</h4>
                      <p className="text-xs text-text-muted">{tag.ticketCount} обращений</p>
                    </div>
                  </div>
                  <Badge color={statusColors[tag.status]}>{statusLabels[tag.status]}</Badge>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Видимость</p>
                  <div className="flex gap-1 flex-wrap">
                    {tag.roles.map(r => (
                      <span key={r} className="text-xs text-text-secondary bg-bg-hover px-2 py-0.5 rounded">{r}</span>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
