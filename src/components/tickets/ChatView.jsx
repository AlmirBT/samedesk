import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, BookOpen, ArrowDown, Check, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import ChatBubble from './ChatBubble'
import QuickReplyModal from './QuickReplyModal'
import InlineQuickReply from './InlineQuickReply'
import ContextToolbar from './ContextToolbar'
import Avatar from '../ui/Avatar'
import PlatformIcon from '../ui/PlatformIcon'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

const statusLabels = { open: 'Открыт', in_progress: 'В работе', closed: 'Закрыт', archived: 'Архив' }
const statusColors = { open: 'green', in_progress: 'yellow', closed: 'gray', archived: 'gray' }

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex items-center gap-2 px-4 py-2"
    >
      <div className="flex gap-1 bg-bg-hover rounded-xl px-3 py-2">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-text-muted"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span className="text-xs text-text-muted">печатает...</span>
    </motion.div>
  )
}

export default function ChatView({ ticket, onOpenPlayerDrawer }) {
  const { addMessage, updateTicketStatus, currentUser } = useApp()
  const [text, setText] = useState('')
  const [showInternal, setShowInternal] = useState(false)
  const [showQuickReply, setShowQuickReply] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [sendAnim, setSendAnim] = useState(false)
  const [sendCheckAnim, setSendCheckAnim] = useState(false)
  const [slashQuery, setSlashQuery] = useState(null)
  const [quotedText, setQuotedText] = useState(null)
  const [newMsgId, setNewMsgId] = useState(null)
  const [takeWorkFlash, setTakeWorkFlash] = useState(false)
  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const textareaRef = useRef(null)

  const messages = ticket.messages.filter(m => showInternal ? m.isInternal : !m.isInternal)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages.length, scrollToBottom])

  useEffect(() => {
    if (sendAnim) {
      const t1 = setTimeout(() => setShowTyping(true), 800)
      const t2 = setTimeout(() => setShowTyping(false), 2500)
      const t3 = setTimeout(() => setSendAnim(false), 2500)
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }
  }, [sendAnim])

  const handleScroll = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100
    setShowScrollBtn(!isNearBottom)
  }

  const handleSend = () => {
    if (!text.trim()) return
    const msgId = `msg_${Date.now()}`
    addMessage(ticket.id, {
      id: msgId,
      ticketId: ticket.id,
      from: 'staff',
      text: text.trim(),
      attachments: [],
      timestamp: new Date().toISOString(),
      isInternal: showInternal,
      quotedMessage: quotedText,
    })
    setText('')
    setQuotedText(null)
    setNewMsgId(msgId)
    setTimeout(() => setNewMsgId(null), 2000)

    // Send button animation: Send -> Check
    setSendCheckAnim(true)
    setTimeout(() => setSendCheckAnim(false), 800)

    if (!showInternal) setSendAnim(true)
  }

  const handleTextChange = (e) => {
    const val = e.target.value
    setText(val)

    // Slash command detection
    if (val.startsWith('/')) {
      setSlashQuery(val.slice(1))
    } else {
      setSlashQuery(null)
    }
  }

  const handleSlashSelect = (replyText) => {
    setText(replyText)
    setSlashQuery(null)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (slashQuery !== null) return // let InlineQuickReply handle keys
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSend()
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuote = (selectedText) => {
    setQuotedText(selectedText)
    textareaRef.current?.focus()
  }

  const handleTakeWork = () => {
    updateTicketStatus(ticket.id, 'in_progress')
    setTakeWorkFlash(true)
    setTimeout(() => setTakeWorkFlash(false), 1000)
  }

  return (
    <div className={`flex flex-col h-full min-w-0 relative transition-shadow duration-1000 ${
      takeWorkFlash ? 'shadow-[inset_0_0_30px_rgba(229,62,62,0.15)]' : ''
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between bg-bg-surface/50">
        <div className="flex items-center gap-3">
          <Avatar nick={ticket.playerNick} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenPlayerDrawer?.(ticket.playerNick)}
                className="font-medium hover:text-red-light transition-colors cursor-pointer"
              >
                {ticket.playerNick}
              </button>
              <PlatformIcon platform={ticket.platform} size={16} />
              <Badge color={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
            </div>
            <span className="text-xs text-text-muted font-mono">{ticket.id}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {ticket.status === 'open' && (
            <Button variant="secondary" size="sm" onClick={handleTakeWork}>
              Взять в работу
            </Button>
          )}
          {ticket.status === 'in_progress' && (
            <Button variant="ghost" size="sm" onClick={() => updateTicketStatus(ticket.id, 'closed')}>
              Закрыть
            </Button>
          )}
        </div>
      </div>

      {/* Chat toggle */}
      <div className="flex gap-1 px-4 pt-3">
        <button
          onClick={() => setShowInternal(false)}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
            !showInternal ? 'bg-red-primary/15 text-red-light' : 'text-text-muted hover:bg-bg-hover'
          }`}
        >
          Чат
        </button>
        <button
          onClick={() => setShowInternal(true)}
          className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${
            showInternal ? 'bg-warning/15 text-warning' : 'text-text-muted hover:bg-bg-hover'
          }`}
        >
          Внутренний
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-1 relative"
      >
        <ContextToolbar containerRef={scrollContainerRef} onQuote={handleQuote} />

        <AnimatePresence>
          {messages.map(msg => (
            <ChatBubble
              key={msg.id}
              message={msg}
              isNew={msg.id === newMsgId}
            />
          ))}
        </AnimatePresence>
        <AnimatePresence>
          {showTyping && <TypingIndicator />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToBottom}
            className="absolute bottom-24 right-8 p-2 rounded-full bg-bg-card border border-border shadow-lg hover:bg-bg-hover transition-colors cursor-pointer z-10"
          >
            <ArrowDown size={16} className="text-text-secondary" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="p-4 border-t border-border">
        {/* Quoted text preview */}
        <AnimatePresence>
          {quotedText && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2 flex items-start gap-2 pl-3 border-l-2 border-red-primary/50 py-1"
            >
              <p className="text-xs text-text-muted flex-1 truncate">{quotedText}</p>
              <button
                onClick={() => setQuotedText(null)}
                className="p-0.5 text-text-muted hover:text-text-secondary cursor-pointer"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 relative">
          <div className="flex-1 relative">
            {/* Inline quick reply dropdown */}
            <AnimatePresence>
              {slashQuery !== null && (
                <InlineQuickReply
                  query={slashQuery}
                  onSelect={handleSlashSelect}
                  onClose={() => setSlashQuery(null)}
                />
              )}
            </AnimatePresence>

            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder={showInternal ? 'Внутренний комментарий...' : 'Написать ответ... (/ для шаблонов)'}
              rows={1}
              className={`w-full bg-bg-card border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors resize-none ${
                showInternal
                  ? 'border-warning/30 focus:border-warning/50 focus:ring-warning/20'
                  : 'border-border focus:border-red-primary/50 focus:ring-red-primary/20'
              }`}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <span className="absolute right-3 bottom-1.5 text-[10px] text-text-muted/50">
              Ctrl+Enter
            </span>
          </div>
          <Button
            variant="ghost"
            size="md"
            onClick={() => setShowQuickReply(true)}
            icon={<BookOpen size={16} />}
            className="shrink-0"
          />
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="shrink-0"
          >
            <Button
              variant="primary"
              size="md"
              onClick={handleSend}
              icon={sendCheckAnim ? <Check size={16} /> : <Send size={16} />}
              disabled={!text.trim()}
            />
          </motion.div>
        </div>
      </div>

      <QuickReplyModal
        isOpen={showQuickReply}
        onClose={() => setShowQuickReply(false)}
        onSelect={t => setText(prev => prev + t)}
      />
    </div>
  )
}
