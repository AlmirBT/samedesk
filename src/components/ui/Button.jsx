import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-gradient-to-r from-red-primary to-red-dark text-white hover:from-red-light hover:to-red-primary shadow-lg shadow-red-primary/20',
  secondary: 'bg-bg-card text-text-primary border border-border hover:bg-bg-hover hover:border-red-primary/50',
  ghost: 'bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary',
  danger: 'bg-red-dark/20 text-red-light border border-red-dark/50 hover:bg-red-dark/40 hover:border-red-primary',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
}

export default function Button({ children, variant = 'primary', size = 'md', loading = false, icon, disabled, className = '', onClick, type = 'button', ...props }) {
  return (
    <motion.button
      type={type}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors cursor-pointer ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={size === 'sm' ? 14 : 16} /> : icon}
      {children}
    </motion.button>
  )
}
