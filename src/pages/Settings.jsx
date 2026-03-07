import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, MessageSquare, FileText, Wrench } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLayoutToast } from '../components/layout/Layout'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Avatar from '../components/ui/Avatar'

const tabs = [
  { key: 'profile', label: 'Профиль', icon: User },
  { key: 'notifications', label: 'Уведомления', icon: Bell },
  { key: 'autoreply', label: 'Автоответы', icon: MessageSquare },
  { key: 'templates', label: 'Шаблоны', icon: FileText },
  { key: 'system', label: 'Система', icon: Wrench },
]

function Toggle({ label, defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm text-text-secondary">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${on ? 'bg-red-primary' : 'bg-bg-hover border border-border'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${on ? 'left-5' : 'left-0.5'}`} />
      </button>
    </label>
  )
}

export default function SettingsPage() {
  const { currentUser } = useApp()
  const toast = useLayoutToast()
  const [tab, setTab] = useState('profile')

  const handleSave = () => toast?.addToast('Настройки сохранены', 'success')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-6"
    >
      {/* Tab sidebar */}
      <div className="w-48 shrink-0 space-y-1">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-colors cursor-pointer text-left ${
              tab === t.key ? 'bg-red-primary/10 text-red-light' : 'text-text-secondary hover:bg-bg-hover'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 max-w-2xl">
        {tab === 'profile' && (
          <Card hover={false}>
            <h3 className="font-heading font-semibold mb-6">Профиль</h3>
            <div className="flex items-center gap-4 mb-6">
              {currentUser && <Avatar nick={currentUser.login} size="xl" />}
              <Button variant="secondary" size="sm">Сменить аватар</Button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-text-muted mb-1">Имя</label>
                <input defaultValue={currentUser?.firstName} className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-red-primary/50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">Фамилия</label>
                <input defaultValue={currentUser?.lastName} className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-red-primary/50 transition-colors" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-xs text-text-muted mb-1">Новый пароль</label>
              <input type="password" placeholder="••••••••" className="w-full bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-red-primary/50 transition-colors" />
            </div>
            <Button variant="primary" size="sm" onClick={handleSave}>Сохранить</Button>
          </Card>
        )}

        {tab === 'notifications' && (
          <Card hover={false}>
            <h3 className="font-heading font-semibold mb-4">Уведомления</h3>
            <div className="divide-y divide-border">
              <Toggle label="Новые обращения" defaultChecked />
              <Toggle label="Ответы на обращения" defaultChecked />
              <Toggle label="Назначение обращений" defaultChecked />
              <Toggle label="Начало смены" defaultChecked />
              <Toggle label="Новые задачи" />
              <Toggle label="Звук уведомлений" defaultChecked />
            </div>
          </Card>
        )}

        {tab === 'autoreply' && (
          <Card hover={false}>
            <h3 className="font-heading font-semibold mb-4">Автоответы</h3>
            <div className="space-y-3">
              {[
                { keyword: 'привет', response: 'Здравствуйте! Чем могу помочь?' },
                { keyword: 'vip', response: 'VIP можно приобрести на нашем сайте.' },
                { keyword: 'правила', response: 'Правила сервера: /rules' },
              ].map((rule, i) => (
                <div key={i} className="p-3 bg-bg-card rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-text-muted">Ключевое слово:</span>
                    <span className="text-sm font-mono text-red-light">{rule.keyword}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{rule.response}</p>
                </div>
              ))}
              <Button variant="secondary" size="sm">Добавить правило</Button>
            </div>
          </Card>
        )}

        {tab === 'templates' && (
          <Card hover={false}>
            <h3 className="font-heading font-semibold mb-4">Шаблоны быстрых ответов</h3>
            <p className="text-sm text-text-muted mb-4">Управление шаблонами доступно в чате обращений через кнопку «Шаблоны».</p>
            <Button variant="secondary" size="sm">Редактировать шаблоны</Button>
          </Card>
        )}

        {tab === 'system' && (
          <Card hover={false}>
            <h3 className="font-heading font-semibold mb-4">Система</h3>
            <div className="divide-y divide-border">
              <div className="py-3 flex items-center justify-between">
                <span className="text-sm text-text-secondary">Тема</span>
                <span className="text-sm text-text-muted">Тёмная (единственная)</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-sm text-text-secondary">Язык</span>
                <span className="text-sm text-text-muted">Русский</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span className="text-sm text-text-secondary">Версия</span>
                <span className="text-sm text-text-muted font-mono">1.0.0</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  )
}
