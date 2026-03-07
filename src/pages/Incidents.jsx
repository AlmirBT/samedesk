import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, Send, Plus, X, Link2, Unlink, Check,
  Clock, ChevronDown, Search, Megaphone, Shield, CheckCircle,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getStaffById } from '../data/mockData'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Modal from '../components/ui/Modal'

const severityConfig = {
  critical: { label: 'Критический', color: 'red', bg: 'bg-red-primary/15', text: 'text-red-light', border: 'border-red-primary/30' },
  high: { label: 'Высокий', color: 'yellow', bg: 'bg-warning/15', text: 'text-warning', border: 'border-warning/30' },
  medium: { label: 'Средний', color: 'gray', bg: 'bg-text-muted/15', text: 'text-text-secondary', border: 'border-border' },
  low: { label: 'Низкий', color: 'green', bg: 'bg-success/15', text: 'text-success', border: 'border-success/30' },
}

function formatDate(ts) {
  return new Date(ts).toLocaleString('ru-RU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

function IncidentCard({ incident, isSelected, onClick, tickets }) {
  const sev = severityConfig[incident.severity] || severityConfig.medium
  const linkedTickets = incident.linkedTicketIds.map(id => tickets.find(t => t.id === id)).filter(Boolean)
  const openCount = linkedTickets.filter(t => t.status === 'open' || t.status === 'in_progress').length

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`group relative rounded-xl cursor-pointer transition-all border p-4 ${
        isSelected
          ? `${sev.bg} ${sev.border} border`
          : 'bg-bg-card/50 border-transparent hover:bg-bg-hover hover:border-border'
      }`}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className={sev.text} />
          <span className="font-medium text-sm">{incident.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge color={sev.color}>{sev.label}</Badge>
          {incident.status === 'resolved' && (
            <Badge color="green">Решён</Badge>
          )}
        </div>
      </div>
      <p className="text-xs text-text-muted line-clamp-2 mb-2">{incident.description}</p>
      <div className="flex items-center gap-3 text-[10px] text-text-muted">
        <span className="font-mono">{incident.id}</span>
        <span>{formatDate(incident.createdAt)}</span>
        <span className="ml-auto flex items-center gap-1">
          <Link2 size={10} />
          {incident.linkedTicketIds.length} тикетов
          {openCount > 0 && <span className="text-warning">({openCount} открыт.)</span>}
        </span>
      </div>
    </motion.div>
  )
}

function BroadcastEntry({ entry }) {
  const staff = getStaffById(entry.sentBy)
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3 py-3"
    >
      <div className="shrink-0 mt-0.5">
        <div className="w-8 h-8 rounded-full bg-red-primary/10 flex items-center justify-center">
          <Megaphone size={14} className="text-red-light" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium">{staff?.firstName || 'Сотрудник'}</span>
          <span className="text-[10px] text-text-muted">{formatDate(entry.sentAt)}</span>
          <Badge color="gray" className="text-[9px]">{entry.ticketCount} тикетов</Badge>
        </div>
        <div className="bg-bg-card border border-border rounded-lg px-3 py-2 text-sm">
          {entry.text}
        </div>
      </div>
    </motion.div>
  )
}

function LinkedTicketRow({ ticket, onUnlink }) {
  if (!ticket) return null
  const statusLabels = { open: 'Открыт', in_progress: 'В работе', closed: 'Закрыт', archived: 'Архив' }
  const statusColors = { open: 'green', in_progress: 'yellow', closed: 'gray', archived: 'gray' }

  return (
    <div className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-bg-hover/50 transition-colors group">
      <Avatar nick={ticket.playerNick} size="xs" />
      <span className="text-xs font-mono text-text-muted">{ticket.id}</span>
      <span className="text-xs truncate flex-1">{ticket.playerNick}</span>
      <Badge color={statusColors[ticket.status]} className="text-[9px]">{statusLabels[ticket.status]}</Badge>
      <button
        onClick={(e) => { e.stopPropagation(); onUnlink(ticket.id) }}
        className="opacity-0 group-hover:opacity-100 p-0.5 text-text-muted hover:text-red-light transition-all cursor-pointer"
        title="Отвязать тикет"
      >
        <Unlink size={11} />
      </button>
    </div>
  )
}

function CreateIncidentModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('high')

  const handleCreate = () => {
    if (!name.trim()) return
    onCreate({
      name: name.trim(),
      description: description.trim(),
      severity,
      status: 'active',
      createdAt: new Date().toISOString(),
      createdBy: 'staff_1',
      linkedTicketIds: [],
      broadcastLog: [],
    })
    setName('')
    setDescription('')
    setSeverity('high')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Новый инцидент">
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Название</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Краткое описание инцидента..."
            className="w-full bg-bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 focus:ring-1 focus:ring-red-primary/20 transition-colors"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Описание</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Подробности инцидента..."
            rows={3}
            className="w-full bg-bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 focus:ring-1 focus:ring-red-primary/20 transition-colors resize-none"
          />
        </div>
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Критичность</label>
          <div className="flex gap-2">
            {Object.entries(severityConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setSeverity(key)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  severity === key
                    ? `${cfg.bg} ${cfg.text} ring-1 ${cfg.border}`
                    : 'bg-bg-hover text-text-muted hover:text-text-secondary'
                }`}
              >
                {cfg.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Отмена</Button>
          <Button variant="primary" onClick={handleCreate} disabled={!name.trim()}>Создать</Button>
        </div>
      </div>
    </Modal>
  )
}

export default function Incidents() {
  const {
    incidents, tickets, currentUser,
    broadcastToIncident, addIncident, updateIncidentStatus,
    linkTicketToIncident, unlinkTicketFromIncident,
  } = useApp()

  const [selectedId, setSelectedId] = useState(null)
  const [broadcastText, setBroadcastText] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showLinkSearch, setShowLinkSearch] = useState(false)
  const [linkSearch, setLinkSearch] = useState('')
  const [sendAnim, setSendAnim] = useState(false)
  const [filter, setFilter] = useState('all') // all | active | resolved
  const textareaRef = useRef(null)
  const broadcastEndRef = useRef(null)

  const selected = incidents.find(i => i.id === selectedId)
  const sev = selected ? (severityConfig[selected.severity] || severityConfig.medium) : null

  const filteredIncidents = incidents.filter(i => {
    if (filter === 'active') return i.status === 'active'
    if (filter === 'resolved') return i.status === 'resolved'
    return true
  })

  useEffect(() => {
    broadcastEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected?.broadcastLog.length])

  const handleBroadcast = () => {
    if (!broadcastText.trim() || !selectedId || !currentUser) return
    broadcastToIncident(selectedId, broadcastText.trim(), currentUser.id)
    setBroadcastText('')
    setSendAnim(true)
    setTimeout(() => setSendAnim(false), 800)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleBroadcast()
    }
  }

  // Tickets available to link (not already linked to this incident)
  const availableTickets = selected
    ? tickets.filter(t =>
        !selected.linkedTicketIds.includes(t.id) &&
        (linkSearch
          ? t.id.toLowerCase().includes(linkSearch.toLowerCase()) ||
            t.playerNick.toLowerCase().includes(linkSearch.toLowerCase())
          : true
        )
      ).slice(0, 8)
    : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-8rem)] flex gap-4"
    >
      {/* Left: Incident List */}
      <div className="w-[340px] shrink-0 flex flex-col bg-bg-surface/30 rounded-xl border border-border overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b border-border space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-heading font-semibold flex items-center gap-2">
              <Shield size={16} className="text-red-light" />
              Инциденты
              <Badge color="red">{incidents.filter(i => i.status === 'active').length}</Badge>
            </h2>
            <Button variant="ghost" size="sm" icon={<Plus size={14} />} onClick={() => setShowCreateModal(true)}>
              Новый
            </Button>
          </div>
          {/* Filter tabs */}
          <div className="flex gap-1 bg-bg-card rounded-lg p-0.5">
            {[
              { key: 'all', label: 'Все' },
              { key: 'active', label: 'Активные' },
              { key: 'resolved', label: 'Решённые' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`flex-1 py-1.5 text-xs rounded-md cursor-pointer transition-colors ${
                  filter === f.key
                    ? 'bg-red-primary/10 text-red-light font-medium'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          <AnimatePresence>
            {filteredIncidents.map((inc, i) => (
              <motion.div
                key={inc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <IncidentCard
                  incident={inc}
                  isSelected={selectedId === inc.id}
                  onClick={() => setSelectedId(inc.id)}
                  tickets={tickets}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredIncidents.length === 0 && (
            <div className="text-center py-12 text-text-muted text-sm">
              Нет инцидентов
            </div>
          )}
        </div>
      </div>

      {/* Right: Detail + Broadcast */}
      {selected ? (
        <motion.div
          key={selectedId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col bg-bg-surface/30 rounded-xl border border-border overflow-hidden"
        >
          {/* Header */}
          <div className={`p-4 border-b ${sev.border} ${sev.bg}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle size={18} className={sev.text} />
                  <h2 className="text-lg font-heading font-semibold">{selected.name}</h2>
                  <Badge color={sev.color}>{sev.label}</Badge>
                  {selected.status === 'resolved' && <Badge color="green">Решён</Badge>}
                </div>
                <p className="text-sm text-text-secondary">{selected.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-text-muted">
                  <span className="font-mono">{selected.id}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {formatDate(selected.createdAt)}</span>
                  <span>Создал: {getStaffById(selected.createdBy)?.firstName}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {selected.status === 'active' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<CheckCircle size={14} />}
                    onClick={() => updateIncidentStatus(selected.id, 'resolved')}
                  >
                    Решён
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<AlertTriangle size={14} />}
                    onClick={() => updateIncidentStatus(selected.id, 'active')}
                  >
                    Переоткрыть
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Body: two columns */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left: Broadcast log + input */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-border">
              {/* Broadcast log */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Megaphone size={14} className="text-red-light" />
                  <span className="text-xs font-heading font-semibold uppercase tracking-wider text-text-muted">
                    Рассылки ({selected.broadcastLog.length})
                  </span>
                </div>

                {selected.broadcastLog.length === 0 && (
                  <div className="text-center py-8">
                    <Megaphone size={32} className="text-text-muted/30 mx-auto mb-2" />
                    <p className="text-sm text-text-muted">Ещё нет рассылок</p>
                    <p className="text-xs text-text-muted mt-1">Напишите сообщение — оно будет отправлено во все привязанные тикеты</p>
                  </div>
                )}

                <div className="space-y-0 divide-y divide-border/50">
                  {selected.broadcastLog.map(entry => (
                    <BroadcastEntry key={entry.id} entry={entry} />
                  ))}
                </div>
                <div ref={broadcastEndRef} />
              </div>

              {/* Broadcast input */}
              {selected.status === 'active' && (
                <div className="p-4 border-t border-border">
                  <div className="bg-red-primary/5 border border-red-primary/20 rounded-lg px-3 py-2 mb-3 flex items-center gap-2">
                    <Megaphone size={13} className="text-red-light shrink-0" />
                    <span className="text-[11px] text-red-light">
                      Сообщение будет отправлено в {selected.linkedTicketIds.length} тикетов одновременно
                    </span>
                  </div>
                  <div className="flex items-end gap-2">
                    <textarea
                      ref={textareaRef}
                      value={broadcastText}
                      onChange={e => setBroadcastText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Написать всем затронутым игрокам..."
                      rows={2}
                      className="flex-1 bg-bg-card border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:border-red-primary/50 focus:ring-red-primary/20 transition-colors resize-none"
                    />
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleBroadcast}
                        icon={sendAnim ? <Check size={16} /> : <Send size={16} />}
                        disabled={!broadcastText.trim() || selected.linkedTicketIds.length === 0}
                      >
                        Отправить всем
                      </Button>
                    </motion.div>
                  </div>
                  <p className="text-[10px] text-text-muted mt-1.5">Ctrl+Enter для отправки</p>
                </div>
              )}
            </div>

            {/* Right sidebar: Linked tickets */}
            <div className="w-[260px] shrink-0 flex flex-col overflow-hidden">
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-heading font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                    <Link2 size={12} />
                    Привязанные тикеты
                  </span>
                  <span className="text-[10px] text-text-muted">{selected.linkedTicketIds.length}</span>
                </div>
                <button
                  onClick={() => setShowLinkSearch(p => !p)}
                  className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-red-light transition-colors cursor-pointer"
                >
                  <Plus size={11} />
                  Привязать тикет
                </button>
              </div>

              {/* Link search */}
              <AnimatePresence>
                {showLinkSearch && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-b border-border overflow-hidden"
                  >
                    <div className="p-2 space-y-1">
                      <div className="flex items-center gap-1.5 bg-bg-card border border-border rounded-lg px-2 py-1.5">
                        <Search size={12} className="text-text-muted" />
                        <input
                          type="text"
                          value={linkSearch}
                          onChange={e => setLinkSearch(e.target.value)}
                          placeholder="ID или ник..."
                          className="flex-1 bg-transparent text-xs text-text-primary placeholder:text-text-muted focus:outline-none"
                          autoFocus
                        />
                        <button onClick={() => { setShowLinkSearch(false); setLinkSearch('') }} className="text-text-muted hover:text-text-secondary cursor-pointer">
                          <X size={11} />
                        </button>
                      </div>
                      <div className="max-h-32 overflow-y-auto space-y-0.5">
                        {availableTickets.map(t => (
                          <button
                            key={t.id}
                            onClick={() => {
                              linkTicketToIncident(selected.id, t.id)
                              setLinkSearch('')
                            }}
                            className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-text-secondary hover:bg-bg-hover transition-colors cursor-pointer"
                          >
                            <Plus size={10} className="text-success" />
                            <span className="font-mono text-text-muted">{t.id}</span>
                            <span className="truncate">{t.playerNick}</span>
                          </button>
                        ))}
                        {availableTickets.length === 0 && (
                          <p className="text-[11px] text-text-muted text-center py-2">
                            {linkSearch ? 'Не найдено' : 'Все тикеты привязаны'}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Linked ticket list */}
              <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {selected.linkedTicketIds.map(id => {
                  const t = tickets.find(tk => tk.id === id)
                  return (
                    <LinkedTicketRow
                      key={id}
                      ticket={t}
                      onUnlink={(ticketId) => unlinkTicketFromIncident(selected.id, ticketId)}
                    />
                  )
                })}
                {selected.linkedTicketIds.length === 0 && (
                  <div className="text-center py-6 text-text-muted text-xs">
                    Нет привязанных тикетов
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-bg-surface/30 rounded-xl border border-border">
          <div className="text-center">
            <AlertTriangle size={40} className="text-text-muted/20 mx-auto mb-3" />
            <p className="text-text-muted text-sm">Выберите инцидент</p>
            <p className="text-text-muted/60 text-xs mt-1">или создайте новый</p>
          </div>
        </div>
      )}

      <CreateIncidentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={addIncident}
      />
    </motion.div>
  )
}
