import { motion } from 'framer-motion'
import { MessageSquare, ListTodo, Users, Clock, ArrowRight, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts'
import { useApp } from '../context/AppContext'
import { weeklyStats, getStaffById } from '../data/mockData'
import StatCard from '../components/stats/StatCard'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import PlatformIcon from '../components/ui/PlatformIcon'
import Badge from '../components/ui/Badge'
import StatusDot from '../components/ui/StatusDot'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-sm">
      <p className="text-text-primary font-medium">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-xs mt-1">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { tickets, staff, shifts, tasks } = useApp()

  const openTickets = tickets.filter(t => t.status === 'open').length
  const todayTasks = tasks.filter(t => t.status !== 'completed').length
  const activeStaff = staff.filter(s => s.status === 'online' || s.status === 'on_shift').length
  const avgTime = Math.round(staff.reduce((acc, s) => acc + s.stats.avgResponseTime, 0) / staff.length)
  const recentTickets = [...tickets].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  const onlineStaff = staff.filter(s => s.status === 'online' || s.status === 'on_shift')

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={MessageSquare} label="Открытые обращения" value={openTickets} trend="up" trendValue="+12%" delay={0} />
        <StatCard icon={ListTodo} label="Задачи на сегодня" value={todayTasks} trend="down" trendValue="-3%" delay={0.05} />
        <StatCard icon={Users} label="На смене" value={activeStaff} trend="up" trendValue="+2" delay={0.1} />
        <StatCard icon={Clock} label="Среднее время ответа" value={formatTime(avgTime)} trend="up" trendValue="-15%" delay={0.15} />
      </div>

      {/* Bento Grid: Chart + Online Staff + Recent Tickets */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Chart — wide */}
        <motion.div
          className="xl:col-span-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card hover={false} className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-semibold">Обращения за неделю</h3>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-red-primary rounded-full inline-block" /> Обращения</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-success rounded-full inline-block" /> Решено</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={weeklyStats}>
                <defs>
                  <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E53E3E" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#E53E3E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#48BB78" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#48BB78" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="day" stroke="#4A5568" fontSize={12} tickLine={false} />
                <YAxis stroke="#4A5568" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="tickets" name="Обращения" stroke="#E53E3E" strokeWidth={2} fill="url(#redGrad)" dot={{ fill: '#E53E3E', r: 3 }} activeDot={{ r: 5, fill: '#FC8181' }} />
                <Area type="monotone" dataKey="resolved" name="Решено" stroke="#48BB78" strokeWidth={2} fill="url(#greenGrad)" dot={{ fill: '#48BB78', r: 3 }} activeDot={{ r: 5, fill: '#68D391' }} />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Online Staff */}
        <motion.div
          className="xl:col-span-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
        >
          <Card hover={false} className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-semibold">Сотрудники онлайн</h3>
              <div className="flex items-center gap-1.5">
                <Activity size={14} className="text-success" />
                <span className="text-xs text-success font-medium">{onlineStaff.length} онлайн</span>
              </div>
            </div>
            <div className="space-y-2">
              {onlineStaff.map((member, i) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-hover transition-colors"
                >
                  <Avatar nick={member.login} size="sm" status={member.status} />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium truncate block">{member.firstName} {member.lastName}</span>
                    <span className="text-xs text-text-muted">{member.stats.todayTickets} обращений сегодня</span>
                  </div>
                  <StatusDot status={member.status} pulse />
                </motion.div>
              ))}
              {onlineStaff.length === 0 && (
                <p className="text-sm text-text-muted text-center py-4">Никого нет онлайн</p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Recent Tickets — full width */}
        <motion.div
          className="xl:col-span-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-semibold">Последние обращения</h3>
              <button className="text-xs text-red-light hover:text-red-primary transition-colors flex items-center gap-1 cursor-pointer">
                Все обращения <ArrowRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              {recentTickets.map((ticket, i) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="p-3 rounded-xl bg-bg-hover/50 hover:bg-bg-hover border border-border/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar nick={ticket.playerNick} size="sm" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium truncate block">{ticket.playerNick}</span>
                      <span className="text-[10px] text-text-muted font-mono">{ticket.id}</span>
                    </div>
                    <PlatformIcon platform={ticket.platform} size={14} />
                  </div>
                  <p className="text-xs text-text-secondary truncate">{ticket.lastMessage}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex gap-1">
                      {ticket.tags.slice(0, 1).map(tag => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-red-primary/10 text-red-light">{tag}</span>
                      ))}
                    </div>
                    {ticket.unread && (
                      <span className="w-2 h-2 rounded-full bg-red-primary" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
