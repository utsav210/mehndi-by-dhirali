import { useState, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import type { Product } from '@/types'
import { cn } from '@/lib/utils'
import ProductGrid from '@/components/products/ProductGrid'
import ProductCard from '@/components/products/ProductCard'
import Pagination from '@/components/ui/Pagination'

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

const CATEGORY_TABS = [
  { id: 'all', name: 'All' },
  { id: 'mehndi-powder', name: 'Mehndi Powder' },
  { id: 'mehndi-oil', name: 'Mehndi Oil' },
  { id: 'mehndi-cones', name: 'Mehndi Cones' },
  { id: 'mehndi-kits', name: 'Bridal & Student Kits' },
  { id: 'accessories', name: 'Accessories' },
]

export default function FeaturedProducts({
  products,
  title = 'Our Latest Collection',
  viewAllLink = '/products',
  isLoading = false,
  className,
}: FeaturedProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const sectionRef = useRef<HTMLDivElement>(null)
  const PAGE_SIZE = 8

  // Filter products by active category tab
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products
    return products.filter((p) => p.category_slug === selectedCategory)
  }, [products, selectedCategory])

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE)

  // Paginated slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredProducts.slice(start, start + PAGE_SIZE)
  }, [filteredProducts, currentPage, PAGE_SIZE])

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Count items per category tab
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: products.length }
    for (const p of products) {
      map[p.category_slug] = (map[p.category_slug] ?? 0) + 1
    }
    return map
  }, [products])

  return (
    <section ref={sectionRef} className={cn('py-16 md:py-20 scroll-mt-16', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header row */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-antique-gold flex items-center gap-1.5 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Full Artisanal Catalogue</span>
            </span>
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
            <span>View All ({products.length} Products)</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Category Quick Filter Pills */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none sm:flex-wrap">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id
            const count = counts[tab.id] ?? 0
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleCategorySelect(tab.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-150 shrink-0 cursor-pointer select-none',
                  isActive
                    ? 'bg-bottle-green text-warm-ivory shadow-xs font-semibold'
                    : 'bg-warm-ivory/60 text-primary-text border border-subtle-border hover:bg-warm-ivory hover:border-bottle-green/30'
                )}
              >
                <span>{tab.name}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                    isActive ? 'bg-antique-gold text-forest-green' : 'bg-black/5 text-secondary-text'
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Desktop and Mobile rendering */}
        <div className="mt-8">
          {filteredProducts.length === 0 && !isLoading ? (
            <ProductGrid products={[]} isLoading={false} />
          ) : (
            <>
              {/* Desktop grid */}
              <div className="hidden sm:block">
                <ProductGrid
                  products={paginatedProducts}
                  isLoading={isLoading}
                  columns={4}
                />
              </div>

              {/* Mobile horizontal scroll with snap */}
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
                  filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="w-[260px] flex-shrink-0 snap-start"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))
                )}
              </div>

              {/* Home Page Pagination Bar */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredProducts.length}
                pageSize={PAGE_SIZE}
                itemName="products available"
              />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
