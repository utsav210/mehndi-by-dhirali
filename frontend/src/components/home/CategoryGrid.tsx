import { Link } from 'react-router-dom'
import type { Category } from '@/types'
import { cn } from '@/lib/utils'
import { Package } from 'lucide-react'

interface CategoryGridProps {
  /** Categories to display. Falls back to demo data when empty. */
  categories: Category[]
  /** Additional CSS classes */
  className?: string
}

/**
 * DEMO DATA — used only when no real categories are provided.
 * Replace with live API data in production.
 */
const DEMO_CATEGORIES: Category[] = [
  { id: 'demo-1', name: 'Mehndi Cones', slug: 'mehndi-cones', description: null, image_url: null, sort_order: 1, is_active: true },
  { id: 'demo-2', name: 'Mehndi Powder', slug: 'mehndi-powder', description: null, image_url: null, sort_order: 2, is_active: true },
  { id: 'demo-3', name: 'Mehndi Oil', slug: 'mehndi-oil', description: null, image_url: null, sort_order: 3, is_active: true },
  { id: 'demo-4', name: 'Mehndi Kits', slug: 'mehndi-kits', description: null, image_url: null, sort_order: 4, is_active: true },
  { id: 'demo-5', name: 'Accessories', slug: 'accessories', description: null, image_url: null, sort_order: 5, is_active: true },
]

export default function CategoryGrid({
  categories,
  className,
}: CategoryGridProps) {
  const displayCategories =
    categories.length > 0 ? categories : DEMO_CATEGORIES

  return (
    <section className={cn('py-16 md:py-20', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading with ornamental divider */}
        <h2 className="ornamental-divider justify-center text-center font-serif text-2xl font-bold text-primary-text sm:text-3xl">
          Shop by Category
        </h2>

        <p className="mt-3 text-center text-sm text-secondary-text">
          Find exactly what you need for your mehndi art
        </p>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {displayCategories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="group relative flex aspect-square flex-col items-center justify-end overflow-hidden rounded-lg bg-warm-ivory transition-shadow hover:shadow-card-hover"
            >
              {/* Image or placeholder */}
              {category.image_url ? (
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-sand-beige">
                  <Package
                    className="h-10 w-10 text-secondary-text/50 transition-colors group-hover:text-bottle-green/60"
                    strokeWidth={1.2}
                    aria-hidden="true"
                  />
                </div>
              )}

              {/* Name overlay */}
              <div className="relative z-10 w-full bg-gradient-to-t from-forest-green/80 to-transparent px-3 pb-3 pt-8 transition-all group-hover:from-forest-green/90">
                <span className="block text-center text-xs font-semibold uppercase tracking-wider text-white sm:text-sm">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
