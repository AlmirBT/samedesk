import { useMemo, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Pin, SlidersHorizontal } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TicketCard from './TicketCard'
import FilterPanel from './FilterPanel'

export default function TicketList({ tickets, selectedId, onSelect }) {
  const {
    pinnedTicketIds, togglePinTicket,
    savedFilters, setSavedFilters,
    selectedTicketIds, toggleTicketSelection,
    tags,
  } = useApp()
  const [showFilters, setShowFilters] = useState(false)
  const filterRef = useRef(null)

  const search = savedFilters.search || ''
  const { statuses = [], platforms = [], departments = [] } = savedFilters

  const setSearch = (val) => setSavedFilters(prev => ({ ...prev, search: val }))

  const bulkMode = selectedTicketIds.size > 0
  const hasActiveFilters = (savedFilters.statuses?.length > 0) || (savedFilters.platforms?.length > 0) || (savedFilters.departments?.length > 0)

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilters(false)
      }
    }
    if (showFilters) {
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }
  }, [showFilters])

  const { pinned, unpinned } = useMemo(() => {
    let result = tickets

    // Multi-select status filter
    if (statuses.length > 0) {
      result = result.filter(t => statuses.includes(t.status))
    }

    // Platform filter
    if (platforms.length > 0) {
      result = result.filter(t => platforms.includes(t.platform))
    }

    // Department filter
    if (departments.length > 0) {
      result = result.filter(t =>
        t.tags.some(tagName => {
          const tag = tags.find(tg => tg.name === tagName)
          return tag?.roles?.some(r => departments.includes(r))
        })
      )
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.playerNick.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.lastMessage.toLowerCase().includes(q)
      )
    }

    const sorted = result.sort((a, b) => {
      if (a.unread !== b.unread) return a.unread ? -1 : 1
      return b.priority - a.priority
    })

    const pinnedItems = sorted.filter(t => pinnedTicketIds.includes(t.id))
    const unpinnedItems = sorted.filter(t => !pinnedTicketIds.includes(t.id))

    return { pinned: pinnedItems, unpinned: unpinnedItems }
  }, [tickets, statuses, platforms, departments, search, pinnedTicketIds, tags])

  const renderCard = (ticket, i) => (
    <motion.div
      key={ticket.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ x: 100, opacity: 0 }}
      transition={{ delay: i * 0.03 }}
    >
      <TicketCard
        ticket={ticket}
        isSelected={selectedId === ticket.id}
        onClick={() => onSelect(ticket.id)}
        density="normal"
        isPinned={pinnedTicketIds.includes(ticket.id)}
        isChecked={selectedTicketIds.has(ticket.id)}
        onTogglePin={togglePinTicket}
        onToggleCheck={toggleTicketSelection}
        bulkMode={bulkMode}
      />
    </motion.div>
  )

  return (
    <div className="flex flex-col h-full">
      {/* Header with search and filters dropdown */}
      <div className="p-3 border-b border-border flex items-center gap-2 relative" ref={filterRef}>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск обращений..."
            className="w-full bg-bg-card border border-border rounded-lg pl-8 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowFilters(prev => !prev)}
          className={`relative p-2 rounded-lg border transition-colors cursor-pointer shrink-0 ${
            showFilters
              ? 'border-red-primary/50 bg-red-primary/10 text-red-light'
              : 'border-border hover:bg-bg-hover hover:border-red-primary/30 text-text-muted'
          }`}
          title="Фильтры"
        >
          <SlidersHorizontal size={14} />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-primary border-2 border-bg-surface" />
          )}
        </button>

        {/* Filters dropdown */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-3 mt-1 w-72 z-50 bg-bg-card/95 backdrop-blur-xl border border-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden"
            >
              <FilterPanel tickets={tickets} onClose={() => setShowFilters(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {/* Pinned section */}
        {pinned.length > 0 && (
          <>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Pin size={10} className="text-warning" />
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Закреплённые</span>
              <div className="flex-1 h-px bg-gradient-to-r from-warning/20 to-transparent" />
            </div>
            <AnimatePresence mode="popLayout">
              {pinned.map((ticket, i) => renderCard(ticket, i))}
            </AnimatePresence>
            <div className="h-px my-2 bg-gradient-to-r from-border via-border/50 to-transparent" />
          </>
        )}

        {/* Regular tickets */}
        <AnimatePresence mode="popLayout">
          {unpinned.map((ticket, i) => renderCard(ticket, i))}
        </AnimatePresence>

        {pinned.length === 0 && unpinned.length === 0 && (
          <p className="text-center text-text-muted text-sm py-8">Обращений не найдено</p>
        )}
      </div>
    </div>
  )
}
