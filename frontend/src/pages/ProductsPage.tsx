import { useState, useEffect } from 'react'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import ProductGrid from '@/components/products/ProductGrid'
import type { Product } from '@/types'
import { Filter, SlidersHorizontal, Search, X } from 'lucide-react'
import { INITIAL_PRODUCTS } from '@/data/initial-products'
import { apiClient } from '@/lib/api-client'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { slug: routeCategorySlug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()

  const searchQuery = searchParams.get('search') || searchParams.get('q') || ''
  const selectedCategory = routeCategorySlug || searchParams.get('category') || 'all'
  const sortBy = searchParams.get('sort') || 'featured'

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    document.title = searchQuery
      ? `Search results for "${searchQuery}" — Mehndi By Dhirali`
      : 'All Products — Mehndi By Dhirali'

    let isMounted = true

    async function fetchProducts() {
      setIsLoading(true)
      try {
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
        if (isMounted && data?.items && data.items.length > 0) {
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
          setIsLoading(false)
          return
        }
      } catch (err) {
        console.warn('API product fetch failed, falling back to local catalog:', err)
      }

      if (!isMounted) return

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

    return () => {
      isMounted = false
    }
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
    if (routeCategorySlug) {
      if (catId === 'all') {
        navigate('/products')
      } else {
        navigate(`/categories/${catId}`)
      }
      return
    }
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Products' },
            ...(selectedCategory !== 'all'
              ? [
                  {
                    label:
                      categories.find((c) => c.id === selectedCategory)?.name ||
                      selectedCategory,
                  },
                ]
              : []),
          ]}
          className="mb-6"
        />

        {/* Search status notification banner if active */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between rounded-xl bg-warm-ivory/60 px-4 py-3 border border-antique-gold/20">
            <div className="flex items-center gap-2 text-sm text-bottle-green">
              <Search className="h-4 w-4 text-antique-gold" />
              <span>
                Showing results for <strong>&ldquo;{searchQuery}&rdquo;</strong> (
                {products.length} found)
              </span>
            </div>
            <button
              onClick={handleClearSearch}
              className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-text hover:text-bottle-green"
            >
              <X className="h-3.5 w-3.5" />
              Clear Search
            </button>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-subtle-border pb-6 mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-bottle-green">
              {searchQuery ? 'Search Results' : 'Our Products'}
            </h1>
            <p className="mt-1 text-sm text-secondary-text">
              Handcrafted organic Rajasthani henna cones, triple-sifted powders, natural oils, and kits.
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <label htmlFor="sort-select" className="text-sm font-medium text-secondary-text flex items-center gap-1.5">
              <SlidersHorizontal className="h-4 w-4 text-antique-gold" />
              <span>Sort By:</span>
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="rounded-lg border border-subtle-border bg-white px-3 py-1.5 text-sm font-medium text-bottle-green focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Categories Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-subtle-border bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-bottle-green mb-4">
                <Filter className="h-4 w-4 text-antique-gold" />
                Categories
              </h2>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-bottle-green text-warm-ivory'
                          : 'text-primary-text hover:bg-warm-ivory/50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {isActive && <span className="h-1.5 w-1.5 rounded-full bg-antique-gold" />}
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              columns={3}
              showEmptyState={true}
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
