import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  /** Error heading */
  title?: string
  /** Detailed error message */
  message?: string
  /** Callback fired when the retry button is clicked */
  onRetry?: () => void
  /** Additional CSS classes */
  className?: string
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'We couldn\u2019t load this content. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
      role="alert"
    >
      <div className="mb-4 rounded-full bg-red-50 p-4">
        <AlertTriangle
          className="h-10 w-10 text-error"
          aria-hidden="true"
          strokeWidth={1.5}
        />
      </div>

      <h3 className="text-lg font-semibold text-primary-text">{title}</h3>

      <p className="mt-2 max-w-sm text-sm text-secondary-text leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full bg-bottle-green px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-green focus-visible:ring-2 focus-visible:ring-bottle-green focus-visible:ring-offset-2"
        >
          Try Again
        </button>
      )}
    </div>
  )
}
