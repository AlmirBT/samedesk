import { useState, useCallback, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useApp } from '../context/AppContext'
import TicketList from '../components/tickets/TicketList'
import ChatView from '../components/tickets/ChatView'
import TicketInfoPanel from '../components/tickets/TicketInfoPanel'
import ResizeHandle from '../components/tickets/ResizeHandle'
import PlayerProfileDrawer from '../components/tickets/PlayerProfileDrawer'
import BulkActionsBar from '../components/tickets/BulkActionsBar'
import UndoToast from '../components/tickets/UndoToast'

export default function Tickets() {
  const { tickets, selectedTicketIds, updateTicketStatus } = useApp()
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showListPanel, setShowListPanel] = useState(true)
  const [showInfoPanel, setShowInfoPanel] = useState(false)
  const [listWidth, setListWidth] = useState(300)
  const [infoWidth, setInfoWidth] = useState(320)
  const [playerDrawerNick, setPlayerDrawerNick] = useState(null)
  const [undoToasts, setUndoToasts] = useState([])
  const containerRef = useRef(null)

  const selectedId = ticketId || null
  const selectedTicket = tickets.find(t => t.id === selectedId)

  // Redirect if ticketId doesn't exist
  if (ticketId && !selectedTicket) {
    navigate('/tickets', { replace: true })
  }

  const highlightMessageId = searchParams.get('msg')

  const handleSelectTicket = useCallback((id) => {
    navigate('/tickets/' + id)
  }, [navigate])

  const handleCloseWithUndo = useCallback((tktId) => {
    const ticket = tickets.find(t => t.id === tktId)
    if (!ticket) return
    const prevStatus = ticket.status
    const toastId = Date.now()
    updateTicketStatus(tktId, 'closed')
    setUndoToasts(prev => [...prev, { id: toastId, ticketId: tktId, previousStatus: prevStatus }])
  }, [tickets, updateTicketStatus])

  const handleUndo = useCallback((toastId, tktId, prevStatus) => {
    updateTicketStatus(tktId, prevStatus)
    setUndoToasts(prev => prev.filter(t => t.id !== toastId))
  }, [updateTicketStatus])

  const handleUndoExpire = useCallback((toastId) => {
    setUndoToasts(prev => prev.filter(t => t.id !== toastId))
  }, [])

  const handleResize = useCallback((clientX, side) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()

    if (side === 'right') {
      const newWidth = Math.max(220, Math.min(500, clientX - rect.left))
      setListWidth(newWidth)
    } else if (side === 'left') {
      const newWidth = Math.max(250, Math.min(450, rect.right - clientX))
      setInfoWidth(newWidth)
    }
  }, [])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[calc(100vh-7rem)] -m-6 bg-bg-base relative"
    >
      {/* Left panel — ticket list */}
      <AnimatePresence>
        {showListPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: listWidth, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-r border-border bg-bg-surface flex flex-col shrink-0 overflow-hidden"
            style={{ width: listWidth }}
          >
            <TicketList
              tickets={tickets}
              selectedId={selectedId}
              onSelect={handleSelectTicket}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resize handle — list/chat */}
      {showListPanel && (
        <ResizeHandle onResize={handleResize} side="right" />
      )}

      {/* Center panel — chat or placeholder */}
      <div className="flex-1 min-w-0 flex flex-col relative">
        {/* Panel toggle buttons */}
        <div className="absolute top-3 left-3 z-10 flex gap-1">
          <button
            onClick={() => setShowListPanel(prev => !prev)}
            className="p-1.5 rounded-lg bg-bg-card/80 border border-border hover:bg-bg-hover transition-colors cursor-pointer"
            style={{ backdropFilter: 'blur(8px)' }}
            title={showListPanel ? 'Скрыть список' : 'Показать список'}
          >
            {showListPanel ? <PanelLeftClose size={14} className="text-text-muted" /> : <PanelLeftOpen size={14} className="text-text-muted" />}
          </button>
        </div>

        {selectedTicket && (
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={() => setShowInfoPanel(prev => !prev)}
              className="p-1.5 rounded-lg bg-bg-card/80 border border-border hover:bg-bg-hover transition-colors cursor-pointer"
              style={{ backdropFilter: 'blur(8px)' }}
              title={showInfoPanel ? 'Скрыть информацию' : 'Показать информацию'}
            >
              {showInfoPanel ? <PanelRightClose size={14} className="text-text-muted" /> : <PanelRightOpen size={14} className="text-text-muted" />}
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedTicket ? (
            <motion.div
              key={ticketId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <ChatView
                ticket={selectedTicket}
                onOpenPlayerDrawer={setPlayerDrawerNick}
                onCloseTicket={handleCloseWithUndo}
                highlightMessageId={highlightMessageId}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full text-text-muted"
            >
              <div className="text-center">
                <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-heading">Выберите обращение</p>
                <p className="text-sm mt-1">Выберите обращение из списка слева</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Resize handle — chat/info */}
      {showInfoPanel && selectedTicket && (
        <ResizeHandle onResize={handleResize} side="left" />
      )}

      {/* Right panel — ticket info */}
      <AnimatePresence>
        {showInfoPanel && selectedTicket && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: infoWidth, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-l border-border shrink-0 overflow-hidden"
            style={{ width: infoWidth }}
          >
            <TicketInfoPanel ticket={selectedTicket} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Profile Drawer */}
      <PlayerProfileDrawer
        nick={playerDrawerNick}
        isOpen={!!playerDrawerNick}
        onClose={() => setPlayerDrawerNick(null)}
      />

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedTicketIds.size > 0 && <BulkActionsBar />}
      </AnimatePresence>

      {/* Undo Toasts */}
      <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2">
        <AnimatePresence>
          {undoToasts.map(ut => (
            <UndoToast
              key={ut.id}
              ticketId={ut.ticketId}
              onUndo={() => handleUndo(ut.id, ut.ticketId, ut.previousStatus)}
              onExpire={() => handleUndoExpire(ut.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
