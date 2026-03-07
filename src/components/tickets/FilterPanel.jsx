import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X, RotateCcw } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import PlatformIcon from '../ui/PlatformIcon'

const statusConfig = [
  { key: 'open', label: 'Открытые', color: 'bg-success' },
  { key: 'in_progress', label: 'В работе', color: 'bg-warning' },
  { key: 'closed', label: 'Закрытые', color: 'bg-text-muted' },
  { key: 'archived', label: 'Архив', color: 'bg-text-muted' },
]

const platformConfig = [
  { key: 'telegram', label: 'Telegram' },
  { key: 'vk', label: 'ВКонтакте' },
  { key: 'discord', label: 'Discord' },
  { key: 'email', label: 'Email' },
]

function FilterSection({ title, isOpen, onToggle, children }) {
  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
      >
        <span className="uppercase tracking-wider font-medium">{title}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-2 space-y-0.5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Checkbox({ checked, onChange, children, count }) {
  return (
    <label className="flex items-center gap-2 py-1 px-1 rounded-md hover:bg-bg-hover/50 cursor-pointer transition-colors text-xs">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors shrink-0 ${
        checked ? 'bg-red-primary border-red-primary' : 'border-border hover:border-text-muted'
      }`}>
        {checked && (
          <motion.svg
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            width="8" height="8" viewBox="0 0 8 8"
          >
            <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        )}
      </div>
      <span className="flex-1 text-text-secondary">{children}</span>
      {count !== undefined && (
        <span className="text-text-muted text-[10px] tabular-nums">{count}</span>
      )}
    </label>
  )
}

export default function FilterPanel({ tickets }) {
  const { savedFilters, setSavedFilters, tags, currentUser } = useApp()
  const [openSections, setOpenSections] = useState({ status: true, departments: false, platform: false })

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const { statuses = [], platforms = [], departments = [] } = savedFilters

  const toggleFilter = (group, value) => {
    setSavedFilters(prev => {
      const arr = prev[group] || []
      const next = arr.includes(value)
        ? arr.filter(v => v !== value)
        : [...arr, value]
      return { ...prev, [group]: next }
    })
  }

  // Compute counts with cross-filter awareness
  const counts = useMemo(() => {
    const statusCounts = {}
    const platformCounts = {}
    const departmentCounts = {}

    statusConfig.forEach(s => { statusCounts[s.key] = 0 })
    platformConfig.forEach(p => { platformCounts[p.key] = 0 })

    // Get unique departments from tags
    const allDepts = [...new Set(tags.flatMap(t => t.roles || []))]
    allDepts.forEach(d => { departmentCounts[d] = 0 })

    tickets.forEach(t => {
      // For status counts: apply platform + department filters
      const matchesPlatform = platforms.length === 0 || platforms.includes(t.platform)
      const matchesDept = departments.length === 0 || t.tags.some(tagName => {
        const tag = tags.find(tg => tg.name === tagName)
        return tag?.roles?.some(r => departments.includes(r))
      })
      if (matchesPlatform && matchesDept) {
        statusCounts[t.status] = (statusCounts[t.status] || 0) + 1
      }

      // For platform counts: apply status + department filters
      const matchesStatus = statuses.length === 0 || statuses.includes(t.status)
      if (matchesStatus && matchesDept) {
        platformCounts[t.platform] = (platformCounts[t.platform] || 0) + 1
      }

      // For department counts: apply status + platform filters
      if (matchesStatus && matchesPlatform) {
        t.tags.forEach(tagName => {
          const tag = tags.find(tg => tg.name === tagName)
          tag?.roles?.forEach(r => {
            departmentCounts[r] = (departmentCounts[r] || 0) + 1
          })
        })
      }
    })

    return { statusCounts, platformCounts, departmentCounts }
  }, [tickets, statuses, platforms, departments, tags])

  // Departments available to current user
  const availableDepts = useMemo(() => {
    const allDepts = [...new Set(tags.flatMap(t => t.roles || []))]
    if (!currentUser) return allDepts
    // Admin sees all
    if (currentUser.roles.includes('Администратор')) return allDepts
    return allDepts.filter(d => currentUser.roles.includes(d))
  }, [tags, currentUser])

  const hasActiveFilters = statuses.length > 0 || platforms.length > 0 || departments.length > 0

  const resetFilters = () => {
    setSavedFilters(prev => ({ ...prev, statuses: [], platforms: [], departments: [] }))
  }

  return (
    <div className="border-b border-border">
      <FilterSection title="Статус" isOpen={openSections.status} onToggle={() => toggleSection('status')}>
        {statusConfig.map(s => (
          <Checkbox
            key={s.key}
            checked={statuses.includes(s.key)}
            onChange={() => toggleFilter('statuses', s.key)}
            count={counts.statusCounts[s.key]}
          >
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${s.color}`} />
              {s.label}
            </span>
          </Checkbox>
        ))}
      </FilterSection>

      <FilterSection title="Отделы" isOpen={openSections.departments} onToggle={() => toggleSection('departments')}>
        {availableDepts.map(d => (
          <Checkbox
            key={d}
            checked={departments.includes(d)}
            onChange={() => toggleFilter('departments', d)}
            count={counts.departmentCounts[d] || 0}
          >
            {d}
          </Checkbox>
        ))}
      </FilterSection>

      <FilterSection title="Платформа" isOpen={openSections.platform} onToggle={() => toggleSection('platform')}>
        {platformConfig.map(p => (
          <Checkbox
            key={p.key}
            checked={platforms.includes(p.key)}
            onChange={() => toggleFilter('platforms', p.key)}
            count={counts.platformCounts[p.key]}
          >
            <span className="flex items-center gap-1.5">
              <PlatformIcon platform={p.key} size={12} />
              {p.label}
            </span>
          </Checkbox>
        ))}
      </FilterSection>

      {/* Active filter tags + reset */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-3 py-2 flex flex-wrap gap-1 items-center overflow-hidden"
          >
            {statuses.map(s => (
              <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-primary/10 text-red-light text-[10px]">
                {statusConfig.find(sc => sc.key === s)?.label}
                <button onClick={() => toggleFilter('statuses', s)} className="hover:text-red-primary cursor-pointer"><X size={9} /></button>
              </span>
            ))}
            {platforms.map(p => (
              <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-primary/10 text-red-light text-[10px]">
                {platformConfig.find(pc => pc.key === p)?.label}
                <button onClick={() => toggleFilter('platforms', p)} className="hover:text-red-primary cursor-pointer"><X size={9} /></button>
              </span>
            ))}
            {departments.map(d => (
              <span key={d} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-primary/10 text-red-light text-[10px]">
                {d}
                <button onClick={() => toggleFilter('departments', d)} className="hover:text-red-primary cursor-pointer"><X size={9} /></button>
              </span>
            ))}
            <button
              onClick={resetFilters}
              className="p-0.5 text-text-muted hover:text-red-light transition-colors cursor-pointer"
              title="Сбросить фильтры"
            >
              <RotateCcw size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
