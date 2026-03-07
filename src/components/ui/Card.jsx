import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext'

export default function Card({ children, hover = true, className = '', onClick, ...props }) {
  const { theme } = useApp()
  const hoverShadow = theme === 'light'
    ? '0 8px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(220, 38, 38, 0.08)'
    : '0 8px 30px rgba(229, 62, 62, 0.1), 0 0 0 1px rgba(229, 62, 62, 0.05)'

  return (
    <motion.div
      className={`glass-card p-4 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hover ? { y: -2, boxShadow: hoverShadow } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      layout
      {...props}
    >
      {children}
    </motion.div>
  )
}
