import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { ArrowLeft, ShoppingCart } from 'lucide-react'

export default function AdminOrdersPage() {
  useEffect(() => {
    document.title = 'Manage Orders — Mehndi By Dhirali Admin'
  }, [])

  return (
    <PageLayout>
      <div className="bg-forest-green text-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold">Orders & Fulfillment</h1>
              <p className="text-xs text-warm-ivory/70">Track customer purchases, payments & dispatches</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-subtle-border bg-white shadow-xs p-12 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-warm-ivory text-secondary-text mb-4">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h2 className="font-serif text-xl font-semibold text-bottle-green">
            No Customer Orders Yet
          </h2>
          <p className="text-xs text-secondary-text mt-2 max-w-sm mx-auto">
            Once shoppers complete purchases through Razorpay checkout, live order statuses, customer addresses, and tracking labels will populate here.
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
