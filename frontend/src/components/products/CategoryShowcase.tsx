import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CategoryShowcaseItem {
  id: string
  name: string
  slug: string
  image: string
  itemCount?: number
  description?: string
}

export const STORE_CATEGORIES: CategoryShowcaseItem[] = [
  {
    id: 'mehndi-powder',
    name: 'Mehndi Powder',
    slug: 'mehndi-powder',
    image: '/images/products/100-gm-mehndi-powder.jpg',
    itemCount: 3,
    description: 'Triple-sifted organic Rajasthani Sojat powder',
  },
  {
    id: 'mehndi-oil',
    name: 'Mehndi Oil',
    slug: 'mehndi-oil',
    image: '/images/products/mehndi-oil.jpg',
    itemCount: 1,
    description: 'Pure eucalyptus & essential herbal blends',
  },
  {
    id: 'mehndi-cones',
    name: 'Mehndi Cones',
    slug: 'mehndi-cones',
    image: '/images/products/pack-of-5-mehndi-cones.jpg',
    itemCount: 6,
    description: 'Fresh organic handcrafted bridal cones',
  },
  {
    id: 'mehndi-kits',
    name: 'Bridal & Student Kits',
    slug: 'mehndi-kits',
    image: '/images/products/mehndi-artist-kit.jpg',
    itemCount: 3,
    description: 'Complete bridal artist & practice kits',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories',
    image: '/images/products/pink-bowl-1.jpg',
    itemCount: 4,
    description: 'Essential mixing bowls, clips, pins & stockings',
  },
]

interface CategoryShowcaseProps {
  /** Currently selected category id (e.g. 'all', 'mehndi-cones', etc.) */
  selectedCategory?: string
  /** Optional handler when a category is clicked */
  onSelectCategory?: (categoryId: string) => void
  /** Base URL path prefix for link navigation (default: '/categories') */
  basePath?: string
  /** Whether to show the 'All Products' card */
  showAllOption?: boolean
  /** Additional container classes */
  className?: string
  /** Title for the showcase */
  title?: string
}

export default function CategoryShowcase({
  selectedCategory = 'all',
  onSelectCategory,
  basePath = '/categories',
  showAllOption = true,
  className,
  title = 'Browse by Category',
}: CategoryShowcaseProps) {
  const allCard: CategoryShowcaseItem = {
    id: 'all',
    name: 'All Categories',
    slug: 'all',
    image: '/images/products/pack-of-5-mehndi-cones.jpg',
    itemCount: 17,
    description: 'Explore our entire handcrafted henna collection',
  }

  const items = showAllOption ? [allCard, ...STORE_CATEGORIES] : STORE_CATEGORIES

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-serif text-lg sm:text-xl font-bold text-bottle-green">
            <Sparkles className="h-4 w-4 text-antique-gold" />
            <span>{title}</span>
          </h2>
          <span className="text-xs text-secondary-text">5 Curated Collections</span>
        </div>
      )}

      {/* Horizontal Scrollable Rail on Mobile / Grid on Desktop */}
      <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin snap-x snap-mandatory sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
        {items.map((cat) => {
          const isActive = selectedCategory === cat.id || (selectedCategory === '' && cat.id === 'all')
          const linkTarget = cat.id === 'all' ? '/products' : `${basePath}/${cat.slug}`

          const cardContent = (
            <div
              className={cn(
                'group relative flex w-36 sm:w-full flex-col items-center rounded-2xl border p-3 text-center transition-all duration-200 cursor-pointer snap-start shrink-0 select-none',
                isActive
                  ? 'border-bottle-green bg-warm-ivory/60 ring-2 ring-bottle-green shadow-sm -translate-y-0.5'
                  : 'border-subtle-border bg-white hover:border-bottle-green/40 hover:bg-warm-ivory/30 hover:shadow-2xs'
              )}
            >
              {/* Category Thumbnail Avatar */}
              <div className="relative mb-2.5 h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full border border-subtle-border bg-warm-ivory shadow-2xs transition-transform duration-300 group-hover:scale-105">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = '/images/products/mehndi-cones.jpg'
                  }}
                />
                {isActive && (
                  <div className="absolute inset-0 bg-bottle-green/15 ring-2 ring-inset ring-bottle-green rounded-full" />
                )}
              </div>

              {/* Title */}
              <span
                className={cn(
                  'line-clamp-1 font-serif text-xs sm:text-sm font-semibold tracking-tight transition-colors',
                  isActive ? 'text-bottle-green font-bold' : 'text-primary-text group-hover:text-bottle-green'
                )}
              >
                {cat.name}
              </span>

              {/* Item Count */}
              {cat.itemCount != null && (
                <span className="mt-0.5 text-[11px] font-medium text-secondary-text">
                  {cat.itemCount} {cat.itemCount === 1 ? 'Product' : 'Products'}
                </span>
              )}

              {/* Active Dot Indicator */}
              {isActive && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bottle-green text-[9px] text-warm-ivory shadow-xs">
                  ✓
                </span>
              )}
            </div>
          )

          if (onSelectCategory) {
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="text-left focus:outline-hidden"
              >
                {cardContent}
              </button>
            )
          }

          return (
            <Link key={cat.id} to={linkTarget} className="text-left focus:outline-hidden">
              {cardContent}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
