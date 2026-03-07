const priorityColors = {
  0: '#4A5568',
  1: '#48BB78',
  2: '#ECC94B',
  3: '#ED8936',
  4: '#E53E3E',
  5: '#C53030',
}

export default function PriorityBar({ priority = 0 }) {
  return (
    <div
      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
      style={{ backgroundColor: priorityColors[priority] || priorityColors[0] }}
    />
  )
}
