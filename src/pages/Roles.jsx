import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, User, Headset, Code, Shield } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const roleIcons = { User, Headset, Code, Shield }

const permissionLabels = {
  readTickets: 'Читать обращения',
  replyTickets: 'Отвечать на обращения',
  assignTickets: 'Назначать обращения',
  blockPlayers: 'Блокировать игроков',
  manageUsers: 'Управление пользователями',
  manageRoles: 'Управление ролями',
  manageTags: 'Управление тегами',
  viewStats: 'Просмотр статистики',
}

export default function Roles() {
  const { roles, staff } = useApp()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex justify-end">
        <Button variant="primary" size="sm" icon={<Plus size={16} />}>Создать роль</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role, i) => {
          const Icon = roleIcons[role.icon] || Shield
          const staffCount = staff.filter(s => s.roles.includes(role.name)).length

          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-red-primary/10 rounded-xl">
                    <Icon size={20} className="text-red-primary" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold">{role.name}</h4>
                    <p className="text-xs text-text-muted">{staffCount} сотрудников</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(role.permissions).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={value}
                        readOnly
                        className="w-4 h-4 rounded border-border bg-bg-card accent-red-primary"
                      />
                      <span className={value ? 'text-text-primary' : 'text-text-muted'}>
                        {permissionLabels[key]}
                      </span>
                    </label>
                  ))}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
