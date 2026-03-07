import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../ui/Card'
import AnimatedNumber from '../ui/AnimatedNumber'

export default function StatCard({ icon: Icon, label, value, trend, trendValue, delay = 0 }) {
  const isPositive = trend === 'up'
  const isNumeric = typeof value === 'number'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-text-muted text-sm">{label}</p>
            {isNumeric ? (
              <AnimatedNumber value={value} className="text-2xl font-heading font-bold mt-1 block" />
            ) : (
              <p className="text-2xl font-heading font-bold mt-1">{value}</p>
            )}
          </div>
          <div className="p-2.5 bg-red-primary/10 rounded-xl">
            <Icon size={22} className="text-red-primary" />
          </div>
        </div>
        {trendValue && (
          <div className="flex items-center gap-1 mt-3">
            {isPositive ? (
              <TrendingUp size={14} className="text-success" />
            ) : (
              <TrendingDown size={14} className="text-red-light" />
            )}
            <span className={`text-xs font-medium ${isPositive ? 'text-success' : 'text-red-light'}`}>
              {trendValue}
            </span>
            <span className="text-xs text-text-muted">vs вчера</span>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
