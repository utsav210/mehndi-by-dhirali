import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'
import ProductGrid from '@/components/products/ProductGrid'
import ProductCard from '@/components/products/ProductCard'

interface FeaturedProductsProps {
  /** Products to showcase */
  products: Product[]
  /** Section heading text */
  title?: string
  /** "View All" link destination */
  viewAllLink?: string
  /** Show loading skeletons */
  isLoading?: boolean
  /** Additional CSS classes */
  className?: string
}

export default function FeaturedProducts({
  products,
  title = 'Our Latest Collection',
  viewAllLink = '/products',
  isLoading = false,
  className,
}: FeaturedProductsProps) {
  return (
    <section className={cn('py-16 md:py-20', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex-1">
            <h2 className="font-serif text-2xl font-bold text-bottle-green sm:text-3xl">
              {title}
            </h2>
            <div className="ornamental-divider mt-2 max-w-xs">
              <span className="text-antique-gold text-xs">✦</span>
            </div>
          </div>

          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-bottle-green transition-colors hover:text-antique-gold"
          >
            View All Products
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Desktop and Mobile rendering */}
        <div className="mt-8">
          {products.length === 0 && !isLoading ? (
            <ProductGrid products={[]} isLoading={false} />
          ) : (
            <>
              {/* Desktop grid */}
              <div className="hidden sm:block">
                <ProductGrid
                  products={products}
                  isLoading={isLoading}
                  columns={4}
                />
              </div>

              {/* Mobile horizontal scroll */}
              <div className="flex gap-4 overflow-x-auto pb-4 sm:hidden snap-x snap-mandatory -mx-4 px-4">
                {isLoading ? (
                  Array.from({ length: 4 }, (_, i) => (
                    <div
                      key={i}
                      className="w-[260px] flex-shrink-0 snap-start"
                    >
                      <div className="animate-pulse rounded-lg border border-subtle-border bg-white overflow-hidden">
                        <div className="aspect-[3/4] bg-warm-ivory" />
                        <div className="p-4 space-y-3">
                          <div className="h-3 w-1/3 rounded bg-sand-beige" />
                          <div className="h-5 w-4/5 rounded bg-sand-beige" />
                          <div className="h-4 w-1/4 rounded bg-sand-beige" />
                          <div className="h-10 w-full rounded-full bg-sand-beige" />
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="w-[260px] flex-shrink-0 snap-start"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
