import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { Heart, Package } from 'lucide-react'

export default function WishlistPage() {
  useEffect(() => {
    document.title = 'My Wishlist — Mehndi By Dhirali'
  }, [])

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Wishlist' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-bottle-green mb-8">
          Your Saved Wishlist
        </h1>

        <div className="rounded-3xl border border-dashed border-subtle-border bg-warm-ivory/20 p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-warm-ivory text-secondary-text mb-4">
            <Heart className="h-8 w-8" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-primary-text">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-secondary-text mt-2 max-w-md mx-auto">
            Click the heart icon on any mehndi cone or kit to save it for easy access whenever you're ready to order.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-bottle-green px-6 py-2.5 text-xs font-semibold text-white hover:bg-forest-green transition shadow-xs"
            >
              <Package className="h-4 w-4" />
              <span>Browse Products</span>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
