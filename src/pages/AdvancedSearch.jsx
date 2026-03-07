import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ArrowLeft, Calendar, Tag, User, MessageCircle,
  Shield, X, RotateCcw, SlidersHorizontal, ChevronDown
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import TicketCard from '../components/tickets/TicketCard'
import PlatformIcon from '../components/ui/PlatformIcon'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { getStaffById } from '../data/mockData'

const statusConfig = [
  { key: 'open', label: 'Открытый', color: 'bg-success' },
  { key: 'in_progress', label: 'В работе', color: 'bg-warning' },
  { key: 'closed', label: 'Закрытый', color: 'bg-text-muted' },
  { key: 'archived', label: 'Архив', color: 'bg-text-muted' },
]

const platformConfig = [
  { key: 'telegram', label: 'Telegram' },
  { key: 'vk', label: 'ВКонтакте' },
  { key: 'discord', label: 'Discord' },
  { key: 'email', label: 'Email' },
]

const priorityConfig = [
  { key: 0, label: 'Нет', color: '#4A5568' },
  { key: 1, label: 'Низкий', color: '#48BB78' },
  { key: 2, label: 'Средний', color: '#ECC94B' },
  { key: 3, label: 'Повышенный', color: '#ED8936' },
  { key: 4, label: 'Высокий', color: '#E53E3E' },
  { key: 5, label: 'Критический', color: '#C53030' },
]

const sortOptions = [
  { key: 'priority_desc', label: 'Приоритет (высокий)' },
  { key: 'priority_asc', label: 'Приоритет (низкий)' },
  { key: 'date_desc', label: 'Дата создания (новые)' },
  { key: 'date_asc', label: 'Дата создания (старые)' },
  { key: 'nick_asc', label: 'Ник (А-Я)' },
  { key: 'nick_desc', label: 'Ник (Я-А)' },
]

