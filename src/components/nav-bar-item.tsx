import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface NabBarItemProps {
  to: string
  icon?: LucideIcon
  label: string
}

function NabBarItem({ to, icon: Icon, label }: NabBarItemProps) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={cn('flex items-center gap-3 rounded-lg px-3 py-2 transition-all', {
        'bg-muted text-primary': isActive,
        'text-muted-foreground': !isActive,
      })}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Link>
  )
}

export default NabBarItem
