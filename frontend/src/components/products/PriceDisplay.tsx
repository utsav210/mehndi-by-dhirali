import { cn, formatPrice, getDiscountPercentage } from '@/lib/utils'

interface PriceDisplayProps {
  /** Current price in minor units (paise) */
  priceMinor: number
  /** Original comparison price in minor units — null means no discount */
  compareAtPriceMinor?: number | null
  /** Text size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Additional CSS classes */
  className?: string
}

const SIZE_CLASSES = {
  sm: { current: 'text-sm', original: 'text-xs', badge: 'text-[10px] px-1.5 py-px' },
  md: { current: 'text-base', original: 'text-sm', badge: 'text-xs px-2 py-0.5' },
  lg: { current: 'text-xl', original: 'text-base', badge: 'text-xs px-2.5 py-0.5' },
} as const

export default function PriceDisplay({
  priceMinor,
  compareAtPriceMinor,
  size = 'md',
  className,
}: PriceDisplayProps) {
  const isOnSale =
    compareAtPriceMinor != null && compareAtPriceMinor > priceMinor
  const classes = SIZE_CLASSES[size]
  const discount = isOnSale
    ? getDiscountPercentage(compareAtPriceMinor, priceMinor)
    : 0

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {/* Original price (strikethrough) — placed first to match boutique price showcase */}
      {isOnSale && (
        <span
          className={cn(
            'text-secondary-text/80 line-through font-normal',
            classes.original
          )}
          aria-label={`Original price ${formatPrice(compareAtPriceMinor)}`}
        >
          {formatPrice(compareAtPriceMinor)}
        </span>
      )}

      {/* Current / discounted price */}
      <span
        className={cn(
          'font-bold text-bottle-green',
          classes.current
        )}
      >
        {formatPrice(priceMinor)}
      </span>

      {/* Discount % badge */}
      {isOnSale && discount > 0 && (
        <span
          className={cn(
            'inline-flex items-center rounded-full bg-antique-gold font-semibold text-forest-green',
            classes.badge
          )}
          aria-label={`${discount}% off`}
        >
          -{discount}%
        </span>
      )}
    </div>
  )
}
