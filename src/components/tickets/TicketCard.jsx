import { motion } from 'framer-motion'
import { Star, Check, MessageSquare } from 'lucide-react'
import PriorityBar from '../ui/PriorityBar'
import Avatar from '../ui/Avatar'
import PlatformIcon from '../ui/PlatformIcon'
import TagChip from '../ui/TagChip'
import { getTagByName, getStaffById } from '../../data/mockData'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} мин`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ч`
  return `${Math.floor(hours / 24)} д`
}

export default function TicketCard({ ticket, isSelected, onClick, density = 'normal', isPinned, isChecked, onTogglePin, onToggleCheck, bulkMode }) {
  const assignee = ticket.assignedTo ? getStaffById(ticket.assignedTo) : null
  const showCheckbox = bulkMode || isChecked

  return (
    <motion.div
      layout
      onClick={onClick}
      className={`group relative pl-3 rounded-xl cursor-pointer transition-all ${
        isSelected
          ? 'bg-red-primary/10 border border-red-primary/30 shadow-[0_0_12px_rgba(229,62,62,0.1)]'
          : 'bg-bg-card/50 border border-transparent hover:bg-bg-hover hover:border-border hover:shadow-[0_4px_12px_var(--card-shadow)]'
      } ${density === 'compact' ? 'py-1.5 pr-2' : 'p-3'}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <PriorityBar priority={ticket.priority} />

      <div className="flex items-start gap-2 ml-1">
        {/* Checkbox */}
        <div
          className={`shrink-0 mt-0.5 transition-all ${showCheckbox ? 'w-5 opacity-100' : 'w-0 opacity-0 group-hover:w-5 group-hover:opacity-100'}`}
          onClick={e => { e.stopPropagation(); onToggleCheck?.(ticket.id) }}
        >
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            isChecked ? 'bg-red-primary border-red-primary' : 'border-border hover:border-red-primary/50'
          }`}>
            {isChecked && <Check size={10} className="text-white" />}
          </div>
        </div>

        {/* Avatar (only in detailed mode) */}
        {density === 'detailed' && !ticket.isStaffChat && <Avatar nick={ticket.playerNick} size="sm" />}
        {ticket.isStaffChat && (
          <div className="shrink-0 w-8 h-8 rounded-lg bg-warning/15 flex items-center justify-center mt-0.5">
            <MessageSquare size={14} className="text-warning" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium truncate ${density === 'compact' ? 'text-xs' : 'text-sm'}`}>
              {ticket.playerNick}
            </span>
            {ticket.platform && <PlatformIcon platform={ticket.platform} size={density === 'compact' ? 12 : 14} />}
            <span className="text-[10px] text-text-muted font-mono ml-auto shrink-0">{timeAgo(ticket.createdAt)}</span>
            {ticket.unread && (
              <span className="w-2 h-2 rounded-full bg-red-primary pulse-dot shrink-0" />
            )}
          </div>

          {/* Last message (normal & detailed) */}
          {density !== 'compact' && (
            <p className="text-xs text-text-muted truncate mt-1">{ticket.lastMessage}</p>
          )}

          {/* Tags and meta */}
          {density !== 'compact' && (
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[10px] text-text-muted font-mono">{ticket.id}</span>
              {ticket.tags.slice(0, density === 'detailed' ? 5 : 2).map(tagName => {
                const tag = getTagByName(tagName)
                return <TagChip key={tagName} name={tagName} color={tag?.color} />
              })}
            </div>
          )}

          {/* Assignee (detailed only) */}
          {density === 'detailed' && assignee && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Avatar nick={assignee.login} size="xs" />
              <span className="text-[10px] text-text-muted">{assignee.firstName} {assignee.lastName[0]}.</span>
            </div>
          )}
        </div>

        {/* Pin star (locked for staff chat) */}
        {ticket.isStaffChat ? (
          <div className="shrink-0 p-1 text-warning opacity-60" title="Всегда закреплён">
            <Star size={14} fill="currentColor" />
          </div>
        ) : (
          <button
            onClick={e => { e.stopPropagation(); onTogglePin?.(ticket.id) }}
            className={`shrink-0 p-1 rounded transition-all cursor-pointer ${
              isPinned
                ? 'text-warning opacity-100'
                : 'text-text-muted opacity-0 group-hover:opacity-60 hover:!opacity-100'
            }`}
          >
            <Star size={14} fill={isPinned ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>
    </motion.div>
  )
}
