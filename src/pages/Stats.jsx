import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { weeklyStats } from '../data/mockData'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import StatusDot from '../components/ui/StatusDot'

const periods = [
  { key: '7d', label: '7 дней' },
  { key: '30d', label: '30 дней' },
  { key: '90d', label: '90 дней' },
]

const platformData = [
  { name: 'Telegram', value: 35, color: '#E53E3E' },
  { name: 'Discord', value: 28, color: '#FC8181' },
  { name: 'VK', value: 22, color: '#FEB2B2' },
  { name: 'Email', value: 15, color: '#4A5568' },
]

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

export default function Stats() {
  const { staff } = useApp()
  const [period, setPeriod] = useState('7d')

  const avgTickets = Math.round(staff.reduce((a, s) => a + s.stats.totalTickets, 0) / staff.length)
  const avgTime = Math.round(staff.reduce((a, s) => a + s.stats.avgResponseTime, 0) / staff.length)

  const staffBarData = staff.map(s => ({
    name: s.firstName,
    tickets: s.stats.totalTickets,
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Period filter */}
      <div className="flex gap-1">
        {periods.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
              period === p.key ? 'bg-red-primary/15 text-red-light' : 'text-text-muted hover:bg-bg-hover'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Staff table */}
      <Card hover={false} className="overflow-hidden !p-0">
        <div className="p-4 border-b border-border">
          <h3 className="font-heading font-semibold text-sm">Эффективность сотрудников</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left p-4">Сотрудник</th>
              <th className="text-left p-4">Статус</th>
              <th className="text-right p-4">Всего</th>
              <th className="text-right p-4">Сегодня</th>
              <th className="text-right p-4">Ср. время</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s, i) => {
              const ticketDiff = ((s.stats.totalTickets - avgTickets) / avgTickets) * 100
              const timeDiff = ((s.stats.avgResponseTime - avgTime) / avgTime) * 100
              return (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/50 hover:bg-bg-hover/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar nick={s.login} size="sm" />
                      <span className="font-medium">{s.firstName} {s.lastName}</span>
                    </div>
                  </td>
                  <td className="p-4"><StatusDot status={s.status} size="sm" /></td>
                  <td className={`p-4 text-right font-mono ${ticketDiff > 25 ? 'text-success' : ticketDiff < -25 ? 'text-red-light' : 'text-text-secondary'}`}>
                    {s.stats.totalTickets}
                  </td>
                  <td className="p-4 text-right font-mono text-text-secondary">{s.stats.todayTickets}</td>
                  <td className={`p-4 text-right font-mono ${timeDiff < -25 ? 'text-success' : timeDiff > 25 ? 'text-red-light' : 'text-text-secondary'}`}>
                    {Math.floor(s.stats.avgResponseTime / 60)}м {s.stats.avgResponseTime % 60}с
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card hover={false}>
            <h3 className="text-sm font-heading font-semibold mb-4">Обращения по дням</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={weeklyStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="day" stroke="#4A5568" fontSize={12} tickLine={false} />
                <YAxis stroke="#4A5568" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="tickets" name="Обращения" stroke="#E53E3E" strokeWidth={2} dot={{ fill: '#E53E3E', r: 3 }} />
                <Line type="monotone" dataKey="resolved" name="Решено" stroke="#48BB78" strokeWidth={2} dot={{ fill: '#48BB78', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card hover={false}>
            <h3 className="text-sm font-heading font-semibold mb-4">Обращения по сотрудникам</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={staffBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                <XAxis dataKey="name" stroke="#4A5568" fontSize={11} tickLine={false} />
                <YAxis stroke="#4A5568" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tickets" name="Всего" fill="#E53E3E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card hover={false}>
            <h3 className="text-sm font-heading font-semibold mb-4">По платформам</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={platformData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                  {platformData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
