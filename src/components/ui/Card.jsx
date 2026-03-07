import { motion } from 'framer-motion'

export default function Card({ children, hover = true, className = '', onClick, ...props }) {
  return (
    <motion.div
      className={`glass-card p-4 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      whileHover={hover ? { y: -2, boxShadow: '0 8px 30px rgba(229, 62, 62, 0.1), 0 0 0 1px rgba(229, 62, 62, 0.05)' } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      layout
      {...props}
    >
      {children}
    </motion.div>
  )
}
