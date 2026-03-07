import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Copy, StickyNote } from 'lucide-react'

export default function ContextToolbar({ containerRef, onQuote, onCopy }) {
  const [position, setPosition] = useState(null)
  const [selectedText, setSelectedText] = useState('')

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection()
    const text = selection?.toString().trim()

    if (!text || !containerRef?.current) {
      setPosition(null)
      setSelectedText('')
      return
    }

    if (!containerRef.current.contains(selection.anchorNode)) {
      setPosition(null)
      return
    }

    try {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()

      setPosition({
        top: rect.top - containerRect.top - 44,
        left: rect.left - containerRect.left + rect.width / 2,
      })
      setSelectedText(text)
    } catch {
      setPosition(null)
    }
  }, [containerRef])

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange)
    return () => document.removeEventListener('selectionchange', handleSelectionChange)
  }, [handleSelectionChange])

  const handleQuote = () => {
    onQuote?.(selectedText)
    window.getSelection()?.removeAllRanges()
    setPosition(null)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedText)
    onCopy?.()
    window.getSelection()?.removeAllRanges()
    setPosition(null)
  }

  return (
    <AnimatePresence>
      {position && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 4 }}
          className="absolute z-30 flex gap-1 p-1 rounded-lg bg-bg-card border border-border shadow-xl"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translateX(-50%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <button
            onClick={handleQuote}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-text-secondary hover:text-red-light hover:bg-bg-hover rounded-md transition-colors cursor-pointer"
          >
            <Quote size={12} /> Цитата
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-text-secondary hover:text-red-light hover:bg-bg-hover rounded-md transition-colors cursor-pointer"
          >
            <Copy size={12} /> Копировать
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
