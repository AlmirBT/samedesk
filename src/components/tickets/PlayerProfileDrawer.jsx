import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Star, MessageSquare, Clock, Ban } from 'lucide-react'
import Avatar from '../ui/Avatar'
import PlatformIcon from '../ui/PlatformIcon'
import Badge from '../ui/Badge'
import { playerProfiles } from '../../data/mockData'

export default function PlayerProfileDrawer({ nick, isOpen, onClose }) {
  const profile = playerProfiles?.find(p => p.nick === nick) || {
    nick: nick || 'Unknown',
    platforms: ['telegram'],
    labels: [],
    totalTickets: 0,
    recentTickets: [],
    serverStats: { playTime: '0h', lastSeen: 'N/A', joinDate: 'N/A' },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-[360px] bg-bg-surface border-l border-border z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-heading text-sm text-text-primary">Профиль игрока</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-hover transition-colors cursor-pointer">
                <X size={16} className="text-text-muted" />
              </button>
            </div>

            {/* Player info */}
            <div className="p-6 flex flex-col items-center text-center border-b border-border">
              <Avatar nick={profile.nick} size="lg" />
              <h2 className="mt-3 text-lg font-heading font-semibold">{profile.nick}</h2>
              <div className="flex gap-2 mt-2">
                {profile.platforms.map(p => (
                  <PlatformIcon key={p} platform={p} size={16} />
                ))}
              </div>
              {profile.labels.length > 0 && (
                <div className="flex gap-1.5 mt-3">
                  {profile.labels.map(label => (
                    <Badge key={label} color={label === 'VIP' ? 'yellow' : label === 'Trusted' ? 'green' : 'gray'}>
                      {label === 'VIP' && <Star size={10} className="mr-1" />}
                      {label === 'Trusted' && <Shield size={10} className="mr-1" />}
                      {label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Server Stats */}
            <div className="p-4 border-b border-border">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3">Статистика сервера</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-card rounded-lg p-3">
                  <p className="text-[10px] text-text-muted">Время игры</p>
                  <p className="text-sm font-medium mt-0.5">{profile.serverStats.playTime}</p>
                </div>
                <div className="bg-bg-card rounded-lg p-3">
                  <p className="text-[10px] text-text-muted">Последний вход</p>
                  <p className="text-sm font-medium mt-0.5">{profile.serverStats.lastSeen}</p>
                </div>
                <div className="bg-bg-card rounded-lg p-3">
                  <p className="text-[10px] text-text-muted">Дата регистрации</p>
                  <p className="text-sm font-medium mt-0.5">{profile.serverStats.joinDate}</p>
                </div>
                <div className="bg-bg-card rounded-lg p-3">
                  <p className="text-[10px] text-text-muted">Обращений</p>
                  <p className="text-sm font-medium mt-0.5">{profile.totalTickets}</p>
                </div>
              </div>
            </div>

            {/* Recent Tickets */}
            <div className="p-4 border-b border-border">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MessageSquare size={12} /> Последние обращения
              </p>
              <div className="space-y-2">
                {profile.recentTickets.length > 0 ? profile.recentTickets.map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg bg-bg-card/50 hover:bg-bg-hover transition-colors">
                    <span className="text-[10px] text-text-muted font-mono">{t.id}</span>
                    <span className="text-xs text-text-secondary truncate flex-1">{t.subject}</span>
                    <Badge color={t.status === 'open' ? 'green' : t.status === 'closed' ? 'gray' : 'yellow'} className="text-[10px]">
                      {t.status === 'open' ? 'Открыт' : t.status === 'closed' ? 'Закрыт' : 'В работе'}
                    </Badge>
                  </div>
                )) : (
                  <p className="text-xs text-text-muted">Нет обращений</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-dark/20 text-red-light hover:bg-red-dark/30 transition-colors text-sm cursor-pointer">
                <Ban size={14} /> Заблокировать игрока
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
