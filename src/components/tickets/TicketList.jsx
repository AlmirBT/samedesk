import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Pin } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import TicketCard from './TicketCard'
import DensityToggle from './DensityToggle'

const statusFilters = [
  { key: 'all', label: 'Все' },
  { key: 'open', label: 'Открытые' },
  { key: 'in_progress', label: 'В работе' },
  { key: 'closed', label: 'Закрытые' },
]

export default function TicketList({ tickets, selectedId, onSelect }) {
  const {
    pinnedTicketIds, togglePinTicket,
    ticketDensityMode, setTicketDensityMode,
    savedFilters, setSavedFilters,
    selectedTicketIds, toggleTicketSelection,
  } = useApp()

  const search = savedFilters.search
  const statusFilter = savedFilters.status

  const setSearch = (val) => setSavedFilters(prev => ({ ...prev, search: val }))
  const setStatusFilter = (val) => setSavedFilters(prev => ({ ...prev, status: val }))

  const bulkMode = selectedTicketIds.size > 0

  const { pinned, unpinned } = useMemo(() => {
    let result = tickets
    if (statusFilter !== 'all') {
      result = result.filter(t => t.status === statusFilter)
    }
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
  }, [tickets, statusFilter, search, pinnedTicketIds])

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
        density={ticketDensityMode}
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
      {/* Header with search and density */}
      <div className="p-3 border-b border-border flex items-center gap-2">
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
        <DensityToggle value={ticketDensityMode} onChange={setTicketDensityMode} />
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-3 border-b border-border">
        {statusFilters.map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key)}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
              statusFilter === f.key
                ? 'bg-red-primary/15 text-red-light'
                : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
            }`}
          >
            {f.label}
          </button>
        ))}
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
