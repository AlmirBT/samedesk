import { useState, useEffect } from 'react'

const HOUR_WIDTH = 56

export default function NowLine() {
  const [pos, setPos] = useState(() => calcPos())

  function calcPos() {
    const now = new Date()
    return (now.getHours() + now.getMinutes() / 60) * HOUR_WIDTH
  }

  useEffect(() => {
    const interval = setInterval(() => setPos(calcPos()), 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="absolute top-0 bottom-0 z-20 pointer-events-none"
      style={{ left: `${120 + pos}px` }}
    >
      <div className="w-2.5 h-2.5 rounded-full bg-red-primary -ml-[4px] -mt-1" style={{ boxShadow: '0 0 8px rgba(229,62,62,0.6)' }} />
      <div className="w-0.5 h-full bg-red-primary mx-auto" style={{ boxShadow: '0 0 6px rgba(229,62,62,0.4)' }} />
    </div>
  )
}
