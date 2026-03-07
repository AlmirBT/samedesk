import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import { useApp } from '../../context/AppContext'

export default function ShiftCreateModal({ isOpen, onClose, selectedDate }) {
  const { staff, addShift } = useApp()
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('16:00')
  const [payTokens, setPayTokens] = useState(50)
  const [selectedStaff, setSelectedStaff] = useState([])
  const [search, setSearch] = useState('')

  const filteredStaff = staff.filter(s =>
    !selectedStaff.includes(s.id) &&
    (`${s.firstName} ${s.lastName} ${s.login}`).toLowerCase().includes(search.toLowerCase())
  )

  const toggleStaff = (id) => {
    setSelectedStaff(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }

  const removeStaff = (id) => {
    setSelectedStaff(prev => prev.filter(sid => sid !== id))
  }

  const handleSave = () => {
    if (!name.trim() || selectedStaff.length === 0) return
    addShift({
      name: name.trim(),
      date: selectedDate,
      startTime,
      endTime,
      staff: selectedStaff,
      payTokens: Number(payTokens),
      status: 'scheduled',
    })
    setName('')
    setStartTime('08:00')
    setEndTime('16:00')
    setPayTokens(50)
    setSelectedStaff([])
    setSearch('')
    onClose()
  }

  const inputClass = 'w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm text-text-primary focus:border-red-primary/50 focus:outline-none transition-colors'

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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-muted mb-1">Начало</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Конец</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-muted mb-1">Оплата (токенов)</label>
          <input type="number" value={payTokens} onChange={e => setPayTokens(e.target.value)} min={0} className={inputClass} />
        </div>

        {/* Selected staff */}
        {selectedStaff.length > 0 && (
          <div>
            <label className="block text-xs text-text-muted mb-2">Выбранные сотрудники</label>
            <div className="flex flex-wrap gap-2">
              {selectedStaff.map(id => {
                const s = staff.find(st => st.id === id)
                if (!s) return null
                return (
                  <motion.div
                    key={id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-bg-card border border-border"
                  >
                    <Avatar nick={s.login} size="xs" />
                    <span className="text-xs text-text-primary">{s.firstName}</span>
                    <button onClick={() => removeStaff(id)} className="text-text-muted hover:text-red-light transition-colors cursor-pointer">
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
                onClick={() => toggleStaff(s.id)}
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
