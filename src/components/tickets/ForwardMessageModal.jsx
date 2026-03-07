import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import PlatformIcon from '../ui/PlatformIcon'

export default function ForwardMessageModal({ isOpen, onClose, message }) {
  const { tickets, addMessage } = useApp()
  const [search, setSearch] = useState('')
  const [selectedTicketId, setSelectedTicketId] = useState(null)
  const [comment, setComment] = useState('')

  const filteredTickets = useMemo(() => {
    if (!search) return tickets.filter(t => t.id !== message?.ticketId).slice(0, 10)
    const q = search.toLowerCase()
    return tickets
      .filter(t =>
        t.id !== message?.ticketId && (
          t.playerNick.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        )
      )
      .slice(0, 10)
  }, [tickets, search, message?.ticketId])

  const handleForward = () => {
    if (!selectedTicketId || !message) return

    addMessage(selectedTicketId, {
      id: `msg_fwd_${Date.now()}`,
      ticketId: selectedTicketId,
      from: 'staff',
      text: message.text,
      attachments: [],
      timestamp: new Date().toISOString(),
      isInternal: false,
      forwardedFrom: message.ticketId,
      forwardComment: comment || undefined,
    })

    setSearch('')
    setSelectedTicketId(null)
    setComment('')
    onClose()
  }

  const handleClose = () => {
    setSearch('')
    setSelectedTicketId(null)
    setComment('')
    onClose()
  }

  if (!message) return null

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Переслать сообщение">
      {/* Message preview */}
      <div className="mb-4 p-3 rounded-lg bg-bg-hover/50 border border-border/50">
        <p className="text-xs text-text-muted mb-1">Сообщение из {message.ticketId}:</p>
        <p className="text-sm text-text-primary line-clamp-3">{message.text}</p>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск тикета..."
          className="w-full bg-bg-card border border-border rounded-lg pl-8 pr-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors"
        />
      </div>

      {/* Ticket list */}
      <div className="max-h-48 overflow-y-auto space-y-1 mb-4">
        {filteredTickets.map(t => (
          <label
            key={t.id}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              selectedTicketId === t.id ? 'bg-red-primary/10 border border-red-primary/30' : 'hover:bg-bg-hover border border-transparent'
            }`}
          >
            <input
              type="radio"
              name="forwardTarget"
              checked={selectedTicketId === t.id}
              onChange={() => setSelectedTicketId(t.id)}
              className="sr-only"
            />
            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
              selectedTicketId === t.id ? 'border-red-primary' : 'border-border'
            }`}>
              {selectedTicketId === t.id && <div className="w-1.5 h-1.5 rounded-full bg-red-primary" />}
            </div>
            <PlatformIcon platform={t.platform} size={14} />
            <div className="flex-1 min-w-0">
              <span className="text-xs text-text-primary">{t.playerNick}</span>
              <span className="text-[10px] text-text-muted ml-2 font-mono">{t.id}</span>
            </div>
          </label>
        ))}
        {filteredTickets.length === 0 && (
          <p className="text-center text-text-muted text-xs py-4">Тикетов не найдено</p>
        )}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        placeholder="Комментарий (необязательно)..."
        rows={2}
        className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors resize-none mb-4"
      />

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={handleClose}>Отмена</Button>
        <Button variant="primary" size="sm" onClick={handleForward} disabled={!selectedTicketId}>
          Переслать
        </Button>
      </div>
    </Modal>
  )
}
