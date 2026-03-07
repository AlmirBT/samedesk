import StatusDot from './StatusDot'

const sizeClasses = {
  xs: 'w-5 h-5',
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

export default function Avatar({ src, nick = 'Steve', size = 'md', status, className = '' }) {
  const imgSrc = src || `https://mc-heads.net/avatar/${nick}/64`

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <img
        src={imgSrc}
        alt={nick}
        className={`${sizeClasses[size]} rounded-lg object-cover bg-bg-card`}
        loading="lazy"
      />
      {status && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <StatusDot status={status} size="sm" />
        </div>
      )}
    </div>
  )
}
