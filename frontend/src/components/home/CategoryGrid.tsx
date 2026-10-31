import { Link } from 'react-router-dom'
import type { Category } from '@/types'
import { cn } from '@/lib/utils'

interface CategoryGridProps {
  /** Categories to display. Falls back to default data when empty. */
  categories: Category[]
  /** Additional CSS classes */
  className?: string
}

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  'mehndi-cones': '/images/products/pack-of-5-mehndi-cones.jpg',
  'mehndi-powder': '/images/products/100-gm-mehndi-powder.jpg',
  'mehndi-oil': '/images/products/mehndi-oil.jpg',
  'mehndi-kits': '/images/products/mehndi-artist-kit.jpg',
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-mehndi-cones',
    name: 'Mehndi Cones',
    slug: 'mehndi-cones',
    description: 'Freshly mixed organic henna cones',
    image_url: '/images/products/pack-of-5-mehndi-cones.jpg',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'cat-mehndi-powder',
    name: 'Mehndi Powder',
    slug: 'mehndi-powder',
    description: 'Triple-sifted 100% natural Sojat henna powder',
    image_url: '/images/products/100-gm-mehndi-powder.jpg',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'cat-mehndi-oil',
    name: 'Mehndi Oil',
    slug: 'mehndi-oil',
    description: 'Pure eucalyptus and essential herbal oil blends',
    image_url: '/images/products/mehndi-oil.jpg',
    sort_order: 3,
    is_active: true,
  },
  {
    id: 'cat-mehndi-kits',
    name: 'Mehndi Kits',
    slug: 'mehndi-kits',
    description: 'Complete bridal and professional student kits',
    image_url: '/images/products/mehndi-artist-kit.jpg',
    sort_order: 4,
    is_active: true,
  },
]

export default function CategoryGrid({
  categories,
  className,
}: CategoryGridProps) {
  // Use passed categories if available, otherwise fallback to DEFAULT_CATEGORIES.
  // Filter out accessories from Shop by Category section as requested.
  const rawList = categories.length > 0 ? categories : DEFAULT_CATEGORIES
  const displayCategories = rawList
    .filter((cat) => cat.slug !== 'accessories')
    .map((cat) => ({
      ...cat,
      image_url: cat.image_url || CATEGORY_IMAGE_MAP[cat.slug] || '',
    }))

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

        {/* Grid - 4 Columns */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayCategories.map((category) => {
            const imageUrl = category.image_url || CATEGORY_IMAGE_MAP[category.slug]
            return (
              <Link
                key={category.id}
                to={`/categories/${category.slug}`}
                className="group relative flex aspect-square flex-col items-center justify-end overflow-hidden rounded-2xl bg-warm-ivory shadow-sm transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              >
                {/* Image */}
                <img
                  src={imageUrl}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    if (CATEGORY_IMAGE_MAP[category.slug]) {
                      ;(e.currentTarget as HTMLImageElement).src = CATEGORY_IMAGE_MAP[category.slug]
                    }
                  }}
                />

                {/* Subtle dark gradient overlay so category title is crisp and readable */}
                <div className="relative z-10 w-full bg-gradient-to-t from-forest-green/85 via-forest-green/40 to-transparent px-3 pb-4 pt-12 transition-all duration-300 group-hover:from-forest-green/95">
                  <span className="block text-center font-serif text-sm font-semibold tracking-wide text-white sm:text-base drop-shadow-sm">
                    {category.name}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
