import { cn, getDiscountPercentage } from '@/lib/utils'

interface DiscountBadgeProps {
  /** Original price in minor units (paise) */
  originalPrice: number
  /** Current/sale price in minor units (paise) */
  currentPrice: number
  /** Additional CSS classes */
  className?: string
}

export default function DiscountBadge({
  originalPrice,
  currentPrice,
  className,
}: DiscountBadgeProps) {
  const discount = getDiscountPercentage(originalPrice, currentPrice)

  if (discount <= 0) return null

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-antique-gold px-2.5 py-0.5 text-xs font-semibold text-forest-green',
        className
      )}
      aria-label={`${discount}% off`}
    >
      -{discount}%
    </span>
  )
}
