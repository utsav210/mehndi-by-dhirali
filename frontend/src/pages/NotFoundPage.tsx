import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { Home, Package } from 'lucide-react'

export default function NotFoundPage() {
  useEffect(() => {
    document.title = 'Page Not Found — Mehndi By Dhirali'
  }, [])

  return (
    <PageLayout>
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <div className="rounded-3xl border border-subtle-border bg-warm-ivory/30 p-10 shadow-xs">
          <span className="font-serif text-6xl font-bold text-bottle-green block mb-2">
            404
          </span>
          <h1 className="font-serif text-2xl font-bold text-primary-text mb-2">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text max-w-sm mx-auto mb-8">
            The page you are looking for may have been moved, renamed, or is currently unavailable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-bottle-green px-6 py-2.5 text-xs font-semibold text-white hover:bg-forest-green transition shadow-xs"
            >
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-subtle-border px-6 py-2.5 text-xs font-semibold text-primary-text hover:bg-warm-ivory transition"
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
