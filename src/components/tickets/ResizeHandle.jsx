import { useState, useCallback, useEffect } from 'react'

export default function ResizeHandle({ onResize, side = 'right' }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e) => {
      onResize(e.clientX, side)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isDragging, onResize, side])

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`w-1 shrink-0 cursor-col-resize transition-colors hover:bg-red-primary/40 ${
        isDragging ? 'bg-red-primary/60' : 'bg-border'
      }`}
    />
  )
}
