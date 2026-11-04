import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  /** Current active page (1-based) */
  currentPage: number
  /** Total number of pages */
  totalPages: number
  /** Callback when page is changed */
  onPageChange: (page: number) => void
  /** Total items count across all pages */
  totalItems?: number
  /** Items per page */
  pageSize?: number
  /** Plural noun for the items, e.g. "products" */
  itemName?: string
  /** Additional CSS class names */
  className?: string
  /** Always show page summary even if only 1 page */
  showSummaryIfSinglePage?: boolean
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  itemName = 'products',
  className,
  showSummaryIfSinglePage = false,
}: PaginationProps) {
  if (totalPages <= 1 && !showSummaryIfSinglePage) {
    return null
  }

  // Calculate items range: e.g. "Showing 1–12 of 14 products"
  const startItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : undefined
  const endItem =
    totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : undefined

  // Generate page numbers array with ellipsis
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | string)[] = []
    pages.push(1)

    if (currentPage > 3) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage < totalPages - 2) {
      pages.push('...')
    }

    pages.push(totalPages)
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-subtle-border mt-8',
        className
      )}
    >
      {/* Left: Summary text */}
      <div className="text-xs sm:text-sm text-secondary-text">
        {totalItems != null && startItem != null && endItem != null ? (
          <span>
            Showing <strong className="font-semibold text-primary-text">{startItem}–{endItem}</strong> of{' '}
            <strong className="font-semibold text-primary-text">{totalItems}</strong> {itemName}
          </span>
        ) : (
          <span>
            Page <strong className="font-semibold text-primary-text">{currentPage}</strong> of{' '}
            <strong className="font-semibold text-primary-text">{totalPages}</strong>
          </span>
        )}
      </div>

      {/* Right: Page controls (only if totalPages > 1) */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Go to previous page"
            className={cn(
              'inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-colors border',
              currentPage <= 1
                ? 'opacity-40 border-subtle-border text-secondary-text cursor-not-allowed bg-warm-ivory/20'
                : 'border-subtle-border bg-white text-primary-text hover:bg-warm-ivory/60 hover:text-bottle-green hover:border-bottle-green/30 cursor-pointer shadow-2xs'
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Number Buttons */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((p, index) => {
              if (p === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 py-1 text-xs text-secondary-text select-none"
                  >
                    …
                  </span>
                )
              }

              const pageNum = Number(p)
              const isActive = pageNum === currentPage

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`Go to page ${pageNum}`}
                  className={cn(
                    'h-9 w-9 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center',
                    isActive
                      ? 'bg-bottle-green text-warm-ivory shadow-xs scale-105'
                      : 'border border-subtle-border bg-white text-primary-text hover:bg-warm-ivory hover:text-bottle-green hover:border-bottle-green/40 shadow-2xs'
                  )}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Go to next page"
            className={cn(
              'inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium transition-colors border',
              currentPage >= totalPages
                ? 'opacity-40 border-subtle-border text-secondary-text cursor-not-allowed bg-warm-ivory/20'
                : 'border-subtle-border bg-white text-primary-text hover:bg-warm-ivory/60 hover:text-bottle-green hover:border-bottle-green/30 cursor-pointer shadow-2xs'
            )}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </nav>
  )
}
