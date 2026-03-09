import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, Check, Eye, Heart } from 'lucide-react'
import MessageToolbar from './MessageToolbar'
import { playerProfiles, getStaffById } from '../../data/mockData'

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

const reactions = [
  { icon: ThumbsUp, label: 'like' },
  { icon: Check, label: 'check' },
  { icon: Eye, label: 'seen' },
  { icon: Heart, label: 'heart' },
]

// Build a case-insensitive lookup of known player nicks
const knownNicksLower = new Map(
  playerProfiles.map(p => [p.nick.toLowerCase(), p.nick])
)

// Parse text and make known player nicks clickable
function renderTextWithNicks(text, onNickClick) {
  // Match sequences of latin letters, digits, underscores (2+ chars) — typical game nicks
  const regex = /[A-Za-z][A-Za-z0-9_]{1,}/g
  const parts = []
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    const word = match[0]
    const originalNick = knownNicksLower.get(word.toLowerCase())
    if (!originalNick) continue

    // Add text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    // Add clickable nick
    parts.push(
      <button
        key={match.index}
        onClick={(e) => { e.stopPropagation(); onNickClick(originalNick) }}
        className="text-red-light hover:text-red-accent hover:underline cursor-pointer font-medium transition-colors"
      >
        {word}
      </button>
    )
    lastIndex = match.index + word.length
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

export default function ChatBubble({ message, allMessages = [], isNew, isHighlighted, onReply, onForward, onCopyLink, platform, onOpenPlayerDrawer, isStaffChat }) {
  const { from, text, timestamp, isInternal, quotedMessage, forwardedFrom, replyToMessage, staffId } = message
  const staffMember = isStaffChat && staffId ? getStaffById(staffId) : null
  const [activeReactions, setActiveReactions] = useState(new Set())
  const [hovered, setHovered] = useState(false)

  const toggleReaction = (label) => {
    setActiveReactions(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  if (from === 'system' || from === 'bot') {
    return (
      <motion.div
        data-msg-id={message.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex justify-center my-2 ${isHighlighted ? 'msg-anchor-highlight' : ''}`}
      >
        <div className="group px-3 py-1.5 rounded-full bg-bg-hover/50 text-xs text-text-muted text-center max-w-xs">
          {onOpenPlayerDrawer ? renderTextWithNicks(text, onOpenPlayerDrawer) : text}
          <span className="ml-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(timestamp)}
          </span>
        </div>
      </motion.div>
    )
  }

  const isStaff = from === 'staff'

  // Find reply-to message for preview
  const replyOriginal = message.replyToMessageId
    ? allMessages.find(m => m.id === message.replyToMessageId)
    : null

  return (
    <motion.div
      data-msg-id={message.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex ${isStaff ? 'justify-end' : 'justify-start'} mb-2 relative ${isHighlighted ? 'msg-anchor-highlight' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* New message highlight */}
      {isNew && (
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 rounded-2xl bg-red-primary/10 pointer-events-none"
        />
      )}

      <div className="relative max-w-[75%]">
        {/* Message Toolbar */}
        <AnimatePresence>
          {hovered && onReply && (
            <MessageToolbar
              message={message}
              onReply={() => onReply(message)}
              onForward={() => onForward(message)}
              onCopyLink={() => onCopyLink(message)}
              platform={platform}
              isStaff={isStaff}
            />
          )}
        </AnimatePresence>

        <div
          className={`px-4 py-2.5 rounded-2xl text-sm ${
            isInternal
              ? 'bg-warning/10 border border-dashed border-warning/30 text-text-primary'
              : isStaff
                ? 'bg-red-primary/15 text-text-primary rounded-br-md'
                : 'bg-bg-card text-text-primary rounded-bl-md'
          }`}
        >
          {isInternal && !isStaffChat && (
            <span className="text-[10px] text-warning font-medium uppercase tracking-wider block mb-1">
              Внутренний
            </span>
          )}

          {staffMember && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[11px] font-semibold text-text-primary">
                {staffMember.firstName} {staffMember.lastName[0]}.
              </span>
              <span className="text-[10px] text-text-muted">
                {staffMember.roles[0]}
              </span>
            </div>
          )}

          {/* Forwarded header */}
          {forwardedFrom && (
            <div className="mb-2 flex items-center gap-1.5 text-[10px] text-text-muted">
              <span>Переслано из</span>
              <a
                href={`#/tickets/${forwardedFrom}`}
                className="font-mono text-red-light hover:underline"
              >
                {forwardedFrom}
              </a>
            </div>
          )}

          {/* Reply-to preview */}
          {(replyOriginal || replyToMessage) && (
            <div
              className="mb-2 pl-2.5 border-l-2 border-red-primary/50 py-1 cursor-pointer hover:bg-red-primary/5 rounded-r-md transition-colors"
              onClick={() => {
                if (message.replyToMessageId) {
                  const el = document.querySelector(`[data-msg-id="${message.replyToMessageId}"]`)
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              }}
            >
              <p className="text-[10px] text-red-light font-medium">
                {(replyOriginal || replyToMessage)?.from === 'staff' ? 'Сотрудник' : 'Игрок'}
              </p>
              <p className="text-[10px] text-text-muted truncate">
                {(replyOriginal || replyToMessage)?.text}
              </p>
            </div>
          )}

          {/* Quoted message (from text selection) */}
          {quotedMessage && !replyToMessage && (
            <div className="mb-2 pl-2.5 border-l-2 border-red-primary/50 py-1">
              <p className="text-[10px] text-text-muted truncate">{quotedMessage}</p>
            </div>
          )}

          <p className="leading-relaxed">
            {onOpenPlayerDrawer ? renderTextWithNicks(text, onOpenPlayerDrawer) : text}
          </p>

          {/* Timestamp — visible on hover */}
          <p className={`text-[10px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
            isStaff ? 'text-red-accent/60' : 'text-text-muted'
          }`}>
            {formatTime(timestamp)}
          </p>
        </div>

        {/* Reactions — visible on hover */}
        <div className={`absolute -bottom-1 ${isStaff ? 'right-2' : 'left-2'} flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity`}>
          {reactions.map(r => (
            <button
              key={r.label}
              onClick={() => toggleReaction(r.label)}
              className={`p-1 rounded-full transition-all cursor-pointer ${
                activeReactions.has(r.label)
                  ? 'bg-red-primary/20 text-red-light scale-110'
                  : 'bg-bg-card/80 text-text-muted hover:text-text-secondary hover:bg-bg-hover'
              }`}
              style={{ backdropFilter: 'blur(4px)' }}
            >
              <r.icon size={10} />
            </button>
          ))}
        </div>

        {/* Active reactions display */}
        {activeReactions.size > 0 && (
          <div className={`flex gap-0.5 mt-1 ${isStaff ? 'justify-end' : 'justify-start'}`}>
            {reactions.filter(r => activeReactions.has(r.label)).map(r => (
              <motion.span
                key={r.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-bg-card border border-border text-[10px] text-text-muted"
              >
                <r.icon size={9} />
              </motion.span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
