import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, UserCheck, Coins, CircleDollarSign, VolumeX, Ban,
  AlertTriangle, FileWarning, Tag, ChevronDown, Plus, X, Check, Link2
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { getStaffById, getTagByName, playerProfiles } from '../../data/mockData'
import Avatar from '../ui/Avatar'
import PlatformIcon from '../ui/PlatformIcon'
import TagChip from '../ui/TagChip'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

const priorityColors = { 0: '#4A5568', 1: '#48BB78', 2: '#ECC94B', 3: '#ED8936', 4: '#E53E3E', 5: '#C53030' }
const priorityLabels = { 0: 'Нет', 1: 'Низкий', 2: 'Средний', 3: 'Повышенный', 4: 'Высокий', 5: 'Критический' }

const problemTypes = [
  'Восстановление', 'Баг', 'Оскорбление', 'Мошенничество',
  'Читерство', 'Гриферство', 'Спам', 'Другое',
]

function Section({ title, icon: Icon, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-1.5 mb-2 cursor-pointer group"
      >
        <Icon size={12} className="text-text-muted group-hover:text-red-light transition-colors" />
        <span className="text-xs text-text-muted uppercase tracking-wider group-hover:text-text-secondary transition-colors">{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }} className="ml-auto">
          <ChevronDown size={10} className="text-text-muted" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ActionButton({ icon: Icon, label, variant = 'default', onClick, active }) {
  const styles = {
    default: 'text-text-secondary hover:bg-bg-hover hover:text-text-primary',
    danger: 'text-red-light/70 hover:bg-red-primary/10 hover:text-red-light',
    warning: 'text-warning/70 hover:bg-warning/10 hover:text-warning',
    success: 'text-success/70 hover:bg-success/10 hover:text-success',
    active: 'bg-red-primary/10 text-red-light',
  }
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs transition-all cursor-pointer ${active ? styles.active : styles[variant]}`}
    >
      <Icon size={14} />
      <span>{label}</span>
    </button>
  )
}

function NumberInputModal({ label, icon: Icon, onSubmit, onCancel }) {
  const [amount, setAmount] = useState('')
  const [isGive, setIsGive] = useState(true)
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="p-3 rounded-lg bg-bg-card border border-border space-y-2">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Icon size={12} />
          <span>{label}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsGive(true)}
            className={`px-2.5 py-1 text-[11px] rounded-md cursor-pointer transition-colors ${isGive ? 'bg-success/15 text-success' : 'text-text-muted hover:bg-bg-hover'}`}
          >
            Выдать
          </button>
          <button
            onClick={() => setIsGive(false)}
            className={`px-2.5 py-1 text-[11px] rounded-md cursor-pointer transition-colors ${!isGive ? 'bg-red-primary/15 text-red-light' : 'text-text-muted hover:bg-bg-hover'}`}
          >
            Забрать
          </button>
        </div>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="Количество..."
          min="1"
          className="w-full bg-bg-hover border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors"
        />
        <div className="flex gap-1.5 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>Отмена</Button>
          <Button
            variant={isGive ? 'primary' : 'danger'}
            size="sm"
            onClick={() => { onSubmit(isGive, Number(amount)); setAmount('') }}
            disabled={!amount || Number(amount) <= 0}
          >
            {isGive ? 'Выдать' : 'Забрать'} {amount || ''}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

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
  const { updateTicketPriority, updateTicketTags, tags, addMessage } = useApp()
  const assignee = ticket.assignedTo ? getStaffById(ticket.assignedTo) : null
  const linkedProfile = playerProfiles.find(p => p.nick === ticket.playerNick)

  // Action panel states
  const [activeAction, setActiveAction] = useState(null)
  const [linkNick, setLinkNick] = useState('')
  const [muteReason, setMuteReason] = useState('')
  const [muteDuration, setMuteDuration] = useState('30')
  const [banReason, setBanReason] = useState('')
  const [incidentName, setIncidentName] = useState('')
  const [incidentIsNew, setIncidentIsNew] = useState(false)
  const [actionLog, setActionLog] = useState([])

  const toggleAction = (action) => {
    setActiveAction(prev => prev === action ? null : action)
  }

  const logAction = (text) => {
    setActionLog(prev => [...prev, { id: Date.now(), text, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) }])
    // Also add as internal system message
    addMessage(ticket.id, {
      id: `msg_sys_${Date.now()}`,
      ticketId: ticket.id,
      from: 'system',
      text,
      attachments: [],
      timestamp: new Date().toISOString(),
      isInternal: true,
    })
  }

  const handleTokens = (isGive, amount) => {
    logAction(`${isGive ? 'Выдано' : 'Забрано'} ${amount} токенов ${isGive ? 'игроку' : 'у игрока'} ${ticket.playerNick}`)
    setActiveAction(null)
  }

  const handleCoins = (isGive, amount) => {
    logAction(`${isGive ? 'Выдано' : 'Забрано'} ${amount} монет ${isGive ? 'игроку' : 'у игрока'} ${ticket.playerNick}`)
    setActiveAction(null)
  }

  const handleMute = () => {
    logAction(`Игрок ${ticket.playerNick} замучен на ${muteDuration} мин. Причина: ${muteReason || 'не указана'}`)
    setMuteReason('')
    setMuteDuration('30')
    setActiveAction(null)
  }

  const handleBan = () => {
    logAction(`Игрок ${ticket.playerNick} заблокирован. Причина: ${banReason || 'не указана'}`)
    setBanReason('')
    setActiveAction(null)
  }

  const handleAddProblem = (type) => {
    const currentTags = [...ticket.tags]
    if (!currentTags.includes(type)) {
      updateTicketTags(ticket.id, [...currentTags, type])
    }
    logAction(`Добавлена проблема: ${type}`)
    setActiveAction(null)
  }

  const handleAddIncident = () => {
    const name = incidentName.trim()
    if (!name) return
    logAction(`${incidentIsNew ? 'Создан новый' : 'Привязан'} инцидент: ${name}`)
    setIncidentName('')
    setIncidentIsNew(false)
    setActiveAction(null)
  }

  const handleLinkNick = () => {
    const nick = linkNick.trim()
    if (!nick) return
    logAction(`Привязан игровой ник: ${nick}`)
    setLinkNick('')
    setActiveAction(null)
  }

  const handleAddTag = (tagName) => {
    const currentTags = [...ticket.tags]
    if (!currentTags.includes(tagName)) {
      updateTicketTags(ticket.id, [...currentTags, tagName])
      logAction(`Добавлен тег: ${tagName}`)
    }
    setActiveAction(null)
  }

  const handleRemoveTag = (tagName) => {
    updateTicketTags(ticket.id, ticket.tags.filter(t => t !== tagName))
  }

  const handlePriorityChange = (p) => {
    updateTicketPriority(ticket.id, p)
    logAction(`Приоритет изменён на ${p}/5 (${priorityLabels[p]})`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full overflow-y-auto p-4 space-y-4 bg-bg-surface/30"
    >
      {/* Status Timeline */}
      <Section title="Статус" icon={Clock}>
        <StatusTimeline ticket={ticket} />
      </Section>

      <div className="h-px bg-border" />

      {/* Link Nick (if no profile linked) */}
      {!linkedProfile && (
        <>
          <Section title="Привязка ника" icon={Link2} defaultOpen={false}>
            <div className="p-3 rounded-lg bg-bg-card border border-border space-y-2">
              <p className="text-[11px] text-warning/80">
                У этого обращения нет привязанного игрового ника
              </p>
              <input
                type="text"
                value={linkNick}
                onChange={e => setLinkNick(e.target.value)}
                placeholder="Введите ник игрока..."
                className="w-full bg-bg-hover border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors"
              />
              <div className="flex justify-end">
                <Button variant="primary" size="sm" onClick={handleLinkNick} disabled={!linkNick.trim()}>
                  Привязать
                </Button>
              </div>
            </div>
          </Section>
          <div className="h-px bg-border" />
        </>
      )}

      {/* Player info (if linked) */}
      {linkedProfile && (
        <>
          <Section title="Игрок" icon={UserCheck}>
            <div className="flex items-center gap-2 mb-2">
              <Avatar nick={linkedProfile.nick} size="sm" />
              <div>
                <p className="text-sm font-medium">{linkedProfile.nick}</p>
                <div className="flex gap-1 mt-0.5">
                  {linkedProfile.labels.map(l => (
                    <Badge key={l} color={l === 'VIP' ? 'yellow' : 'green'} className="text-[9px]">{l}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-md bg-bg-card">
                <span className="text-text-muted block">Наиграно</span>
                <span className="text-text-primary font-mono">{linkedProfile.serverStats.playTime}</span>
              </div>
              <div className="p-2 rounded-md bg-bg-card">
                <span className="text-text-muted block">Был(а)</span>
                <span className="text-text-primary">{linkedProfile.serverStats.lastSeen}</span>
              </div>
            </div>
          </Section>
          <div className="h-px bg-border" />
        </>
      )}

      {/* Priority */}
      <Section title="Приоритет" icon={AlertTriangle}>
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2, 3, 4, 5].map(p => (
            <button
              key={p}
              onClick={() => handlePriorityChange(p)}
              className={`flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-lg text-[11px] font-medium cursor-pointer transition-all ${
                ticket.priority === p
                  ? 'ring-1 ring-offset-1 ring-offset-bg-surface scale-[1.03]'
                  : 'opacity-50 hover:opacity-90'
              }`}
              style={{
                backgroundColor: `${priorityColors[p]}${ticket.priority === p ? '30' : '15'}`,
                color: priorityColors[p],
                ...(ticket.priority === p ? { boxShadow: `0 0 8px ${priorityColors[p]}30` } : {}),
              }}
            >
              <span className="text-base font-bold leading-none">{p}</span>
              <span className="text-[9px] opacity-80 leading-tight">{priorityLabels[p]}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Tags */}
      <Section title="Теги" icon={Tag}>
        <div className="flex flex-wrap gap-1 mb-2">
          <AnimatePresence>
            {ticket.tags.map(tagName => {
              const tag = getTagByName(tagName)
              return <TagChip key={tagName} name={tagName} color={tag?.color} onRemove={() => handleRemoveTag(tagName)} />
            })}
          </AnimatePresence>
          {ticket.tags.length === 0 && <span className="text-xs text-text-muted">Нет тегов</span>}
        </div>
        <div className="relative">
          <button
            onClick={() => toggleAction('tags')}
            className="flex items-center gap-1 text-[11px] text-text-muted hover:text-red-light transition-colors cursor-pointer"
          >
            <Plus size={11} />
            Добавить тег
          </button>
          <AnimatePresence>
            {activeAction === 'tags' && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="mt-1.5 p-2 rounded-lg bg-bg-card border border-border space-y-0.5"
              >
                {tags
                  .filter(t => !ticket.tags.includes(t.name))
                  .map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleAddTag(t.name)}
                      className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-text-secondary hover:bg-bg-hover transition-colors cursor-pointer"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color }} />
                      {t.name}
                    </button>
                  ))
                }
                {tags.filter(t => !ticket.tags.includes(t.name)).length === 0 && (
                  <p className="text-[11px] text-text-muted px-2 py-1">Все теги добавлены</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>

      {/* Assignee */}
      <Section title="Ответственный" icon={UserCheck} defaultOpen={false}>
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
      </Section>

      {/* Platform */}
      <Section title="Платформа" icon={Clock} defaultOpen={false}>
        <div className="flex items-center gap-2">
          <PlatformIcon platform={ticket.platform} size={16} />
          <span className="text-sm capitalize">{ticket.platform}</span>
        </div>
      </Section>

      <div className="h-px bg-border" />

      {/* === ACTIONS === */}
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wider mb-2 flex items-center gap-1.5">
          Действия
        </p>
        <div className="space-y-0.5">
          {/* Tokens */}
          <ActionButton
            icon={Coins}
            label="Токены"
            variant="success"
            onClick={() => toggleAction('tokens')}
            active={activeAction === 'tokens'}
          />
          <AnimatePresence>
            {activeAction === 'tokens' && (
              <NumberInputModal
                label="Токены"
                icon={Coins}
                onSubmit={handleTokens}
                onCancel={() => setActiveAction(null)}
              />
            )}
          </AnimatePresence>

          {/* Coins */}
          <ActionButton
            icon={CircleDollarSign}
            label="Монеты"
            variant="success"
            onClick={() => toggleAction('coins')}
            active={activeAction === 'coins'}
          />
          <AnimatePresence>
            {activeAction === 'coins' && (
              <NumberInputModal
                label="Монеты"
                icon={CircleDollarSign}
                onSubmit={handleCoins}
                onCancel={() => setActiveAction(null)}
              />
            )}
          </AnimatePresence>

          {/* Mute */}
          <ActionButton
            icon={VolumeX}
            label="Замутить"
            variant="warning"
            onClick={() => toggleAction('mute')}
            active={activeAction === 'mute'}
          />
          <AnimatePresence>
            {activeAction === 'mute' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 rounded-lg bg-bg-card border border-border space-y-2">
                  <div className="flex gap-1">
                    {['10', '30', '60', '1440'].map(d => (
                      <button
                        key={d}
                        onClick={() => setMuteDuration(d)}
                        className={`flex-1 py-1 text-[11px] rounded-md cursor-pointer transition-colors ${
                          muteDuration === d ? 'bg-warning/15 text-warning' : 'text-text-muted hover:bg-bg-hover'
                        }`}
                      >
                        {d === '1440' ? '24ч' : `${d}м`}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={muteReason}
                    onChange={e => setMuteReason(e.target.value)}
                    placeholder="Причина..."
                    className="w-full bg-bg-hover border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-warning/50 transition-colors"
                  />
                  <div className="flex gap-1.5 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setActiveAction(null)}>Отмена</Button>
                    <Button variant="danger" size="sm" onClick={handleMute}>Замутить</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ban */}
          <ActionButton
            icon={Ban}
            label="Заблокировать"
            variant="danger"
            onClick={() => toggleAction('ban')}
            active={activeAction === 'ban'}
          />
          <AnimatePresence>
            {activeAction === 'ban' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 rounded-lg bg-bg-card border border-red-primary/20 space-y-2">
                  <p className="text-[11px] text-red-light flex items-center gap-1">
                    <AlertTriangle size={11} />
                    Блокировка игрока на сервере
                  </p>
                  <input
                    type="text"
                    value={banReason}
                    onChange={e => setBanReason(e.target.value)}
                    placeholder="Причина блокировки..."
                    className="w-full bg-bg-hover border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors"
                  />
                  <div className="flex gap-1.5 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setActiveAction(null)}>Отмена</Button>
                    <Button variant="danger" size="sm" onClick={handleBan}>Заблокировать</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Problem */}
          <ActionButton
            icon={FileWarning}
            label="Добавить проблему"
            onClick={() => toggleAction('problem')}
            active={activeAction === 'problem'}
          />
          <AnimatePresence>
            {activeAction === 'problem' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-2 rounded-lg bg-bg-card border border-border space-y-0.5">
                  {problemTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => handleAddProblem(type)}
                      className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-text-secondary hover:bg-bg-hover transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-primary/60" />
                      {type}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add Incident */}
          <ActionButton
            icon={AlertTriangle}
            label="Добавить инцидент"
            onClick={() => toggleAction('incident')}
            active={activeAction === 'incident'}
          />
          <AnimatePresence>
            {activeAction === 'incident' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 rounded-lg bg-bg-card border border-border space-y-2">
                  <div className="flex gap-1">
                    <button
                      onClick={() => setIncidentIsNew(false)}
                      className={`flex-1 py-1 text-[11px] rounded-md cursor-pointer transition-colors ${!incidentIsNew ? 'bg-red-primary/15 text-red-light' : 'text-text-muted hover:bg-bg-hover'}`}
                    >
                      Существующий
                    </button>
                    <button
                      onClick={() => setIncidentIsNew(true)}
                      className={`flex-1 py-1 text-[11px] rounded-md cursor-pointer transition-colors ${incidentIsNew ? 'bg-red-primary/15 text-red-light' : 'text-text-muted hover:bg-bg-hover'}`}
                    >
                      Создать новый
                    </button>
                  </div>
                  <input
                    type="text"
                    value={incidentName}
                    onChange={e => setIncidentName(e.target.value)}
                    placeholder={incidentIsNew ? 'Название инцидента...' : 'Поиск инцидента...'}
                    className="w-full bg-bg-hover border border-border rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors"
                  />
                  {!incidentIsNew && (
                    <div className="space-y-0.5 max-h-24 overflow-y-auto">
                      {['Массовый гриф 15.01', 'Дюп алмазов', 'DDoS атака 12.01'].filter(n =>
                        !incidentName || n.toLowerCase().includes(incidentName.toLowerCase())
                      ).map(name => (
                        <button
                          key={name}
                          onClick={() => { setIncidentName(name) }}
                          className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-xs text-text-secondary hover:bg-bg-hover transition-colors cursor-pointer"
                        >
                          <AlertTriangle size={10} className="text-warning" />
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-1.5 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setActiveAction(null)}>Отмена</Button>
                    <Button variant="primary" size="sm" onClick={handleAddIncident} disabled={!incidentName.trim()}>
                      {incidentIsNew ? 'Создать' : 'Привязать'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action log */}
      <AnimatePresence>
        {actionLog.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-px bg-border mb-3" />
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Журнал действий</p>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {actionLog.slice().reverse().map(log => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 text-[11px]"
                >
                  <span className="text-text-muted shrink-0 font-mono">{log.time}</span>
                  <span className="text-text-secondary">{log.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Created date */}
      <div className="pt-2">
        <p className="text-[10px] text-text-muted text-center">
          Создан {new Date(ticket.createdAt).toLocaleString('ru-RU')}
        </p>
      </div>
    </motion.div>
  )
}
