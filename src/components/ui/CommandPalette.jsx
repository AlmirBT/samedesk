import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Search, LayoutDashboard, MessageSquare, ListTodo, Users,
  Shield, Tag, Clock, Settings, BarChart3, ArrowRight,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

const pages = [
  { id: 'dash', label: 'Дашборд', icon: LayoutDashboard, path: '/', shortcut: 'Ctrl+1' },
  { id: 'tickets', label: 'Обращения', icon: MessageSquare, path: '/tickets', shortcut: 'Ctrl+2' },
  { id: 'tasks', label: 'Задачи', icon: ListTodo, path: '/tasks', shortcut: 'Ctrl+3' },
  { id: 'users', label: 'Пользователи', icon: Users, path: '/users', shortcut: 'Ctrl+4' },
  { id: 'roles', label: 'Роли', icon: Shield, path: '/roles', shortcut: 'Ctrl+5' },
  { id: 'tags', label: 'Теги', icon: Tag, path: '/tags', shortcut: 'Ctrl+6' },
  { id: 'shifts', label: 'Смены', icon: Clock, path: '/shifts', shortcut: 'Ctrl+7' },
  { id: 'stats', label: 'Статистика', icon: BarChart3, path: '/stats', shortcut: 'Ctrl+8' },
  { id: 'settings', label: 'Настройки', icon: Settings, path: '/settings' },
]

export default function CommandPalette({ isOpen, onClose }) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const { tickets, staff } = useApp()

  const results = useMemo(() => {
    if (!query) return pages.map(p => ({ ...p, type: 'page' }))
    const q = query.toLowerCase()
    const items = []

    pages.forEach(p => {
      if (p.label.toLowerCase().includes(q)) items.push({ ...p, type: 'page' })
    })

    tickets.forEach(t => {
      if (t.id.toLowerCase().includes(q) || t.playerNick.toLowerCase().includes(q) || t.lastMessage.toLowerCase().includes(q)) {
        items.push({ id: t.id, label: `${t.playerNick} — ${t.lastMessage.slice(0, 50)}`, icon: MessageSquare, path: '/tickets', type: 'ticket', subtitle: t.id })
      }
    })

    staff.forEach(s => {
      if (s.firstName.toLowerCase().includes(q) || s.lastName.toLowerCase().includes(q) || s.login.toLowerCase().includes(q)) {
        items.push({ id: s.id, label: `${s.firstName} ${s.lastName}`, icon: Users, path: '/users', type: 'staff', subtitle: `@${s.login}` })
      }
    })

    return items.slice(0, 10)
  }, [query, tickets, staff])

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => { setSelectedIndex(0) }, [query])

  const handleSelect = (item) => {
    navigate(item.path)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex(i => Math.min(i + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex(i => Math.max(i - 1, 0)) }
    else if (e.key === 'Enter' && results[selectedIndex]) { handleSelect(results[selectedIndex]) }
    else if (e.key === 'Escape') { onClose() }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center pt-[20vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-lg glass-card !rounded-xl overflow-hidden"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search size={18} className="text-text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Поиск по обращениям, сотрудникам, страницам..."
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
              />
              <kbd className="px-1.5 py-0.5 text-[10px] text-text-muted bg-bg-hover rounded border border-border">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {results.map((item, i) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                      selectedIndex === i ? 'bg-red-primary/10 text-text-primary' : 'text-text-secondary hover:bg-bg-hover'
                    }`}
                  >
                    <Icon size={16} className={selectedIndex === i ? 'text-red-primary' : 'text-text-muted'} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm truncate block">{item.label}</span>
                      {item.subtitle && <span className="text-[10px] text-text-muted font-mono">{item.subtitle}</span>}
                    </div>
                    {item.shortcut && <kbd className="px-1.5 py-0.5 text-[10px] text-text-muted bg-bg-hover rounded border border-border">{item.shortcut}</kbd>}
                    {selectedIndex === i && <ArrowRight size={12} className="text-red-primary" />}
                  </motion.button>
                )
              })}
              {results.length === 0 && (
                <p className="text-center text-text-muted text-sm py-6">Ничего не найдено</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
