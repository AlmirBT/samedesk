import { motion } from 'framer-motion'
import { Clock, ChevronDown } from 'lucide-react'
import { getStaffById, getTagByName } from '../../data/mockData'
import Avatar from '../ui/Avatar'
import PlatformIcon from '../ui/PlatformIcon'
import TagChip from '../ui/TagChip'

const priorityColors = { 0: '#4A5568', 1: '#48BB78', 2: '#ECC94B', 3: '#ED8936', 4: '#E53E3E', 5: '#C53030' }

function StatusTimeline({ ticket }) {
  const steps = [
    { label: 'Создан', time: ticket.createdAt, done: true },
    { label: 'В работе', time: ticket.status !== 'open' ? ticket.createdAt : null, done: ticket.status !== 'open' },
    { label: 'Закрыт', time: ticket.status === 'closed' || ticket.status === 'archived' ? ticket.createdAt : null, done: ticket.status === 'closed' || ticket.status === 'archived' },
  ]

  return (
    <div className="space-y-0">
      {steps.map((step, i) => (
        <div key={step.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-2.5 h-2.5 rounded-full mt-1 ${step.done ? 'bg-red-primary' : 'bg-border'}`} />
            {i < steps.length - 1 && (
              <div className={`w-px flex-1 my-1 ${step.done ? 'bg-red-primary/30' : 'bg-border'}`} />
            )}
          </div>
          <div className="pb-3">
            <p className={`text-xs ${step.done ? 'text-text-primary' : 'text-text-muted'}`}>{step.label}</p>
            {step.done && step.time && (
              <p className="text-[10px] text-text-muted mt-0.5">
                {new Date(step.time).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function TicketInfoPanel({ ticket }) {
  const assignee = ticket.assignedTo ? getStaffById(ticket.assignedTo) : null

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto p-4 space-y-5 bg-bg-surface/30"
    >
      {/* Status Timeline */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Clock size={12} /> Статус
        </p>
        <StatusTimeline ticket={ticket} />
      </div>

      <div className="h-px bg-border" />

      {/* Priority */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Приоритет</p>
        <div className="flex items-center gap-2">
          <motion.div
            key={ticket.priority}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: priorityColors[ticket.priority] }}
          />
          <span className="text-sm">{ticket.priority}/5</span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Теги</p>
        <div className="flex flex-wrap gap-1">
          {ticket.tags.map(tagName => {
            const tag = getTagByName(tagName)
            return <TagChip key={tagName} name={tagName} color={tag?.color} />
          })}
          {ticket.tags.length === 0 && <span className="text-xs text-text-muted">Нет тегов</span>}
        </div>
      </div>

      {/* Assignee */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Ответственный</p>
        {assignee ? (
          <div className="flex items-center gap-2">
            <Avatar nick={assignee.login} size="sm" status={assignee.status} />
            <div>
              <p className="text-sm">{assignee.firstName} {assignee.lastName}</p>
              <p className="text-xs text-text-muted">{assignee.roles[0]}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-muted">Не назначен</p>
        )}
      </div>

      {/* Platform */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Платформа</p>
        <div className="flex items-center gap-2">
          <PlatformIcon platform={ticket.platform} size={16} />
          <span className="text-sm capitalize">{ticket.platform}</span>
        </div>
      </div>

      {/* Created */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Создан</p>
        <p className="text-sm">{new Date(ticket.createdAt).toLocaleString('ru-RU')}</p>
      </div>
    </motion.div>
  )
}
