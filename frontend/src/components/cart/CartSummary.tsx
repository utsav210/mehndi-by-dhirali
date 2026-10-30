import { Link } from 'react-router-dom'
import { Shield, Truck, RotateCcw } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'

interface CartSummaryProps {
  /** Discount amount in minor units */
  discountMinor?: number
  /** Whether shipping has been calculated */
  shippingMinor?: number | null
  /** Label for the primary CTA button */
  ctaLabel?: string
  /** URL for the primary CTA button */
  ctaHref?: string
  /** Direct click handler (overrides ctaHref when provided) */
  onCtaClick?: () => void
  /** Whether the CTA button is disabled */
  ctaDisabled?: boolean
  /** Additional CSS classes */
  className?: string
}

const trustBadges = [
  { icon: Shield, label: 'Secure Checkout' },
  { icon: Truck, label: 'Fast Delivery' },
  { icon: RotateCcw, label: 'Easy Returns' },
] as const

export default function CartSummary({
  discountMinor = 0,
  shippingMinor = null,
  ctaLabel = 'Proceed to Checkout',
  ctaHref = '/checkout',
  onCtaClick,
  ctaDisabled = false,
  className,
}: CartSummaryProps) {
  const getSubtotal = useCartStore((s) => s.getSubtotal)
  const getShippingMinor = useCartStore((s) => s.getShippingMinor)
  const items = useCartStore((s) => s.items)

  const subtotal = getSubtotal()
  const shippingAmount = shippingMinor != null ? shippingMinor : getShippingMinor()
  const shippingDisplay = shippingAmount === 0 ? 'Free' : formatPrice(shippingAmount)

  const total = subtotal - discountMinor + shippingAmount

  if (items.length === 0) return null

  const ctaContent = (
    <span className="text-sm font-medium">{ctaLabel}</span>
  )

  return (
    <div
      className={cn(
        'rounded-xl border border-subtle-border bg-white p-6',
        className
      )}
    >
      <h3 className="mb-4 font-serif text-lg font-semibold text-primary-text">
        Order Summary
      </h3>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-text">Subtotal</span>
          <span className="font-medium text-primary-text">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-text">Shipping</span>
          <span
            className={cn(
              'font-medium',
              shippingDisplay === 'Free'
                ? 'text-success'
                : 'text-primary-text'
            )}
          >
            {shippingDisplay}
          </span>
        </div>

        {/* Discount */}
        {discountMinor > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-text">Discount</span>
            <span className="font-medium text-success">
              −{formatPrice(discountMinor)}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-subtle-border" />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-primary-text">
            Total
          </span>
          <span className="text-lg font-bold text-bottle-green">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6">
        {onCtaClick ? (
          <button
            type="button"
            onClick={onCtaClick}
            disabled={ctaDisabled}
            className="w-full rounded-full bg-bottle-green py-3 text-center text-sm font-medium text-white transition-colors hover:bg-forest-green focus-visible:ring-2 focus-visible:ring-bottle-green focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {ctaContent}
          </button>
        ) : (
          <Link
            to={ctaHref}
            className={cn(
              'block w-full rounded-full bg-bottle-green py-3 text-center text-sm font-medium text-white transition-colors hover:bg-forest-green focus-visible:ring-2 focus-visible:ring-bottle-green focus-visible:ring-offset-2',
              ctaDisabled && 'pointer-events-none opacity-50'
            )}
            aria-disabled={ctaDisabled}
          >
            {ctaContent}
          </Link>
        )}
      </div>

      {/* Trust badges */}
      <div className="mt-5 flex items-center justify-center gap-4 border-t border-subtle-border pt-4">
        {trustBadges.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 text-center"
          >
            <Icon
              className="h-4 w-4 text-bottle-green"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <span className="text-[10px] leading-tight text-secondary-text">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
