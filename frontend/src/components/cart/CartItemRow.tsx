import { Minus, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { CartItem } from '@/types'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'

interface CartItemRowProps {
  /** The cart item to display */
  item: CartItem
  /** Layout variant — compact for drawer, full for cart page */
  variant?: 'compact' | 'full'
}

export default function CartItemRow({
  item,
  variant = 'compact',
}: CartItemRowProps) {
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)

  const lineTotal = item.price_minor * item.quantity
  const isOnSale =
    item.compare_at_price_minor != null &&
    item.compare_at_price_minor > item.price_minor

  const isCompact = variant === 'compact'

  return (
    <div
      className={cn(
        'flex gap-3 border-b border-subtle-border py-4',
        !isCompact && 'gap-4 py-6 sm:gap-6'
      )}
    >
      {/* Product Image */}
      <Link
        to={`/products/${item.product_slug}`}
        className={cn(
          'flex-shrink-0 overflow-hidden rounded-lg bg-warm-ivory',
          isCompact ? 'h-16 w-16' : 'h-24 w-24 sm:h-28 sm:w-28'
        )}
      >
        {item.product_image ? (
          <img
            src={item.product_image}
            alt={item.product_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-secondary-text">
            No image
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/products/${item.product_slug}`}
              className={cn(
                'block truncate font-medium text-primary-text transition-colors hover:text-bottle-green',
                isCompact ? 'text-sm' : 'text-base'
              )}
            >
              {item.product_name}
            </Link>

            {/* Price per unit */}
            <div className="mt-0.5 flex items-center gap-2">
              <span
                className={cn(
                  'font-semibold text-bottle-green',
                  isCompact ? 'text-xs' : 'text-sm'
                )}
              >
                {formatPrice(item.price_minor)}
              </span>
              {isOnSale && (
                <span
                  className={cn(
                    'text-secondary-text line-through',
                    isCompact ? 'text-xs' : 'text-sm'
                  )}
                >
                  {formatPrice(item.compare_at_price_minor!)}
                </span>
              )}
            </div>
          </div>

          {/* Line total - shown on full variant */}
          {!isCompact && (
            <span className="flex-shrink-0 text-sm font-bold text-primary-text sm:text-base">
              {formatPrice(lineTotal)}
            </span>
          )}
        </div>

        {/* Quantity controls + remove */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center rounded-full border border-subtle-border">
            <button
              type="button"
              onClick={() =>
                updateQuantity(item.product_id, item.quantity - 1)
              }
              className={cn(
                'flex items-center justify-center rounded-l-full text-secondary-text transition-colors hover:bg-warm-ivory hover:text-primary-text',
                isCompact ? 'h-7 w-7' : 'h-8 w-8'
              )}
              aria-label={`Decrease quantity of ${item.product_name}`}
            >
              <Minus className={isCompact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            </button>

            <span
              className={cn(
                'flex items-center justify-center font-medium text-primary-text',
                isCompact
                  ? 'min-w-[1.5rem] text-xs'
                  : 'min-w-[2rem] text-sm'
              )}
              aria-label={`Quantity: ${item.quantity}`}
            >
              {item.quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                updateQuantity(item.product_id, item.quantity + 1)
              }
              disabled={item.quantity >= item.stock_quantity}
              className={cn(
                'flex items-center justify-center rounded-r-full text-secondary-text transition-colors hover:bg-warm-ivory hover:text-primary-text disabled:cursor-not-allowed disabled:opacity-40',
                isCompact ? 'h-7 w-7' : 'h-8 w-8'
              )}
              aria-label={`Increase quantity of ${item.product_name}`}
            >
              <Plus className={isCompact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => removeItem(item.product_id)}
            className={cn(
              'flex items-center gap-1 text-secondary-text transition-colors hover:text-error',
              isCompact ? 'text-xs' : 'text-sm'
            )}
            aria-label={`Remove ${item.product_name} from cart`}
          >
            <Trash2 className={isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
            {!isCompact && <span>Remove</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
