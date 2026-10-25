import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  /** Lucide icon component to display */
  icon: LucideIcon
  /** Heading text */
  title: string
  /** Supporting description */
  description: string
  /** Optional call-to-action button label */
  actionLabel?: string
  /** Callback fired when the action button is clicked */
  onAction?: () => void
  /** Additional CSS classes for the root container */
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
      role="status"
    >
      <div className="mb-4 rounded-full bg-warm-ivory p-4">
        <Icon
          className="h-10 w-10 text-secondary-text"
          aria-hidden="true"
          strokeWidth={1.5}
        />
      </div>

      <h3 className="text-lg font-semibold text-primary-text">{title}</h3>

      <p className="mt-2 max-w-sm text-sm text-secondary-text leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full bg-bottle-green px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-green focus-visible:ring-2 focus-visible:ring-bottle-green focus-visible:ring-offset-2"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
