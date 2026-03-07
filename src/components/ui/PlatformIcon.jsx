import { MessageCircle, Send, Headphones, Mail } from 'lucide-react'

const platforms = {
  vk: { icon: MessageCircle, label: 'ВКонтакте' },
  telegram: { icon: Send, label: 'Telegram' },
  discord: { icon: Headphones, label: 'Discord' },
  email: { icon: Mail, label: 'Email' },
}

export default function PlatformIcon({ platform = 'email', size = 16, className = '' }) {
  const { icon: Icon, label } = platforms[platform] || platforms.email
  return <Icon size={size} className={`text-text-secondary ${className}`} aria-label={label} />
}
