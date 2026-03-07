import { useState } from 'react'
import { motion } from 'framer-motion'
import { ThumbsUp, Check, Eye, Heart } from 'lucide-react'

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

const reactions = [
  { icon: ThumbsUp, label: 'like' },
  { icon: Check, label: 'check' },
  { icon: Eye, label: 'seen' },
  { icon: Heart, label: 'heart' },
]

export default function ChatBubble({ message, isNew, onQuote }) {
  const { from, text, timestamp, isInternal, quotedMessage } = message
  const [activeReactions, setActiveReactions] = useState(new Set())

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center my-2"
      >
        <div className="group px-3 py-1.5 rounded-full bg-bg-hover/50 text-xs text-text-muted text-center max-w-xs">
          {text}
          <span className="ml-2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
            {formatTime(timestamp)}
          </span>
        </div>
      </motion.div>
    )
  }

  const isStaff = from === 'staff'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group flex ${isStaff ? 'justify-end' : 'justify-start'} mb-2 relative`}
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
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm ${
            isInternal
              ? 'bg-warning/10 border border-dashed border-warning/30 text-text-primary'
              : isStaff
                ? 'bg-red-primary/15 text-text-primary rounded-br-md'
                : 'bg-bg-card text-text-primary rounded-bl-md'
          }`}
        >
          {isInternal && (
            <span className="text-[10px] text-warning font-medium uppercase tracking-wider block mb-1">
              Внутренний
            </span>
          )}

          {/* Quoted message */}
          {quotedMessage && (
            <div className="mb-2 pl-2.5 border-l-2 border-red-primary/50 py-1">
              <p className="text-[10px] text-text-muted truncate">{quotedMessage}</p>
            </div>
          )}

          <p className="leading-relaxed">{text}</p>

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
