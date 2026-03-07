import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { tickets as mockTickets, staff as mockStaff, shifts as mockShifts, tags as mockTags, roles as mockRoles, tasks as mockTasks, shiftLogs as mockShiftLogs, incidents as mockIncidents } from '../data/mockData'
import useLocalStorage from '../hooks/useLocalStorage'

const AppContext = createContext(null)

// Migrate old savedFilters format to new multi-select format
function migrateFilters(filters) {
  if (filters && Array.isArray(filters.statuses)) return filters
  return { statuses: [], platforms: [], departments: [], search: filters?.search || '' }
}

export function AppProvider({ children }) {
  // Theme
  const [theme, setTheme] = useLocalStorage('theme', 'dark')
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [currentUser, setCurrentUser] = useState(mockStaff[0])
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
  const [incidentList, setIncidentList] = useState(mockIncidents)
  const [notifications, setNotifications] = useState([
    { id: 'n1', text: 'Новое обращение TKT-005', read: false, time: '2 мин назад' },
    { id: 'n2', text: 'Смена начинается через 10 минут', read: false, time: '8 мин назад' },
    { id: 'n3', text: 'Задача "Расследовать дюп баг" назначена вам', read: true, time: '1 час назад' },
  ])

  // Ticket-specific state
  const [pinnedTicketIds, setPinnedTicketIds] = useLocalStorage('pinnedTicketIds', [])
  const [ticketDensityMode, setTicketDensityMode] = useLocalStorage('ticketDensityMode', 'normal')
  const [savedFiltersRaw, setSavedFiltersRaw] = useLocalStorage('savedFilters', { statuses: [], platforms: [], departments: [], search: '' })
  const savedFilters = migrateFilters(savedFiltersRaw)
  const setSavedFilters = useCallback((val) => {
    setSavedFiltersRaw(prev => {
      const migrated = migrateFilters(prev)
      const next = typeof val === 'function' ? val(migrated) : val
      return next
    })
  }, [setSavedFiltersRaw])
  const [selectedTicketIds, setSelectedTicketIds] = useState(new Set())

  // Quick Mode
  const [quickMode, setQuickMode] = useLocalStorage('quickMode', false)

  // Active Viewers — { 'TKT-001': ['staff_1', 'staff_3'] }
  const [activeViewers, setActiveViewers] = useState({})

  const viewTicket = useCallback((ticketId) => {
    setActiveViewers(prev => {
      const onlineStaff = mockStaff.filter(s => s.status === 'online' || s.status === 'on_shift')
      const others = onlineStaff
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3))
        .map(s => s.id)
      return { ...prev, [ticketId]: others }
    })
  }, [])

  const leaveTicket = useCallback((ticketId) => {
    setActiveViewers(prev => {
      const next = { ...prev }
      delete next[ticketId]
      return next
    })
  }, [])

  const getNextPriorityTicket = useCallback((excludeId) => {
    return tickets
      .filter(t => (t.status === 'open' || t.status === 'in_progress') && t.id !== excludeId)
      .sort((a, b) => b.priority - a.priority)[0] || null
  }, [tickets])

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

  // === Incidents ===
  const broadcastToIncident = useCallback((incidentId, text, staffId) => {
    setIncidentList(prev => prev.map(inc => {
      if (inc.id !== incidentId) return inc
      const entry = {
        id: `bc_${Date.now()}`,
        text,
        sentAt: new Date().toISOString(),
        sentBy: staffId,
        ticketCount: inc.linkedTicketIds.length,
      }
      return { ...inc, broadcastLog: [...inc.broadcastLog, entry] }
    }))
    // Send message to every linked ticket
    const incident = incidentList.find(i => i.id === incidentId)
    if (incident) {
      incident.linkedTicketIds.forEach(ticketId => {
        const msg = {
          id: `msg_bc_${Date.now()}_${ticketId}`,
          ticketId,
          from: 'staff',
          text,
          attachments: [],
          timestamp: new Date().toISOString(),
          isInternal: false,
        }
        setTickets(prev => prev.map(t =>
          t.id === ticketId
            ? { ...t, messages: [...t.messages, msg], lastMessage: text }
            : t
        ))
      })
    }
  }, [incidentList])

  const addIncident = useCallback((incident) => {
    setIncidentList(prev => [...prev, { ...incident, id: `INC-${String(prev.length + 1).padStart(3, '0')}` }])
  }, [])

  const updateIncidentStatus = useCallback((incidentId, status) => {
    setIncidentList(prev => prev.map(inc =>
      inc.id === incidentId ? { ...inc, status } : inc
    ))
  }, [])

  const linkTicketToIncident = useCallback((incidentId, ticketId) => {
    setIncidentList(prev => prev.map(inc =>
      inc.id === incidentId && !inc.linkedTicketIds.includes(ticketId)
        ? { ...inc, linkedTicketIds: [...inc.linkedTicketIds, ticketId] }
        : inc
    ))
  }, [])

  const unlinkTicketFromIncident = useCallback((incidentId, ticketId) => {
    setIncidentList(prev => prev.map(inc =>
      inc.id === incidentId
        ? { ...inc, linkedTicketIds: inc.linkedTicketIds.filter(id => id !== ticketId) }
        : inc
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
    incidents: incidentList, setIncidentList, broadcastToIncident, addIncident, updateIncidentStatus, linkTicketToIncident, unlinkTicketFromIncident,
    notifications, markNotificationRead,
    pinnedTicketIds, togglePinTicket,
    ticketDensityMode, setTicketDensityMode,
    savedFilters, setSavedFilters,
    selectedTicketIds, toggleTicketSelection, clearSelection,
    updateTicketPriority, updateTicketTags, assignTicket,
    quickMode, setQuickMode,
    activeViewers, viewTicket, leaveTicket,
    getNextPriorityTicket,
    theme, setTheme,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
