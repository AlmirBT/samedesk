import { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { quickReplies } from '../../data/mockData'

export default function InlineQuickReply({ query, onSelect, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const listRef = useRef(null)

  const filtered = useMemo(() => {
    if (!query) return quickReplies
    const q = query.toLowerCase()
    return quickReplies.filter(r =>
      r.title.toLowerCase().includes(q) || r.text.toLowerCase().includes(q)
    )
  }, [query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter' && filtered.length > 0) {
        e.preventDefault()
        onSelect(filtered[activeIndex].text)
      } else if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [filtered, activeIndex, onSelect, onClose])

  useEffect(() => {
    const activeEl = listRef.current?.children[activeIndex]
    activeEl?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  if (filtered.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="absolute bottom-full left-0 right-0 mb-2 bg-bg-card border border-border rounded-xl shadow-xl overflow-hidden z-20"
      style={{ backdropFilter: 'blur(12px)' }}
    >
      <div className="px-3 py-2 border-b border-border">
        <span className="text-[10px] text-text-muted uppercase tracking-wider">Шаблоны ответов</span>
      </div>
      <div ref={listRef} className="max-h-48 overflow-y-auto py-1">
        {filtered.map((reply, i) => (
          <button
            key={reply.id}
            onClick={() => onSelect(reply.text)}
            className={`w-full text-left px-3 py-2 transition-colors cursor-pointer ${
              i === activeIndex
                ? 'bg-red-primary/10 text-text-primary'
                : 'text-text-secondary hover:bg-bg-hover'
            }`}
          >
            <p className="text-xs font-medium">{reply.title}</p>
            <p className="text-[10px] text-text-muted truncate">{reply.text}</p>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
