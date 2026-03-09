import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, BookOpen, ArrowDown, Check, X, Zap, Pin } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import ChatBubble from './ChatBubble'
import QuickReplyModal from './QuickReplyModal'
import InlineQuickReply from './InlineQuickReply'
import ContextToolbar from './ContextToolbar'
import ActiveViewers from './ActiveViewers'
import QuickModeToggle from './QuickModeToggle'
import ReplyPreview from './ReplyPreview'
import ForwardMessageModal from './ForwardMessageModal'
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

export default function ChatView({ ticket, onOpenPlayerDrawer, onCloseTicket, highlightMessageId }) {
  const { addMessage, updateTicketStatus, currentUser, activeViewers, viewTicket, leaveTicket, quickMode, setQuickMode, getNextPriorityTicket, pinnedTicketIds } = useApp()
  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()
  const [text, setText] = useState('')
  const [showQuickReply, setShowQuickReply] = useState(false)
  const [showTyping, setShowTyping] = useState(false)
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const [sendAnim, setSendAnim] = useState(false)
  const [sendCheckAnim, setSendCheckAnim] = useState(false)
  const [slashQuery, setSlashQuery] = useState(null)
  const [quotedText, setQuotedText] = useState(null)
  const [newMsgId, setNewMsgId] = useState(null)
  const [replyToMessage, setReplyToMessage] = useState(null)
  const [forwardMessage, setForwardMessage] = useState(null)
  const messagesEndRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const textareaRef = useRef(null)

  // Pinned tickets show only internal (staff-only) chat
  const isPinned = pinnedTicketIds.includes(ticket.id)

  // Show all messages or only internal for pinned tickets
  const messages = isPinned
    ? ticket.messages.filter(m => m.isInternal)
    : ticket.messages

  // Detect ! prefix for internal mode (pinned = always internal)
  const isInternalMode = isPinned || text.startsWith('!')

  // Active viewers management
  useEffect(() => {
    viewTicket(ticket.id)
    return () => leaveTicket(ticket.id)
  }, [ticket.id, viewTicket, leaveTicket])

  // Message anchor highlight
  useEffect(() => {
    if (!highlightMessageId) return
    const el = document.querySelector(`[data-msg-id="${highlightMessageId}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    const timer = setTimeout(() => {
      setSearchParams({}, { replace: true })
    }, 2500)
    return () => clearTimeout(timer)
  }, [highlightMessageId, setSearchParams])

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
    const internal = isPinned || text.startsWith('!')
    const msgText = (!isPinned && text.startsWith('!')) ? text.slice(1).trim() : text.trim()
    if (!msgText) return
    const msgId = `msg_${Date.now()}`
    addMessage(ticket.id, {
      id: msgId,
      ticketId: ticket.id,
      from: 'staff',
      ...(ticket.isStaffChat && currentUser?.id ? { staffId: currentUser.id } : {}),
      text: msgText,
      attachments: [],
      timestamp: new Date().toISOString(),
      isInternal: internal,
      quotedMessage: quotedText || undefined,
      replyToMessageId: replyToMessage?.id || undefined,
      replyToMessage: replyToMessage ? { from: replyToMessage.from, text: replyToMessage.text } : undefined,
    })
    setText('')
    setQuotedText(null)
    setReplyToMessage(null)
    setNewMsgId(msgId)
    setTimeout(() => setNewMsgId(null), 2000)

    // Send button animation: Send -> Check
    setSendCheckAnim(true)
    setTimeout(() => setSendCheckAnim(false), 800)

    if (!internal) {
      setSendAnim(true)

      // Quick Mode: auto-navigate to next ticket
      if (quickMode) {
        setTimeout(() => {
          const next = getNextPriorityTicket(ticket.id)
          if (next) {
            navigate('/tickets/' + next.id)
          } else {
            setQuickMode(false)
          }
        }, 300)
      }
    }
  }

  const handleTextChange = (e) => {
    const val = e.target.value
    setText(val)

    // Slash commands: detect / or !/ at start
    const textForSlash = val.startsWith('!') ? val.slice(1) : val
    if (textForSlash.startsWith('/')) {
      setSlashQuery(textForSlash.slice(1))
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
    if (slashQuery !== null) return
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

  const handleCopyLink = (message) => {
    const url = `${window.location.origin}${window.location.pathname}#/tickets/${ticket.id}?msg=${message.id}`
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="flex flex-col h-full min-w-0 relative">
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
        <div className="flex items-center gap-3">
          <ActiveViewers viewers={activeViewers[ticket.id] || []} />
          <QuickModeToggle />
          {ticket.status !== 'closed' && ticket.status !== 'archived' && (
            <Button variant="ghost" size="sm" onClick={() => onCloseTicket?.(ticket.id)}>
              Закрыть
            </Button>
          )}
        </div>
      </div>

      {/* Quick Mode banner */}
      <AnimatePresence>
        {quickMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-primary/8 border-b border-red-primary/20 px-4 py-1.5 flex items-center gap-2 overflow-hidden"
          >
            <Zap size={12} className="text-red-light" fill="currentColor" />
            <span className="text-[11px] text-red-light">Быстрый режим — после ответа автопереход к следующему тикету</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pinned staff-only banner */}
      {isPinned && (
        <div className="bg-warning/8 border-b border-warning/20 px-4 py-1.5 flex items-center gap-2">
          <Pin size={12} className="text-warning" />
          <span className="text-[11px] text-warning">
            {ticket.isStaffChat ? 'Общий чат персонала' : 'Закреплённый диалог — только для персонала'}
          </span>
        </div>
      )}

      {/* Internal mode indicator (! prefix, non-pinned only) */}
      <AnimatePresence>
        {isInternalMode && !isPinned && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-warning/8 border-b border-warning/20 px-4 py-1.5 flex items-center gap-2 overflow-hidden"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
            <span className="text-[11px] text-warning">Внутреннее сообщение — не видно игроку</span>
          </motion.div>
        )}
      </AnimatePresence>

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
              allMessages={ticket.messages}
              isNew={msg.id === newMsgId}
              isHighlighted={msg.id === highlightMessageId}
              onReply={setReplyToMessage}
              onForward={setForwardMessage}
              onCopyLink={handleCopyLink}
              platform={ticket.platform}
              onOpenPlayerDrawer={onOpenPlayerDrawer}
              isStaffChat={ticket.isStaffChat}
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
        {/* Reply preview */}
        <AnimatePresence>
          {replyToMessage && (
            <ReplyPreview message={replyToMessage} onCancel={() => setReplyToMessage(null)} />
          )}
        </AnimatePresence>

        {/* Quoted text preview */}
        <AnimatePresence>
          {quotedText && !replyToMessage && (
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
              placeholder={isPinned ? 'Сообщение для персонала...' : 'Написать ответ... (/ шаблоны, ! внутреннее)'}
              rows={1}
              className={`w-full bg-bg-card border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 transition-colors resize-none ${
                isInternalMode
                  ? 'border-warning/30 focus:border-warning/50 focus:ring-warning/20'
                  : 'border-border focus:border-red-primary/50 focus:ring-red-primary/20'
              }`}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
            <span className="absolute right-3 bottom-1.5 text-[10px] text-text-muted/50">
              {isPinned ? 'персонал' : isInternalMode ? '! внутреннее' : 'Ctrl+Enter'}
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

      <ForwardMessageModal
        isOpen={!!forwardMessage}
        onClose={() => setForwardMessage(null)}
        message={forwardMessage}
      />
    </div>
  )
}
