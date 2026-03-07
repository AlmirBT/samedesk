import { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import LiveActivityBar from '../ui/LiveActivityBar'
import CommandPalette from '../ui/CommandPalette'
import ToastContainer from '../ui/Toast'
import { useToast } from '../../hooks/useToast'
import { createContext, useContext } from 'react'

const ToastContext = createContext(null)
export const useLayoutToast = () => useContext(ToastContext)

const pageTitles = {
  '/': 'Дашборд',
  '/tickets': 'Обращения',
  '/tasks': 'Задачи',
  '/users': 'Пользователи',
  '/roles': 'Роли',
  '/tags': 'Теги',
  '/shifts': 'Смены',
  '/settings': 'Настройки',
  '/stats': 'Статистика',
}

export default function Layout() {
  const { isAuthenticated } = useApp()
  const { toasts, addToast, removeToast } = useToast()
  const location = useLocation()
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const title = pageTitles[location.pathname] || 'FunTime HelpDesk'

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className="flex h-screen bg-bg-base overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <LiveActivityBar />
          <TopBar title={title} onSearchClick={() => setPaletteOpen(true)} />
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
        <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ToastContext.Provider>
  )
}
