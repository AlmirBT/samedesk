const variantClasses = {
  text: 'h-4 rounded',
  title: 'h-6 w-48 rounded',
  circle: 'rounded-full',
  card: 'h-24 rounded-xl',
  avatar: 'w-9 h-9 rounded-lg',
}

export default function SkeletonLoader({ variant = 'text', width, height, className = '' }) {
  const style = {}
  if (width) style.width = width
  if (height) style.height = height

  return (
    <div
      className={`skeleton ${variantClasses[variant] || variantClasses.text} ${className}`}
      style={style}
    />
  )
}
