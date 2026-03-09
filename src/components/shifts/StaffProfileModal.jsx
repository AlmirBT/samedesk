import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Ticket, Clock, CalendarDays, Coins, TrendingUp, TrendingDown, Award, AlertTriangle } from 'lucide-react'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import Avatar from '../ui/Avatar'
import StatusDot from '../ui/StatusDot'
import Button from '../ui/Button'
import { useApp } from '../../context/AppContext'

const statusLabels = { online: 'Онлайн', offline: 'Оффлайн', on_shift: 'На смене', break: 'Перерыв' }
const statusColors = { online: 'green', offline: 'gray', on_shift: 'green', break: 'yellow' }

export default function StaffProfileModal({ isOpen, onClose, staffId }) {
  const { staff, shifts, staffTransactions, addStaffTransaction, currentUser } = useApp()
  const [activeTab, setActiveTab] = useState('shifts')
  const [showBonusForm, setShowBonusForm] = useState(false)
  const [showFineForm, setShowFineForm] = useState(false)
  const [txnAmount, setTxnAmount] = useState('')
  const [txnReason, setTxnReason] = useState('')

  const member = staff.find(s => s.id === staffId)
  if (!member) return null

  // Shift history for this staff
  const staffShifts = shifts
    .filter(s => (s.staffEntries || []).some(e => e.staffId === staffId))
    .sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime))
    .slice(0, 5)

  // Transactions for this staff
  const memberTransactions = (staffTransactions || [])
    .filter(t => t.staffId === staffId)
    .sort((a, b) => b.date.localeCompare(a.date))

  const handleSubmitTransaction = (type) => {
    const amount = Number(txnAmount)
    if (!amount || amount <= 0 || !txnReason.trim()) return
    addStaffTransaction({
      staffId,
      type,
      amount,
      reason: txnReason.trim(),
      date: new Date().toISOString().split('T')[0],
      issuedBy: currentUser?.id || 'staff_3',
    })
    setTxnAmount('')
    setTxnReason('')
    setShowBonusForm(false)
    setShowFineForm(false)
  }

  const inputClass = 'w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm text-text-primary focus:border-red-primary/50 focus:outline-none transition-colors'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Профиль сотрудника" className="max-w-xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-5">
        <Avatar nick={member.login} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            {member.firstName} {member.lastName}
          </h3>
          <p className="text-xs text-text-muted font-mono">@{member.login}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {member.roles.map(r => (
              <Badge key={r} color="red">{r}</Badge>
            ))}
            <div className="flex items-center gap-1">
              <StatusDot status={member.status} size="sm" />
              <span className="text-[10px] text-text-secondary">{statusLabels[member.status]}</span>
            </div>
            {member.isTrainee && <Badge color="yellow">Стажёр</Badge>}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { icon: Ticket, label: 'Всего тикетов', value: member.stats.totalTickets, color: 'text-red-light' },
          { icon: Clock, label: 'Ср. ответ', value: `${Math.round(member.stats.avgResponseTime / 60)}м`, color: 'text-text-secondary' },
          { icon: CalendarDays, label: 'Сегодня', value: member.stats.todayTickets, color: 'text-success' },
          { icon: Coins, label: 'Баланс', value: member.balance ?? 0, color: 'text-warning' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="glass-card p-3 text-center"
          >
            <stat.icon size={14} className={`mx-auto mb-1 ${stat.color}`} />
            <p className={`text-base font-semibold font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-[9px] text-text-muted mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3 border-b border-border/50 pb-px">
        {[
          { id: 'shifts', label: 'Смены' },
          { id: 'transactions', label: 'Бонусы / Штрафы' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs rounded-t-lg transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-bg-hover text-red-light border-b-2 border-red-primary'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-h-[240px] overflow-y-auto mb-4">
        <AnimatePresence mode="wait">
          {activeTab === 'shifts' && (
            <motion.div
              key="shifts"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-1.5"
            >
              {staffShifts.length === 0 && (
                <p className="text-xs text-text-muted text-center py-4">Нет данных о сменах</p>
              )}
              {staffShifts.map(shift => {
                const entry = shift.staffEntries.find(e => e.staffId === staffId)
                const typeLabel = entry?.type === 'reinforcement' ? 'Подкрепление'
                  : entry?.type === 'early_leave' ? 'Ранний уход'
                  : entry?.type === 'replacement' ? 'Замена'
                  : null
                return (
                  <div key={shift.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-bg-base/50">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary font-medium">{shift.name}</p>
                      <p className="text-[10px] text-text-muted">{shift.date}</p>
                    </div>
                    <span className="text-[10px] font-mono text-text-secondary">
                      {entry?.startTime || shift.startTime} - {entry?.endTime || shift.endTime}
                    </span>
                    {typeLabel && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                        entry.type === 'reinforcement' ? 'bg-blue-500/10 text-blue-400'
                        : entry.type === 'early_leave' ? 'bg-warning/10 text-warning'
                        : 'bg-purple-500/10 text-purple-400'
                      }`}>
                        {typeLabel}
                      </span>
                    )}
                    <Badge color={shift.status === 'active' ? 'green' : shift.status === 'scheduled' ? 'gray' : 'gray'}>
                      {shift.status === 'active' ? 'Актив.' : shift.status === 'scheduled' ? 'План.' : 'Заверш.'}
                    </Badge>
                  </div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-1.5"
            >
              {memberTransactions.length === 0 && (
                <p className="text-xs text-text-muted text-center py-4">Нет транзакций</p>
              )}
              {memberTransactions.map(txn => {
                const issuer = staff.find(s => s.id === txn.issuedBy)
                return (
                  <div key={txn.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-bg-base/50">
                    <div className={`p-1.5 rounded-lg ${txn.type === 'bonus' ? 'bg-success/10' : 'bg-red-primary/10'}`}>
                      {txn.type === 'bonus'
                        ? <TrendingUp size={12} className="text-success" />
                        : <TrendingDown size={12} className="text-red-light" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-primary">{txn.reason}</p>
                      <p className="text-[10px] text-text-muted">{txn.date} · {issuer ? `${issuer.firstName} ${issuer.lastName}` : 'Система'}</p>
                    </div>
                    <span className={`text-sm font-mono font-semibold ${txn.type === 'bonus' ? 'text-success' : 'text-red-light'}`}>
                      {txn.type === 'bonus' ? '+' : '−'}{txn.amount}
                    </span>
                  </div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="border-t border-border/50 pt-3 space-y-2">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => { setShowBonusForm(!showBonusForm); setShowFineForm(false) }}
          >
            <Award size={12} className="mr-1 text-success" />
            Выписать бонус
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={() => { setShowFineForm(!showFineForm); setShowBonusForm(false) }}
          >
            <AlertTriangle size={12} className="mr-1 text-red-light" />
            Оштрафовать
          </Button>
        </div>

        <AnimatePresence>
          {(showBonusForm || showFineForm) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-[100px_1fr] gap-2">
                  <input
                    type="number"
                    value={txnAmount}
                    onChange={e => setTxnAmount(e.target.value)}
                    placeholder="Сумма"
                    min={1}
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={txnReason}
                    onChange={e => setTxnReason(e.target.value)}
                    placeholder="Причина..."
                    className={inputClass}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setShowBonusForm(false); setShowFineForm(false) }}>
                    Отмена
                  </Button>
                  <Button
                    variant={showBonusForm ? 'primary' : 'danger'}
                    size="sm"
                    onClick={() => handleSubmitTransaction(showBonusForm ? 'bonus' : 'fine')}
                    disabled={!txnAmount || !txnReason.trim()}
                  >
                    {showBonusForm ? 'Начислить' : 'Оштрафовать'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  )
}
