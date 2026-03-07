import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, ChevronDown } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'

export default function TopBar({ title, onSearchClick }) {
  const { currentUser, notifications, markNotificationRead, logout } = useApp()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const unreadNotifs = notifications.filter(n => !n.read).length

  return (
    <header className="h-16 bg-bg-surface/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Title */}
      <h1 className="text-xl font-heading font-semibold">{title}</h1>

      {/* Right: Search + Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* Search trigger — opens Command Palette */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 bg-bg-card border border-border rounded-lg px-3 py-2 text-sm text-text-muted hover:border-red-primary/30 transition-colors w-56 cursor-pointer"
        >
          <Search size={16} />
          <span className="flex-1 text-left">Поиск...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-bg-hover rounded border border-border">Ctrl+K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false) }}
            className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
          >
            <Bell size={20} />
            {unreadNotifs > 0 && (
              <span className="absolute -top-0.5 -right-0.5">
                <Badge color="red">{unreadNotifs}</Badge>
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-full mt-2 w-80 glass-card p-2 max-h-80 overflow-y-auto"
              >
                <div className="p-2 text-sm font-heading font-semibold border-b border-border mb-2">
                  Уведомления
                </div>
                {notifications.map(n => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`w-full text-left p-3 rounded-lg text-sm transition-colors cursor-pointer ${
                      n.read ? 'text-text-muted' : 'text-text-primary bg-bg-hover/50'
                    } hover:bg-bg-hover`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-red-primary mt-1.5 shrink-0" />}
                      <div>
                        <p>{n.text}</p>
                        <p className="text-xs text-text-muted mt-1">{n.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false) }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-bg-hover transition-colors cursor-pointer"
          >
            {currentUser && (
              <>
                <Avatar nick={currentUser.login} size="sm" />
                <span className="text-sm text-text-secondary">{currentUser.firstName}</span>
                <ChevronDown size={14} className="text-text-muted" />
              </>
            )}
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute right-0 top-full mt-2 w-48 glass-card p-2"
              >
                <button
                  onClick={() => { setShowProfile(false) }}
                  className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
                >
                  Профиль
                </button>
                <button
                  onClick={() => { setShowProfile(false) }}
                  className="w-full text-left px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover rounded-lg transition-colors cursor-pointer"
                >
                  Настройки
                </button>
                <hr className="border-border my-1" />
                <button
                  onClick={logout}
                  className="w-full text-left px-3 py-2 text-sm text-red-light hover:bg-red-primary/10 rounded-lg transition-colors cursor-pointer"
                >
                  Выйти
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