function Checkbox({ checked, onChange, children }) {
  return (
    <label className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-bg-hover/50 cursor-pointer transition-colors text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
        checked ? 'bg-red-primary border-red-primary' : 'border-border hover:border-text-muted'
      }`}>
        {checked && (
          <motion.svg initial={{ scale: 0 }} animate={{ scale: 1 }} width="10" height="10" viewBox="0 0 8 8">
            <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        )}
      </div>
      <span className="text-text-secondary">{children}</span>
    </label>
  )
}

function FilterSection({ title, icon: Icon, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="glass-card p-4">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-2 cursor-pointer group"
      >
        <Icon size={16} className="text-red-light" />
        <span className="text-sm font-heading font-medium text-text-primary">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="ml-auto">
          <ChevronDown size={14} className="text-text-muted group-hover:text-text-secondary transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdvancedSearch() {
  const { tickets, tags, staff, pinnedTicketIds, togglePinTicket, selectedTicketIds, toggleTicketSelection } = useApp()
  const navigate = useNavigate()

  // Search criteria state
  const [keyword, setKeyword] = useState('')
  const [playerNick, setPlayerNick] = useState('')
  const [ticketId, setTicketId] = useState('')
  const [messageText, setMessageText] = useState('')
  const [statuses, setStatuses] = useState([])
  const [platforms, setPlatforms] = useState([])
  const [priorities, setPriorities] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [assignees, setAssignees] = useState([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [hasAttachments, setHasAttachments] = useState(false)
  const [sortBy, setSortBy] = useState('priority_desc')

  const toggleArray = useCallback((setter, value) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value])
  }, [])

  const resetAll = () => {
    setKeyword('')
    setPlayerNick('')
    setTicketId('')
    setMessageText('')
    setStatuses([])
    setPlatforms([])
    setPriorities([])
    setSelectedTags([])
    setAssignees([])
    setDateFrom('')
    setDateTo('')
    setUnreadOnly(false)
    setHasAttachments(false)
    setSortBy('priority_desc')
  }

  const hasFilters = keyword || playerNick || ticketId || messageText ||
    statuses.length > 0 || platforms.length > 0 || priorities.length > 0 ||
    selectedTags.length > 0 || assignees.length > 0 || dateFrom || dateTo ||
    unreadOnly || hasAttachments

  // Filter and sort
  const results = useMemo(() => {
    let result = [...tickets]

    // Keyword — searches across nick, id, lastMessage, and all message texts
    if (keyword) {
      const q = keyword.toLowerCase()
      result = result.filter(t =>
        t.playerNick.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.lastMessage.toLowerCase().includes(q) ||
        t.messages.some(m => m.text.toLowerCase().includes(q))
      )
    }

    // Player nick
    if (playerNick) {
      const q = playerNick.toLowerCase()
      result = result.filter(t => t.playerNick.toLowerCase().includes(q))
    }

    // Ticket ID
    if (ticketId) {
      const q = ticketId.toLowerCase()
      result = result.filter(t => t.id.toLowerCase().includes(q))
    }

    // Message content (deep search in all messages)
    if (messageText) {
      const q = messageText.toLowerCase()
      result = result.filter(t =>
        t.messages.some(m => m.text.toLowerCase().includes(q))
      )
    }

    // Status
    if (statuses.length > 0) {
      result = result.filter(t => statuses.includes(t.status))
    }

    // Platform
    if (platforms.length > 0) {
      result = result.filter(t => platforms.includes(t.platform))
    }

    // Priority
    if (priorities.length > 0) {
      result = result.filter(t => priorities.includes(t.priority))
    }

    // Tags
    if (selectedTags.length > 0) {
      result = result.filter(t =>
        selectedTags.some(tag => t.tags.includes(tag))
      )
    }

    // Assignees
    if (assignees.length > 0) {
      result = result.filter(t => assignees.includes(t.assignedTo))
    }

    // Date range
    if (dateFrom) {
      const from = new Date(dateFrom).getTime()
      result = result.filter(t => new Date(t.createdAt).getTime() >= from)
    }
    if (dateTo) {
      const to = new Date(dateTo + 'T23:59:59').getTime()
      result = result.filter(t => new Date(t.createdAt).getTime() <= to)
    }

    // Unread only
    if (unreadOnly) {
      result = result.filter(t => t.unread)
    }

    // Has attachments
    if (hasAttachments) {
      result = result.filter(t =>
        t.messages.some(m => m.attachments && m.attachments.length > 0)
      )
    }

    // Sort
    switch (sortBy) {
      case 'priority_desc': result.sort((a, b) => b.priority - a.priority); break
      case 'priority_asc': result.sort((a, b) => a.priority - b.priority); break
      case 'date_desc': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break
      case 'date_asc': result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break
      case 'nick_asc': result.sort((a, b) => a.playerNick.localeCompare(b.playerNick)); break
      case 'nick_desc': result.sort((a, b) => b.playerNick.localeCompare(a.playerNick)); break
    }

    return result
  }, [tickets, keyword, playerNick, ticketId, messageText, statuses, platforms, priorities, selectedTags, assignees, dateFrom, dateTo, unreadOnly, hasAttachments, sortBy])

  // Active filters count
  const activeCount = [
    keyword, playerNick, ticketId, messageText,
    statuses.length > 0, platforms.length > 0, priorities.length > 0,
    selectedTags.length > 0, assignees.length > 0,
    dateFrom, dateTo, unreadOnly, hasAttachments,
  ].filter(Boolean).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col h-[calc(100vh-7rem)] -m-6"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-bg-surface/50 flex items-center gap-4">
        <button
          onClick={() => navigate('/tickets')}
          className="p-2 rounded-lg hover:bg-bg-hover transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} className="text-text-secondary" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-heading font-bold">Расширенный поиск</h1>
          <p className="text-xs text-text-muted mt-0.5">
            {hasFilters
              ? `Найдено ${results.length} обращений`
              : `Всего ${tickets.length} обращений`
            }
            {activeCount > 0 && (
              <span className="ml-2">
                <Badge color="red">{activeCount} фильтр{activeCount > 1 && activeCount < 5 ? 'а' : activeCount >= 5 ? 'ов' : ''}</Badge>
              </span>
            )}
          </p>
        </div>
        <Button variant="ghost" size="sm" icon={<RotateCcw size={14} />} onClick={resetAll} disabled={!hasFilters}>
          Сбросить
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar — filters */}
        <div className="w-80 shrink-0 border-r border-border overflow-y-auto p-4 space-y-3 bg-bg-surface/30">

          {/* Global keyword */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Search size={16} className="text-red-light" />
              <span className="text-sm font-heading font-medium text-text-primary">Ключевые слова</span>
            </div>
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="Поиск по всему..."
              className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors"
            />
            <p className="text-[10px] text-text-muted mt-1.5">Ник, ID тикета, текст сообщений</p>
          </div>

          {/* Specific fields */}
          <FilterSection title="Поля поиска" icon={SlidersHorizontal} defaultOpen={false}>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-text-muted block mb-1">Ник игрока</label>
                <input
                  type="text"
                  value={playerNick}
                  onChange={e => setPlayerNick(e.target.value)}
                  placeholder="Murka, DragonSlayer..."
                  className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">ID тикета</label>
                <input
                  type="text"
                  value={ticketId}
                  onChange={e => setTicketId(e.target.value)}
                  placeholder="TKT-001"
                  className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">Текст в сообщениях</label>
                <input
                  type="text"
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  placeholder="Поиск по содержимому..."
                  className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors"
                />
              </div>
            </div>
          </FilterSection>

          {/* Date range */}
          <FilterSection title="Даты" icon={Calendar} defaultOpen={false}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-text-muted block mb-1">От</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-red-primary/50 transition-colors [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted block mb-1">До</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-red-primary/50 transition-colors [color-scheme:dark]"
                />
              </div>
            </div>
          </FilterSection>

          {/* Status */}
          <FilterSection title="Статус" icon={Shield} defaultOpen={true}>
            {statusConfig.map(s => (
              <Checkbox
                key={s.key}
                checked={statuses.includes(s.key)}
                onChange={() => toggleArray(setStatuses, s.key)}
              >
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${s.color}`} />
                  {s.label}
                </span>
              </Checkbox>
            ))}
          </FilterSection>

          {/* Platform */}
          <FilterSection title="Платформа" icon={MessageCircle} defaultOpen={false}>
            {platformConfig.map(p => (
              <Checkbox
                key={p.key}
                checked={platforms.includes(p.key)}
                onChange={() => toggleArray(setPlatforms, p.key)}
              >
                <span className="flex items-center gap-2">
                  <PlatformIcon platform={p.key} size={14} />
                  {p.label}
                </span>
              </Checkbox>
            ))}
          </FilterSection>

          {/* Priority */}
          <FilterSection title="Приоритет" icon={SlidersHorizontal} defaultOpen={false}>
            {priorityConfig.map(p => (
              <Checkbox
                key={p.key}
                checked={priorities.includes(p.key)}
                onChange={() => toggleArray(setPriorities, p.key)}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  {p.label}
                </span>
              </Checkbox>
            ))}
          </FilterSection>

          {/* Tags */}
          <FilterSection title="Теги" icon={Tag} defaultOpen={false}>
            {tags.map(t => (
              <Checkbox
                key={t.id}
                checked={selectedTags.includes(t.name)}
                onChange={() => toggleArray(setSelectedTags, t.name)}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                  {t.name}
                </span>
              </Checkbox>
            ))}
          </FilterSection>

          {/* Assignee */}
          <FilterSection title="Ответственный" icon={User} defaultOpen={false}>
            <Checkbox
              checked={assignees.includes(null)}
              onChange={() => toggleArray(setAssignees, null)}
            >
              <span className="text-text-muted italic">Не назначен</span>
            </Checkbox>
            {staff.map(s => (
              <Checkbox
                key={s.id}
                checked={assignees.includes(s.id)}
                onChange={() => toggleArray(setAssignees, s.id)}
              >
                <span className="flex items-center gap-2">
                  <Avatar nick={s.login} size="xs" />
                  {s.firstName} {s.lastName}
                </span>
              </Checkbox>
            ))}
          </FilterSection>

          {/* Additional */}
          <div className="glass-card p-4 space-y-1">
            <Checkbox checked={unreadOnly} onChange={() => setUnreadOnly(p => !p)}>
              Только непрочитанные
            </Checkbox>
            <Checkbox checked={hasAttachments} onChange={() => setHasAttachments(p => !p)}>
              С вложениями
            </Checkbox>
          </div>
        </div>

        {/* Right — results */}
        <div className="flex-1 flex flex-col overflow-hidden bg-bg-base">
          {/* Sort bar + active filters */}
          <div className="px-4 py-3 border-b border-border flex items-center gap-3 flex-wrap">
            <span className="text-xs text-text-muted">Сортировка:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary focus:outline-none focus:border-red-primary/50 transition-colors cursor-pointer"
            >
              {sortOptions.map(o => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>

            {/* Active filter tags */}
            <div className="flex-1 flex flex-wrap gap-1 ml-2">
              {keyword && (
                <ActiveTag label={`"${keyword}"`} onRemove={() => setKeyword('')} />
              )}
              {playerNick && (
                <ActiveTag label={`Ник: ${playerNick}`} onRemove={() => setPlayerNick('')} />
              )}
              {ticketId && (
                <ActiveTag label={`ID: ${ticketId}`} onRemove={() => setTicketId('')} />
              )}
              {messageText && (
                <ActiveTag label={`Сообщение: "${messageText}"`} onRemove={() => setMessageText('')} />
              )}
              {dateFrom && (
                <ActiveTag label={`От: ${dateFrom}`} onRemove={() => setDateFrom('')} />
              )}
              {dateTo && (
                <ActiveTag label={`До: ${dateTo}`} onRemove={() => setDateTo('')} />
              )}
              {statuses.map(s => (
                <ActiveTag key={s} label={statusConfig.find(sc => sc.key === s)?.label} onRemove={() => toggleArray(setStatuses, s)} />
              ))}
              {platforms.map(p => (
                <ActiveTag key={p} label={platformConfig.find(pc => pc.key === p)?.label} onRemove={() => toggleArray(setPlatforms, p)} />
              ))}
              {priorities.map(p => (
                <ActiveTag key={p} label={`P${p}`} onRemove={() => toggleArray(setPriorities, p)} />
              ))}
              {selectedTags.map(t => (
                <ActiveTag key={t} label={t} onRemove={() => toggleArray(setSelectedTags, t)} />
              ))}
              {assignees.map(a => {
                const s = a ? getStaffById(a) : null
                return <ActiveTag key={a || 'null'} label={s ? `${s.firstName} ${s.lastName[0]}.` : 'Не назначен'} onRemove={() => toggleArray(setAssignees, a)} />
              })}
              {unreadOnly && <ActiveTag label="Непрочитанные" onRemove={() => setUnreadOnly(false)} />}
              {hasAttachments && <ActiveTag label="С вложениями" onRemove={() => setHasAttachments(false)} />}
            </div>
          </div>

          {/* Results list */}
          <div className="flex-1 overflow-y-auto p-4">
            {results.length > 0 ? (
              <div className="space-y-2 max-w-3xl mx-auto">
                <AnimatePresence mode="popLayout">
                  {results.map((ticket, i) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    >
                      <TicketCard
                        ticket={ticket}
                        isSelected={false}
                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                        density="normal"
                        isPinned={pinnedTicketIds.includes(ticket.id)}
                        isChecked={selectedTicketIds.has(ticket.id)}
                        onTogglePin={togglePinTicket}
                        onToggleCheck={toggleTicketSelection}
                        bulkMode={false}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-text-muted"
              >
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-heading">
                  {hasFilters ? 'Ничего не найдено' : 'Задайте параметры поиска'}
                </p>
                <p className="text-sm mt-1">
                  {hasFilters
                    ? 'Попробуйте изменить критерии поиска'
                    : 'Используйте фильтры слева для расширенного поиска'
                  }
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function ActiveTag({ label, onRemove }) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-primary/10 text-red-light text-[11px]"
    >
      {label}
      <button onClick={onRemove} className="hover:text-red-primary cursor-pointer">
        <X size={10} />
      </button>
    </motion.span>
  )
}
