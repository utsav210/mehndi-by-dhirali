import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HeroBanner({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-bottle-green',
        className
      )}
    >
      {/* Gradient background with subtle pattern */}
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-green via-bottle-green to-forest-green"
        aria-hidden="true"
      />

      {/* Decorative mandala-inspired pattern (CSS geometric shapes) */}
      <div className="absolute inset-0 -z-10 opacity-[0.06]" aria-hidden="true">
        {/* Concentric circles */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3">
          <div className="h-[600px] w-[600px] rounded-full border-[40px] border-white/30" />
          <div className="absolute inset-12 rounded-full border-[30px] border-white/20" />
          <div className="absolute inset-24 rounded-full border-[20px] border-white/10" />
        </div>
        {/* Small top-left accent */}
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full border-[20px] border-white/20" />
      </div>

      {/* Ornamental gold border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-antique-gold to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="mx-auto flex min-h-[350px] max-w-7xl items-center px-4 py-16 sm:px-6 md:min-h-[500px] md:py-24 lg:px-8">
        <div className="max-w-2xl">
          {/* Tagline */}
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-antique-gold">
            Premium Mehndi Collection
          </p>

          {/* Main heading */}
          <h1 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Celebrate Tradition{' '}
            <span className="block">with Natural Mehndi</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-lg text-base leading-relaxed text-warm-ivory/90 sm:text-lg">
            Discover handcrafted, 100% natural mehndi cones, powders, and oils
            — made with care for beautiful, long-lasting designs.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-antique-gold px-7 py-3 text-sm font-semibold text-forest-green transition-colors hover:bg-antique-gold/90 focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bottle-green"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              to="/categories"
              className="inline-flex items-center gap-2 rounded-full border-2 border-antique-gold/60 px-7 py-3 text-sm font-semibold text-antique-gold transition-colors hover:border-antique-gold hover:bg-antique-gold/10 focus-visible:ring-2 focus-visible:ring-antique-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bottle-green"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
