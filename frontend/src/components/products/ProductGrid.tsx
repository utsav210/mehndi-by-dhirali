import type { Product } from '@/types'
import { cn } from '@/lib/utils'
import ProductCard from './ProductCard'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'
import EmptyState from '@/components/ui/EmptyState'
import { Sparkles } from 'lucide-react'

interface ProductGridProps {
  /** List of products to display */
  products: Product[]
  /** Show loading skeleton placeholders */
  isLoading?: boolean
  /** Number of columns on desktop (default 4) */
  columns?: 2 | 3 | 4
  /** Additional CSS classes for the grid wrapper */
  className?: string
  /** Whether to show empty state when products array is empty */
  showEmptyState?: boolean
  /** Custom empty state message */
  emptyMessage?: string
}

const COLUMN_CLASSES = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
} as const

export default function ProductGrid({
  products,
  isLoading = false,
  columns = 4,
  className,
  showEmptyState = true,
  emptyMessage = 'Fresh batches of organic henna cones and bridal kits are currently being prepared. Check back shortly for our collection launch!',
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 gap-6', COLUMN_CLASSES[columns], className)}>
        <LoadingSkeleton variant="product-card" count={columns} />
      </div>
    )
  }

  if (products.length === 0 && showEmptyState) {
    return (
      <div className="py-12 px-4 rounded-2xl border border-dashed border-subtle-border bg-warm-ivory/30 text-center my-6">
        <EmptyState
          icon={Sparkles}
          title="New Collection Launching Soon"
          description={emptyMessage}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-6',
        COLUMN_CLASSES[columns],
        className
      )}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
