import { useApp } from '../context/AppContext'

export function useAuth() {
  const { isAuthenticated, currentUser, login, logout } = useApp()
  return { isAuthenticated, user: currentUser, login, logout }
}
