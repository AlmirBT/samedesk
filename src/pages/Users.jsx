import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import StatusDot from '../components/ui/StatusDot'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'

const statusLabels = { online: 'Онлайн', offline: 'Оффлайн', on_shift: 'На смене', break: 'Перерыв' }

export default function UsersPage() {
  const { staff } = useApp()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)

  const allRoles = [...new Set(staff.flatMap(s => s.roles))]

  const filtered = staff.filter(s => {
    const matchSearch = !search || s.firstName.toLowerCase().includes(search.toLowerCase()) || s.lastName.toLowerCase().includes(search.toLowerCase()) || s.login.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || s.roles.includes(roleFilter)
    return matchSearch && matchRole
  })

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}м ${seconds % 60}с`

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск сотрудников..."
            className="w-full bg-bg-card border border-border rounded-lg pl-8 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors"
          />
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${roleFilter === 'all' ? 'bg-red-primary/15 text-red-light' : 'text-text-muted hover:bg-bg-hover'}`}
          >
            Все
          </button>
          {allRoles.map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer ${roleFilter === r ? 'bg-red-primary/15 text-red-light' : 'text-text-muted hover:bg-bg-hover'}`}
            >
              {r}
            </button>
          ))}
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={16} />}>Добавить</Button>
      </div>

      {/* Table */}
      <Card hover={false} className="overflow-hidden !p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left p-4">Сотрудник</th>
              <th className="text-left p-4">Роли</th>
              <th className="text-left p-4">Статус</th>
              <th className="text-left p-4">Обращений</th>
              <th className="text-left p-4">Ср. время</th>
              <th className="text-left p-4">Сегодня</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user, i) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedUser(user)}
                className="border-b border-border/50 hover:bg-bg-hover/50 transition-colors cursor-pointer"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar nick={user.login} size="sm" status={user.status} />
                    <div>
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-text-muted font-mono">@{user.login}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-1 flex-wrap">
                    {user.roles.map(r => (
                      <Badge key={r} color="gray">{r}</Badge>
                    ))}
                    {user.isTrainee && <Badge color="yellow">Стажёр</Badge>}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <StatusDot status={user.status} size="sm" />
                    <span className="text-text-secondary text-xs">{statusLabels[user.status]}</span>
                  </div>
                </td>
                <td className="p-4 text-text-secondary">{user.stats.totalTickets}</td>
                <td className="p-4 text-text-secondary">{formatTime(user.stats.avgResponseTime)}</td>
                <td className="p-4 text-text-secondary">{user.stats.todayTickets}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Profile Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Профиль сотрудника">
        {selectedUser && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar nick={selectedUser.login} size="xl" status={selectedUser.status} />
              <div>
                <h3 className="text-lg font-heading font-semibold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="text-sm text-text-muted font-mono">@{selectedUser.login}</p>
                <div className="flex gap-1 mt-2">
                  {selectedUser.roles.map(r => <Badge key={r} color="gray">{r}</Badge>)}
                  {selectedUser.isTrainee && <Badge color="yellow">Стажёр</Badge>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-bg-card rounded-xl p-3 text-center">
                <p className="text-xl font-heading font-bold">{selectedUser.stats.totalTickets}</p>
                <p className="text-xs text-text-muted mt-1">Всего</p>
              </div>
              <div className="bg-bg-card rounded-xl p-3 text-center">
                <p className="text-xl font-heading font-bold">{formatTime(selectedUser.stats.avgResponseTime)}</p>
                <p className="text-xs text-text-muted mt-1">Ср. время</p>
              </div>
              <div className="bg-bg-card rounded-xl p-3 text-center">
                <p className="text-xl font-heading font-bold">{selectedUser.stats.todayTickets}</p>
                <p className="text-xs text-text-muted mt-1">Сегодня</p>
              </div>
            </div>

            {selectedUser.isTrainee && selectedUser.mentorId && (
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Наставник</p>
                <p className="text-sm">{staff.find(s => s.id === selectedUser.mentorId)?.firstName || 'Не назначен'}</p>
              </div>
            )}

            {selectedUser.blockedPlayers.length > 0 && (
              <div>
                <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Заблокированные игроки</p>
                <div className="flex gap-1 flex-wrap">
                  {selectedUser.blockedPlayers.map(p => <Badge key={p} color="red">{p}</Badge>)}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
