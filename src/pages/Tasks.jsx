import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, List, Plus, Calendar } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getStaffById, getTagByName } from '../data/mockData'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import TagChip from '../components/ui/TagChip'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'

const columns = [
  { key: 'new', label: 'Новые', color: '#A0AEC0' },
  { key: 'in_progress', label: 'В работе', color: '#ECC94B' },
  { key: 'review', label: 'На проверке', color: '#FC8181' },
  { key: 'completed', label: 'Закрыты', color: '#48BB78' },
]

const priorityColors = { 0: '#4A5568', 1: '#48BB78', 2: '#ECC94B', 3: '#ED8936', 4: '#E53E3E', 5: '#C53030' }

function TaskCard({ task }) {
  const assignee = task.assignedTo ? getStaffById(task.assignedTo) : null
  return (
    <Card className="!p-3">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium leading-snug flex-1">{task.title}</h4>
        <div className="w-2.5 h-2.5 rounded-full shrink-0 ml-2 mt-1" style={{ backgroundColor: priorityColors[task.priority] }} />
      </div>
      {task.description && (
        <p className="text-xs text-text-muted mb-3 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {task.tags.slice(0, 2).map(tagName => {
            const tag = getTagByName(tagName)
            return <TagChip key={tagName} name={tagName} color={tag?.color} />
          })}
        </div>
        {assignee && <Avatar nick={assignee.login} size="sm" />}
      </div>
      {task.deadline && (
        <div className="flex items-center gap-1 mt-2 text-[10px] text-text-muted">
          <Calendar size={10} />
          {new Date(task.deadline).toLocaleDateString('ru-RU')}
        </div>
      )}
    </Card>
  )
}

export default function Tasks() {
  const { tasks } = useApp()
  const [view, setView] = useState('kanban')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('kanban')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${view === 'kanban' ? 'bg-red-primary/15 text-red-light' : 'text-text-muted hover:bg-bg-hover'}`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${view === 'table' ? 'bg-red-primary/15 text-red-light' : 'text-text-muted hover:bg-bg-hover'}`}
          >
            <List size={18} />
          </button>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={16} />}>Добавить</Button>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-4 gap-4">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.status === col.key)
            return (
              <div key={col.key} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                  <span className="text-sm font-medium text-text-secondary">{col.label}</span>
                  <Badge color="gray">{colTasks.length}</Badge>
                </div>
                <div className="space-y-2">
                  <AnimatePresence>
                    {colTasks.map((task, i) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <TaskCard task={task} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Card hover={false} className="overflow-hidden !p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left p-4">Задача</th>
                <th className="text-left p-4">Статус</th>
                <th className="text-left p-4">Приоритет</th>
                <th className="text-left p-4">Ответственный</th>
                <th className="text-left p-4">Дедлайн</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => {
                const assignee = task.assignedTo ? getStaffById(task.assignedTo) : null
                const col = columns.find(c => c.key === task.status)
                return (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border/50 hover:bg-bg-hover/50 transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-medium">{task.title}</p>
                      <div className="flex gap-1 mt-1">
                        {task.tags.map(tagName => {
                          const tag = getTagByName(tagName)
                          return <TagChip key={tagName} name={tagName} color={tag?.color} />
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge color={col?.key === 'completed' ? 'green' : col?.key === 'review' ? 'red' : col?.key === 'in_progress' ? 'yellow' : 'gray'}>
                        {col?.label}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: priorityColors[task.priority] }} />
                    </td>
                    <td className="p-4">
                      {assignee && (
                        <div className="flex items-center gap-2">
                          <Avatar nick={assignee.login} size="sm" />
                          <span className="text-text-secondary">{assignee.firstName}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-text-muted">
                      {task.deadline && new Date(task.deadline).toLocaleDateString('ru-RU')}
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}
    </motion.div>
  )
}
