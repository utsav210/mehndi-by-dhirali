import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SpecialOffers({ className }: { className?: string }) {
  return (
    <section className={cn('py-16 bg-sand-beige/30', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-forest-green to-bottle-green text-white p-8 md:p-14 shadow-card">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full border-[20px] border-antique-gold/20" />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-antique-gold/20 px-3.5 py-1 text-xs font-medium text-antique-gold mb-4 border border-antique-gold/30">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Festive Bridal Special</span>
            </div>
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Bridal DIY Kit + FREE Shipping
            </h2>
            <p className="mt-4 text-warm-ivory/90 text-sm sm:text-base leading-relaxed">
              Curated especially for brides and boutique artists. Includes 200g triple-sifted henna powder, 100ml dark stain essential oil, 2x 0.38mm precision pins, 2 small piping bags, 20 transparent 20-micron sheets, 2 pre-rolled cones, stocking strainer, and bridal paste instruction card.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/products/bridal-diy-kit"
                className="inline-flex items-center gap-2 rounded-full bg-antique-gold px-6 py-3 text-sm font-semibold text-forest-green shadow-xs hover:bg-antique-gold/90 transition-colors"
              >
                <span>Explore Bridal DIY Kit (₹449)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-xs text-warm-ivory/80">
                Freshly packed per order • Guaranteed rich stain • FREE Delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
