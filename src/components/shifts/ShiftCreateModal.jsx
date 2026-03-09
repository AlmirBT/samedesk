import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X, Clock } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import { useApp } from '../../context/AppContext'

const PRESET_SLOTS = [
  { label: '00-03', start: '00:00', end: '03:00' },
  { label: '03-06', start: '03:00', end: '06:00' },
  { label: '06-09', start: '06:00', end: '09:00' },
  { label: '09-12', start: '09:00', end: '12:00' },
  { label: '12-15', start: '12:00', end: '15:00' },
  { label: '15-18', start: '15:00', end: '18:00' },
  { label: '18-21', start: '18:00', end: '21:00' },
  { label: '21-00', start: '21:00', end: '00:00' },
]

export default function ShiftCreateModal({ isOpen, onClose, selectedDate }) {
  const { staff, addShift } = useApp()
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('16:00')
  const [payTokens, setPayTokens] = useState(50)
  const [selectedStaff, setSelectedStaff] = useState([]) // [{ id, startTime, endTime }]
  const [search, setSearch] = useState('')
  const [activePreset, setActivePreset] = useState(null)

  const selectedIds = selectedStaff.map(s => s.id)
  const filteredStaff = staff.filter(s =>
    !selectedIds.includes(s.id) &&
    (`${s.firstName} ${s.lastName} ${s.login}`).toLowerCase().includes(search.toLowerCase())
  )

  const selectPreset = (preset) => {
    setActivePreset(preset.label)
    setStartTime(preset.start)
    setEndTime(preset.end)
    // Update all selected staff to match new times
    setSelectedStaff(prev => prev.map(s => ({ ...s, startTime: preset.start, endTime: preset.end })))
  }

  const addStaffMember = (id) => {
    setSelectedStaff(prev => [...prev, { id, startTime, endTime }])
  }

  const removeStaffMember = (id) => {
    setSelectedStaff(prev => prev.filter(s => s.id !== id))
  }

  const updateStaffTime = (id, field, value) => {
    setSelectedStaff(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleSave = () => {
    if (!name.trim() || selectedStaff.length === 0) return
    addShift({
      name: name.trim(),
      date: selectedDate,
      startTime,
      endTime,
      staffEntries: selectedStaff.map(s => ({
        staffId: s.id,
        startTime: s.startTime,
        endTime: s.endTime,
        type: 'regular',
      })),
      payTokens: Number(payTokens),
      status: 'scheduled',
    })
    setName('')
    setStartTime('08:00')
    setEndTime('16:00')
    setPayTokens(50)
    setSelectedStaff([])
    setSearch('')
    setActivePreset(null)
    onClose()
  }

  const inputClass = 'w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm text-text-primary focus:border-red-primary/50 focus:outline-none transition-colors'
  const timeInputSmall = 'px-2 py-1 rounded bg-bg-base border border-border text-[11px] font-mono text-text-primary focus:border-red-primary/50 focus:outline-none w-[70px]'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Создать смену">
      <div className="space-y-4">
        <div>
          <label className="block text-xs text-text-muted mb-1">Название</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Например: Утренняя смена"
            className={inputClass}
          />
        </div>

        {/* Preset slots */}
        <div>
          <label className="block text-xs text-text-muted mb-2">
            <Clock size={10} className="inline mr-1" />
            Быстрый выбор слота
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {PRESET_SLOTS.map(p => (
              <motion.button
                key={p.label}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => selectPreset(p)}
                className={`py-1.5 px-2 text-[11px] font-mono rounded-lg border transition-colors cursor-pointer ${
                  activePreset === p.label
                    ? 'bg-red-primary/20 border-red-primary/40 text-red-light'
                    : 'bg-bg-base border-border text-text-secondary hover:border-red-primary/30 hover:text-text-primary'
                }`}
              >
                {p.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-muted mb-1">Начало</label>
            <input
              type="time"
              value={startTime}
              onChange={e => { setStartTime(e.target.value); setActivePreset(null) }}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Конец</label>
            <input
              type="time"
              value={endTime}
              onChange={e => { setEndTime(e.target.value); setActivePreset(null) }}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">Оплата (токенов)</label>
          <input type="number" value={payTokens} onChange={e => setPayTokens(e.target.value)} min={0} className={inputClass} />
        </div>

        {/* Selected staff with individual times */}
        {selectedStaff.length > 0 && (
          <div>
            <label className="block text-xs text-text-muted mb-2">Выбранные сотрудники</label>
            <div className="space-y-1.5">
              {selectedStaff.map(entry => {
                const s = staff.find(st => st.id === entry.id)
                if (!s) return null
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-bg-base/60 border border-border/50"
                  >
                    <Avatar nick={s.login} size="xs" />
                    <span className="text-xs text-text-primary flex-1 truncate">{s.firstName} {s.lastName}</span>
                    <input
                      type="time"
                      value={entry.startTime}
                      onChange={e => updateStaffTime(entry.id, 'startTime', e.target.value)}
                      className={timeInputSmall}
                    />
                    <span className="text-[10px] text-text-muted">—</span>
                    <input
                      type="time"
                      value={entry.endTime}
                      onChange={e => updateStaffTime(entry.id, 'endTime', e.target.value)}
                      className={timeInputSmall}
                    />
                    <button onClick={() => removeStaffMember(entry.id)} className="text-text-muted hover:text-red-light transition-colors cursor-pointer">
                      <X size={12} />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Staff search */}
        <div>
          <label className="block text-xs text-text-muted mb-1">Добавить сотрудников</label>
          <div className="relative mb-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск..."
              className={`${inputClass} pl-8`}
            />
          </div>
          <div className="max-h-[160px] overflow-y-auto space-y-1">
            {filteredStaff.map(s => (
              <motion.button
                key={s.id}
                whileHover={{ x: 2 }}
                onClick={() => addStaffMember(s.id)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-bg-hover transition-colors cursor-pointer text-left"
              >
                <Avatar nick={s.login} size="xs" status={s.status} />
                <span className="text-xs text-text-primary flex-1">{s.firstName} {s.lastName}</span>
                <Badge color="gray">{s.roles[0]}</Badge>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>Отмена</Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!name.trim() || selectedStaff.length === 0}>
            Сохранить смену
          </Button>
        </div>
      </div>
    </Modal>
  )
}
