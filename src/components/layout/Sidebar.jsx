import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, ListTodo, Users, Shield,
  Tag, Clock, Settings, BarChart3, LogOut, ChevronLeft, ChevronRight, AlertTriangle,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'

const navSections = [
  {
    title: 'Основное',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Дашборд', shortcut: '1' },
      { to: '/tickets', icon: MessageSquare, label: 'Обращения', badge: true, shortcut: '2' },
      { to: '/incidents', icon: AlertTriangle, label: 'Инциденты', shortcut: '3' },
      { to: '/tasks', icon: ListTodo, label: 'Задачи', shortcut: '4' },
    ],
  },
  {
    title: 'Управление',
    items: [
      { to: '/users', icon: Users, label: 'Пользователи', shortcut: '5' },
      { to: '/roles', icon: Shield, label: 'Роли', shortcut: '6' },
      { to: '/tags', icon: Tag, label: 'Теги', shortcut: '7' },
      { to: '/shifts', icon: Clock, label: 'Смены', shortcut: '8' },
    ],
  },
  {
    title: 'Система',
    items: [
      { to: '/stats', icon: BarChart3, label: 'Статистика', shortcut: '9' },
      { to: '/settings', icon: Settings, label: 'Настройки' },
    ],
  },
]

function NavTooltip({ label, shortcut, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 glass-card px-3 py-1.5 whitespace-nowrap pointer-events-none"
        >
          <span className="text-sm text-text-primary">{label}</span>
          {shortcut && (
            <kbd className="ml-2 px-1 py-0.5 text-[10px] text-text-muted bg-bg-hover rounded border border-border">
              Ctrl+{shortcut}
            </kbd>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, currentUser, logout, tickets } = useApp()
  const navigate = useNavigate()
  const unreadCount = tickets.filter(t => t.unread).length
  const [hoveredItem, setHoveredItem] = useState(null)

  // Keyboard shortcuts: Ctrl+1 through Ctrl+8
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!e.ctrlKey && !e.metaKey) return
      const num = parseInt(e.key)
      if (num >= 1 && num <= 9) {
        for (const section of navSections) {
          const item = section.items.find(i => i.shortcut === String(num))
          if (item) {
            e.preventDefault()
            navigate(item.to)
            break
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  let itemIndex = 0

  return (
    <motion.aside
      className="h-screen bg-bg-surface border-r border-border flex flex-col shrink-0 overflow-hidden"
      animate={{ width: sidebarCollapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-border min-h-[64px]">
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <span className="text-lg font-bold font-heading whitespace-nowrap">
                Fun<span className="text-red-primary">Time</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="mb-3">
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] uppercase tracking-widest text-text-muted px-3 mb-1.5 font-medium"
                >
                  {section.title}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const idx = itemIndex++
                return (
                  <motion.div
                    key={item.to}
                    initial={{ x: -8, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.04, duration: 0.3 }}
                    className="relative"
                    onMouseEnter={() => sidebarCollapsed && setHoveredItem(item.to)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative ${
                          isActive
                            ? 'bg-red-primary/10 text-red-light'
                            : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="sidebar-indicator"
                              className="absolute left-0 top-1 bottom-1 w-[3px] bg-red-primary rounded-r-full"
                            />
                          )}
                          <motion.div whileHover={{ scale: 1.1 }} className="shrink-0">
                            <item.icon size={20} />
                          </motion.div>
                          <AnimatePresence>
                            {!sidebarCollapsed && (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm font-medium whitespace-nowrap flex-1"
                              >
                                {item.label}
                              </motion.span>
                            )}
                          </AnimatePresence>
                          {!sidebarCollapsed && item.shortcut && (
                            <kbd className="px-1 py-0.5 text-[10px] text-text-muted/50 bg-transparent rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Ctrl+{item.shortcut}
                            </kbd>
                          )}
                          {item.badge && unreadCount > 0 && (
                            <div className={sidebarCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'}>
                              <Badge color="red">{unreadCount}</Badge>
                            </div>
                          )}
                        </>
                      )}
                    </NavLink>
                    {sidebarCollapsed && (
                      <NavTooltip
                        label={item.label}
                        shortcut={item.shortcut}
                        show={hoveredItem === item.to}
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-3">
          {currentUser && (
            <Avatar nick={currentUser.login} size="sm" status={currentUser.status} />
          )}
          <AnimatePresence>
            {!sidebarCollapsed && currentUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <div className="text-sm font-medium truncate">{currentUser.firstName}</div>
                <div className="text-xs text-text-muted truncate">{currentUser.roles[0]}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={logout}
                className="p-1.5 rounded-lg text-text-muted hover:text-red-light hover:bg-bg-hover transition-colors cursor-pointer"
                title="Выйти"
              >
                <LogOut size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}
