import { useEffect, useState } from 'react'

export default function AnimatedNumber({ value, duration = 800, className = '' }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const num = typeof value === 'number' ? value : parseInt(value) || 0
    const start = display
    const diff = num - start
    if (diff === 0) return
    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplay(Math.round(start + diff * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value, duration])

  return <span className={className}>{display}</span>
}
