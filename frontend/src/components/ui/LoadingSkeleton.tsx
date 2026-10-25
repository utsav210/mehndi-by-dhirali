import { cn } from '@/lib/utils'

type SkeletonVariant = 'text' | 'image' | 'card' | 'product-card'

interface LoadingSkeletonProps {
  /** Visual style variant */
  variant?: SkeletonVariant
  /** Additional CSS classes */
  className?: string
  /** Number of skeleton instances to render */
  count?: number
}

function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-sand-beige',
        className
      )}
      aria-hidden="true"
    />
  )
}

function TextSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-3', className)}>
      <ShimmerBlock className="h-4 w-3/4" />
      <ShimmerBlock className="h-4 w-full" />
      <ShimmerBlock className="h-4 w-5/6" />
    </div>
  )
}

function ImageSkeleton({ className }: { className?: string }) {
  return (
    <ShimmerBlock
      className={cn('aspect-square w-full rounded-lg bg-warm-ivory', className)}
    />
  )
}

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-subtle-border bg-white p-4 space-y-4',
        className
      )}
    >
      <ShimmerBlock className="aspect-video w-full rounded-md bg-warm-ivory" />
      <div className="space-y-2">
        <ShimmerBlock className="h-4 w-3/4" />
        <ShimmerBlock className="h-3 w-1/2" />
      </div>
    </div>
  )
}

function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-lg border border-subtle-border bg-white overflow-hidden',
        className
      )}
    >
      {/* Image placeholder */}
      <ShimmerBlock className="aspect-[3/4] w-full rounded-none bg-warm-ivory" />

      {/* Content area */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <ShimmerBlock className="h-3 w-1/3" />
        {/* Product name */}
        <ShimmerBlock className="h-5 w-4/5" />
        {/* Price */}
        <ShimmerBlock className="h-4 w-1/4" />
        {/* Add to cart button */}
        <ShimmerBlock className="h-10 w-full rounded-full" />
      </div>
    </div>
  )
}

const VARIANT_MAP: Record<SkeletonVariant, React.ComponentType<{ className?: string }>> = {
  text: TextSkeleton,
  image: ImageSkeleton,
  card: CardSkeleton,
  'product-card': ProductCardSkeleton,
}

export default function LoadingSkeleton({
  variant = 'text',
  className,
  count = 1,
}: LoadingSkeletonProps) {
  const Component = VARIANT_MAP[variant]

  return (
    <div role="status" aria-label="Loading…" className="contents">
      {Array.from({ length: count }, (_, i) => (
        <Component key={i} className={className} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  )
}
