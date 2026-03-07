import { motion } from 'framer-motion'
import { Reply, Forward, Link2, Copy } from 'lucide-react'

export default function MessageToolbar({ message, onReply, onForward, onCopyLink, platform, isStaff }) {
  const replyDisabled = platform === 'email'

  const buttons = [
    {
      icon: Reply,
      label: 'Ответить',
      onClick: onReply,
      disabled: replyDisabled,
      tooltip: replyDisabled ? 'Reply недоступен для email' : 'Ответить',
    },
    { icon: Forward, label: 'Переслать', onClick: onForward, tooltip: 'Переслать' },
    { icon: Link2, label: 'Ссылка', onClick: onCopyLink, tooltip: 'Скопировать ссылку' },
    {
      icon: Copy,
      label: 'Копировать',
      onClick: () => navigator.clipboard.writeText(message.text),
      tooltip: 'Копировать текст',
    },
  ]

  return (
    <motion.div
      initial={{ scale: 0.88, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.88, opacity: 0 }}
      transition={{ duration: 0.15 }}
      className={`absolute -top-8 ${isStaff ? 'right-0' : 'left-0'} flex gap-0.5 glass-card px-1 py-0.5 z-20`}
    >
      {buttons.map(btn => (
        <button
          key={btn.label}
          onClick={btn.disabled ? undefined : btn.onClick}
          disabled={btn.disabled}
          title={btn.tooltip}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
            btn.disabled
              ? 'text-text-muted/30 cursor-not-allowed'
              : 'text-text-muted hover:text-text-primary hover:bg-bg-hover'
          }`}
        >
          <btn.icon size={12} />
        </button>
      ))}
    </motion.div>
  )
}
