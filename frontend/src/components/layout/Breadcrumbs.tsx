import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('py-4', className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-secondary-text">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1 transition-colors hover:text-bottle-green"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1

          return (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight
                className="h-3.5 w-3.5 text-subtle-border"
                aria-hidden="true"
              />
              {isLast || !item.href ? (
                <span
                  className="font-medium text-primary-text"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="transition-colors hover:text-bottle-green"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
