import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { apiClient, ApiClientError } from '@/lib/api-client'
import { formatPrice } from '@/lib/utils'
import type { Order } from '@/types'
import { Package, ArrowLeft, Truck, Clock, RefreshCw, AlertCircle } from 'lucide-react'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Order History — Mehndi By Dhirali'
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiClient.get<Order[]>('/orders')
      setOrders(data)
    } catch (err) {
      if (err instanceof ApiClientError) {
        // If 401, guest user
        if (err.status !== 401) {
          setError(err.message)
        }
      } else {
        setError('Failed to fetch orders.')
      }
    } finally {
      setIsLoading(false)
    }
  }

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-bottle-green">
              Your Orders
            </h1>
            <p className="text-xs text-secondary-text mt-1">
              Review current package dispatches and historical purchases.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/track"
              className="inline-flex items-center gap-1.5 rounded-full border border-antique-gold/50 bg-warm-ivory px-4 py-2 text-xs font-semibold text-bottle-green hover:bg-white transition shadow-xs"
            >
              <Truck className="h-3.5 w-3.5 text-antique-gold" />
              <span>Track With Reference</span>
            </Link>
            <Link
              to="/account"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-bottle-green hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Account</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="rounded-3xl border border-subtle-border bg-white p-12 text-center text-secondary-text text-sm flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin text-bottle-green" />
            <span>Loading your orders...</span>
          </div>
        ) : orders.length === 0 ? (
          /* Empty orders state */
          <div className="rounded-3xl border border-dashed border-subtle-border bg-warm-ivory/20 p-12 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-warm-ivory text-secondary-text mb-4">
              <Package className="h-8 w-8 text-bottle-green" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-primary-text">
              No orders found in this account
            </h2>
            <p className="text-xs text-secondary-text mt-2 max-w-md mx-auto">
              Once you complete an order for our organic henna products, tracking updates and receipts will appear here. Placed an order as a guest?
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/track"
                className="inline-flex items-center gap-2 rounded-full border border-bottle-green bg-white px-6 py-2.5 text-xs font-semibold text-bottle-green hover:bg-warm-ivory transition shadow-xs"
              >
                <Truck className="h-3.5 w-3.5" />
                <span>Track Guest Order</span>
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full bg-bottle-green px-6 py-2.5 text-xs font-semibold text-white hover:bg-forest-green transition shadow-xs"
              >
                <span>Explore Products</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-subtle-border bg-white p-6 shadow-xs hover:border-antique-gold/40 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-subtle-border">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-bottle-green">
                        #{order.order_number}
                      </span>
                      <span className="inline-flex items-center rounded-full border border-sand-beige bg-warm-ivory px-2.5 py-0.5 text-[11px] font-semibold text-bottle-green uppercase tracking-wide">
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-text mt-1 flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-bottle-green">
                      {formatPrice(order.total_minor)}
                    </span>
                    <Link
                      to={`/track?order=${order.order_number}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-bottle-green px-4 py-2 text-xs font-medium text-warm-ivory hover:bg-forest-green transition"
                    >
                      <Truck className="h-3.5 w-3.5" />
                      Track Shipment
                    </Link>
                  </div>
                </div>

                <div className="pt-4 divide-y divide-subtle-border">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-2.5 flex items-center justify-between gap-4 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-lg bg-warm-ivory/60 border border-subtle-border flex items-center justify-center overflow-hidden">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-4 w-4 text-bottle-green/40" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">
                            {item.product_name}
                          </p>
                          <p className="text-secondary-text">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-medium text-charcoal">
                        {formatPrice(item.total_price_minor)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}