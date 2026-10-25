import { useState } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { cn, getDiscountPercentage } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import PriceDisplay from './PriceDisplay'

interface ProductCardProps {
  /** Product data to display */
  product: Product
  /** Additional CSS classes */
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const primaryImage = product.images.find((img) => img.is_primary) ?? product.images[0]
  const isOutOfStock = product.stock_quantity <= 0
  const isOnSale =
    product.compare_at_price_minor != null &&
    product.compare_at_price_minor > product.price_minor
  const discount = isOnSale
    ? getDiscountPercentage(product.compare_at_price_minor!, product.price_minor)
    : 0

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (isOutOfStock) return

    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: primaryImage?.url ?? '',
      price_minor: product.price_minor,
      compare_at_price_minor: product.compare_at_price_minor,
      quantity: 1,
      stock_quantity: product.stock_quantity,
      sku: product.sku,
    })
    openCart()
  }

  function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    setIsWishlisted((prev) => !prev)
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border border-subtle-border bg-white transition-shadow duration-300 hover:shadow-card-hover',
        className
      )}
    >
      {/* Image area */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block aspect-[3/4] overflow-hidden bg-warm-ivory"
        aria-label={`View ${product.name}`}
      >
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt_text || product.name}
            className={cn(
              'h-full w-full object-cover transition-transform duration-500 group-hover:scale-105',
              isOutOfStock && 'opacity-60'
            )}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-secondary-text">
            <ShoppingBag className="h-12 w-12" strokeWidth={1} aria-hidden="true" />
          </div>
        )}

        {/* Sale badge */}
        {isOnSale && discount > 0 && !isOutOfStock && (
          <span
            className="absolute top-3 left-3 z-10 rounded-full bg-antique-gold px-2.5 py-1 text-xs font-semibold text-forest-green"
            aria-label={`${discount}% off`}
          >
            -{discount}%
          </span>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={cn(
            'absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white',
            isWishlisted && 'text-red-500'
          )}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className="h-4.5 w-4.5"
            fill={isWishlisted ? 'currentColor' : 'none'}
            strokeWidth={1.5}
          />
        </button>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-[5] flex items-center justify-center bg-white/50">
            <span className="rounded-full bg-primary-text px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <span className="mb-1 text-xs uppercase tracking-wider text-secondary-text">
          {product.category_name}
        </span>

        {/* Name */}
        <Link
          to={`/products/${product.slug}`}
          className="font-serif text-base font-semibold leading-snug text-primary-text transition-colors hover:text-bottle-green line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="mt-2">
          <PriceDisplay
            priceMinor={product.price_minor}
            compareAtPriceMinor={product.compare_at_price_minor}
            size="sm"
          />
        </div>

        {/* Add to cart */}
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={cn(
              'w-full rounded-full py-2.5 text-sm font-medium transition-colors',
              isOutOfStock
                ? 'cursor-not-allowed bg-sand-beige text-secondary-text'
                : 'bg-bottle-green text-white hover:bg-forest-green focus-visible:ring-2 focus-visible:ring-bottle-green focus-visible:ring-offset-2'
            )}
          >
            {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  )
}
