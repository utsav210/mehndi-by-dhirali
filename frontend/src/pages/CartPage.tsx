import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import CartItemRow from '@/components/cart/CartItemRow'
import CartSummary from '@/components/cart/CartSummary'
import { useCartStore } from '@/lib/cart-store'
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    document.title = 'Shopping Cart — Mehndi By Dhirali'
  }, [])

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shopping Cart' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-bottle-green mb-8">
          Your Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="py-16 text-center rounded-3xl border border-dashed border-subtle-border bg-warm-ivory/20">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-warm-ivory text-secondary-text mb-4">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-primary-text">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-secondary-text max-w-sm mx-auto">
              Explore our fresh organic henna cones, bridal studio kits, and essential accessories.
            </p>
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-bottle-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-green transition shadow-xs"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-subtle-border">
                <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                  Items ({items.length})
                </span>
                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-1 text-xs text-secondary-text hover:text-error transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear Cart</span>
                </button>
              </div>

              <div className="divide-y divide-subtle-border">
                {items.map((item) => (
                  <div key={item.product_id} className="py-4">
                    <CartItemRow item={item} variant="full" />
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-medium text-bottle-green hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <CartSummary />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
