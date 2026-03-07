const statusColors = {
  online: 'bg-success',
  offline: 'bg-text-muted',
  on_shift: 'bg-red-primary',
  break: 'bg-warning',
  active: 'bg-success',
}

const dotSizes = {
  sm: 'w-2.5 h-2.5',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
}

export default function StatusDot({ status = 'offline', size = 'md', pulse }) {
  const shouldPulse = pulse ?? (status === 'online' || status === 'active')
  const color = statusColors[status] || statusColors.offline

  return (
    <span className={`inline-block rounded-full ${dotSizes[size]} ${color} ${shouldPulse ? 'pulse-dot' : ''}`} />
  )
}
