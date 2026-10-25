import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, X } from 'lucide-react'
import { cn, formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import CartItemRow from '@/components/cart/CartItemRow'

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const getSubtotal = useCartStore((s) => s.getSubtotal)
  const getItemCount = useCartStore((s) => s.getItemCount)

  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeCart])

  // Trap focus and prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      panelRef.current?.focus()
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const itemCount = getItemCount()
  const subtotal = getSubtotal()

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white shadow-modal transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-subtle-border px-4 py-4">
          <h2 className="font-serif text-lg font-semibold text-primary-text">
            Your Cart
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-secondary-text">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-8 w-8 items-center justify-center rounded-full text-secondary-text transition-colors hover:bg-warm-ivory hover:text-primary-text"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart content */}
        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 rounded-full bg-warm-ivory p-5">
              <ShoppingBag
                className="h-10 w-10 text-secondary-text"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h3 className="text-lg font-semibold text-primary-text">
              Your cart is empty
            </h3>
            <p className="mt-2 text-sm text-secondary-text">
              Explore our collection and find something you love.
            </p>
            <Link
              to="/products"
              onClick={closeCart}
              className="mt-6 rounded-full bg-bottle-green px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-forest-green focus-visible:ring-2 focus-visible:ring-bottle-green focus-visible:ring-offset-2"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.product_id}
                  item={item}
                  variant="compact"
                />
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-subtle-border px-4 py-4 space-y-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-text">Subtotal</span>
                <span className="text-base font-bold text-primary-text">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <p className="text-xs text-secondary-text">
                Shipping & taxes calculated at checkout.
              </p>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="flex-1 rounded-full border border-bottle-green py-2.5 text-center text-sm font-medium text-bottle-green transition-colors hover:bg-warm-ivory focus-visible:ring-2 focus-visible:ring-bottle-green focus-visible:ring-offset-2"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="flex-1 rounded-full bg-bottle-green py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-forest-green focus-visible:ring-2 focus-visible:ring-bottle-green focus-visible:ring-offset-2"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
