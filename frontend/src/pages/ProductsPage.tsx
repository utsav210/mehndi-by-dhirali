import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import ProductGrid from '@/components/products/ProductGrid'
import type { Product } from '@/types'
import { Filter, SlidersHorizontal, Search, X } from 'lucide-react'
import { INITIAL_PRODUCTS } from '@/data/initial-products'
import { apiClient } from '@/lib/api-client'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || searchParams.get('q') || ''
  const selectedCategory = searchParams.get('category') || 'all'
  const sortBy = searchParams.get('sort') || 'featured'

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    document.title = searchQuery
      ? `Search results for "${searchQuery}" — Mehndi By Dhirali`
      : 'All Products — Mehndi By Dhirali'

    async function fetchProducts() {
      try {
        setIsLoading(true)
        const params: Record<string, string> = {}
        if (selectedCategory && selectedCategory !== 'all') {
          params.category_slug = selectedCategory
        }
        if (sortBy) {
          params.sort = sortBy
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim()
        }
        const data = await apiClient.get<{ items: Product[] }>('/products', { params })
        if (data?.items && data.items.length > 0) {
          let list = data.items
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim()
            list = list.filter(
              (p) =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                (p.category_name && p.category_name.toLowerCase().includes(q)) ||
                p.sku.toLowerCase().includes(q)
            )
          }
          setProducts(list)
          return
        }
      } catch {
        // Fall back gracefully to local catalog
      }

      // Filter and sort INITIAL_PRODUCTS locally
      let filtered = [...INITIAL_PRODUCTS]
      if (selectedCategory && selectedCategory !== 'all') {
        filtered = filtered.filter((p) => p.category_slug === selectedCategory)
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category_name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q)
        )
      }
      if (sortBy === 'price-asc') {
        filtered.sort((a, b) => a.price_minor - b.price_minor)
      } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => b.price_minor - a.price_minor)
      }
      setProducts(filtered)
      setIsLoading(false)
    }

    fetchProducts()
  }, [selectedCategory, sortBy, searchQuery])

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'mehndi-cones', name: 'Mehndi Cones' },
    { id: 'mehndi-powder', name: 'Mehndi Powder' },
    { id: 'mehndi-oil', name: 'Mehndi Oil' },
    { id: 'mehndi-kits', name: 'Bridal & Student Kits' },
    { id: 'accessories', name: 'Accessories' },
  ]

  const handleCategoryChange = (catId: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (catId === 'all') {
      newParams.delete('category')
    } else {
      newParams.set('category', catId)
    }
    setSearchParams(newParams)
  }

  const handleSortChange = (newSort: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (newSort === 'featured') {
      newParams.delete('sort')
    } else {
      newParams.set('sort', newSort)
    }
    setSearchParams(newParams)
  }

  const handleClearSearch = () => {
    const newParams = new URLSearchParams(searchParams)
    newParams.delete('search')
    newParams.delete('q')
    setSearchParams(newParams)
  }

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Query Active Banner */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-antique-gold/40 bg-warm-ivory/60 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 text-bottle-green">
              <Search className="h-4 w-4 text-antique-gold" />
              <span>
                Showing results for <strong>&ldquo;{searchQuery}&rdquo;</strong> ({products.length} found)
              </span>
            </div>
            <button
              onClick={handleClearSearch}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-secondary-text hover:bg-white hover:text-charcoal transition cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear search</span>
            </button>
          </div>
        )}

        {/* Title and Sort Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-subtle-border pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-bottle-green">
              {searchQuery ? 'Search Results' : 'Our Products'}
            </h1>
            <p className="mt-1 text-sm text-secondary-text">
              Handcrafted organic Rajasthani henna cones, triple-sifted powders, natural oils, and kits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="text-xs font-medium text-secondary-text flex items-center gap-1.5">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Sort By:</span>
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg border border-subtle-border bg-white px-3 py-1.5 text-xs text-primary-text focus:border-bottle-green focus:outline-hidden"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Layout: Sidebar Filter + Product Grid */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Category Filter Sidebar */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-subtle-border bg-warm-ivory/20 p-5 sticky top-24">
              <div className="flex items-center gap-2 border-b border-subtle-border pb-3 mb-4 font-serif font-semibold text-bottle-green">
                <Filter className="h-4 w-4 text-antique-gold" />
                <span>Categories</span>
              </div>
              <ul className="space-y-1.5">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'bg-bottle-green text-white font-medium'
                          : 'text-primary-text hover:bg-warm-ivory/80'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {selectedCategory === cat.id && (
                        <span className="text-antique-gold text-xs">●</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              columns={3}
              emptyMessage={
                searchQuery
                  ? `No products found matching "${searchQuery}". Try another keyword or browse all categories.`
                  : "Products will be added here shortly."
              }
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
