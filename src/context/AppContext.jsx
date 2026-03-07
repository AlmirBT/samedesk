import { createContext, useContext, useState, useCallback } from 'react'
import { tickets as mockTickets, staff as mockStaff, shifts as mockShifts, tags as mockTags, roles as mockRoles, tasks as mockTasks, shiftLogs as mockShiftLogs } from '../data/mockData'
import useLocalStorage from '../hooks/useLocalStorage'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [tickets, setTickets] = useState(mockTickets)
  const [staffList] = useState(mockStaff)
  const [shiftList, setShiftList] = useState(mockShifts)
  const [shiftLogList] = useState(mockShiftLogs)

  const addShift = useCallback((shift) => {
    setShiftList(prev => [...prev, { ...shift, id: `shift_${Date.now()}` }])
  }, [])
  const [tagList] = useState(mockTags)
  const [roleList] = useState(mockRoles)
  const [taskList, setTaskList] = useState(mockTasks)
  const [notifications, setNotifications] = useState([
    { id: 'n1', text: 'Новое обращение TKT-005', read: false, time: '2 мин назад' },
    { id: 'n2', text: 'Смена начинается через 10 минут', read: false, time: '8 мин назад' },
    { id: 'n3', text: 'Задача "Расследовать дюп баг" назначена вам', read: true, time: '1 час назад' },
  ])

  // Ticket-specific state
  const [pinnedTicketIds, setPinnedTicketIds] = useLocalStorage('pinnedTicketIds', [])
  const [ticketDensityMode, setTicketDensityMode] = useLocalStorage('ticketDensityMode', 'normal')
  const [savedFilters, setSavedFilters] = useLocalStorage('savedFilters', { status: 'all', search: '' })
  const [selectedTicketIds, setSelectedTicketIds] = useState(new Set())

  const toggleTicketSelection = useCallback((ticketId) => {
    setSelectedTicketIds(prev => {
      const next = new Set(prev)
      if (next.has(ticketId)) next.delete(ticketId)
      else next.add(ticketId)
      return next
    })
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedTicketIds(new Set())
  }, [])

  const togglePinTicket = useCallback((ticketId) => {
    setPinnedTicketIds(prev =>
      prev.includes(ticketId) ? prev.filter(id => id !== ticketId) : [...prev, ticketId]
    )
  }, [setPinnedTicketIds])

  const updateTicketPriority = useCallback((ticketId, priority) => {
    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, priority } : t
    ))
  }, [])

  const updateTicketTags = useCallback((ticketId, tags) => {
    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, tags } : t
    ))
  }, [])

  const assignTicket = useCallback((ticketId, staffId) => {
    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, assignedTo: staffId } : t
    ))
  }, [])

  const login = useCallback((login, password) => {
    const user = mockStaff.find(s => s.login === login) || mockStaff[2]
    setCurrentUser(user)
    setIsAuthenticated(true)
    return user
  }, [])

  const logout = useCallback(() => {
    setCurrentUser(null)
    setIsAuthenticated(false)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev)
  }, [])

  const addMessage = useCallback((ticketId, message) => {
    setTickets(prev => prev.map(t =>
      t.id === ticketId
        ? { ...t, messages: [...t.messages, message], lastMessage: message.text }
        : t
    ))
  }, [])

  const updateTicketStatus = useCallback((ticketId, status) => {
    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, status } : t
    ))
  }, [])

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
  }, [])

  const value = {
    isAuthenticated, currentUser, login, logout,
    sidebarCollapsed, toggleSidebar,
    tickets, setTickets, addMessage, updateTicketStatus,
    staff: staffList, shifts: shiftList, setShiftList, addShift, shiftLogs: shiftLogList, tags: tagList, roles: roleList,
    tasks: taskList, setTaskList,
    notifications, markNotificationRead,
    pinnedTicketIds, togglePinTicket,
    ticketDensityMode, setTicketDensityMode,
    savedFilters, setSavedFilters,
    selectedTicketIds, toggleTicketSelection, clearSelection,
    updateTicketPriority, updateTicketTags, assignTicket,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
