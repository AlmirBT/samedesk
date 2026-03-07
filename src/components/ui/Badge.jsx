import { motion, useAnimationControls } from 'framer-motion'
import { useEffect, useRef } from 'react'

const colorMap = {
  red: 'bg-red-primary/20 text-red-light',
  green: 'bg-success/20 text-success',
  yellow: 'bg-warning/20 text-warning',
  gray: 'bg-bg-hover text-text-secondary',
  default: 'bg-red-primary/20 text-red-light',
}

export default function Badge({ children, color = 'default', className = '' }) {
  const controls = useAnimationControls()
  const prevRef = useRef(children)

  useEffect(() => {
    if (prevRef.current !== children) {
      controls.start({ scale: [1, 1.2, 1], transition: { duration: 0.3 } })
      prevRef.current = children
    }
  }, [children, controls])

  return (
    <motion.span
      animate={controls}
      className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold rounded-full min-w-[20px] ${colorMap[color] || colorMap.default} ${className}`}
    >
      {children}
    </motion.span>
  )
}
