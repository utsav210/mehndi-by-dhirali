import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { Package, ArrowLeft } from 'lucide-react'

export default function OrdersPage() {
  useEffect(() => {
    document.title = 'Order History — Mehndi By Dhirali'
  }, [])

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Account', href: '/account' },
              { label: 'Orders' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-bottle-green">
              Your Orders
            </h1>
            <p className="text-xs text-secondary-text mt-1">
              Review current package dispatches and historical purchases.
            </p>
          </div>
          <Link
            to="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-bottle-green hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Account</span>
          </Link>
        </div>

        {/* Empty orders state */}
        <div className="rounded-3xl border border-dashed border-subtle-border bg-warm-ivory/20 p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-warm-ivory text-secondary-text mb-4">
            <Package className="h-8 w-8" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-primary-text">
            No orders placed yet
          </h2>
          <p className="text-xs text-secondary-text mt-2 max-w-md mx-auto">
            Once you complete an order for our organic henna products, details and tracking updates will appear here.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-bottle-green px-6 py-2.5 text-xs font-semibold text-white hover:bg-forest-green transition shadow-xs"
            >
              <span>Explore Products</span>
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
