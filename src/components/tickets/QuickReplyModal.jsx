import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import Modal from '../ui/Modal'
import { quickReplies } from '../../data/mockData'

export default function QuickReplyModal({ isOpen, onClose, onSelect }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return quickReplies
    const q = search.toLowerCase()
    return quickReplies.filter(r =>
      r.title.toLowerCase().includes(q) || r.text.toLowerCase().includes(q)
    )
  }, [search])

  const categories = [...new Set(quickReplies.map(r => r.category))]

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Шаблоны ответов">
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск шаблонов..."
          className="w-full bg-bg-card border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors"
          autoFocus
        />
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {categories.map(cat => {
          const items = filtered.filter(r => r.category === cat)
          if (items.length === 0) return null
          return (
            <div key={cat}>
              <p className="text-xs text-text-muted font-medium uppercase tracking-wider mb-2">{cat}</p>
              <div className="space-y-1">
                {items.map(reply => (
                  <motion.button
                    key={reply.id}
                    whileHover={{ x: 4 }}
                    onClick={() => { onSelect(reply.text); onClose() }}
                    className="w-full text-left p-3 rounded-lg bg-bg-card/50 hover:bg-bg-hover border border-transparent hover:border-border transition-colors cursor-pointer"
                  >
                    <p className="text-sm font-medium text-text-primary">{reply.title}</p>
                    <p className="text-xs text-text-muted mt-1 truncate">{reply.text}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </Modal>
  )
}
