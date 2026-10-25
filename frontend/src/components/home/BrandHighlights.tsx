import { Leaf, Heart, Truck, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Highlight {
  icon: typeof Leaf
  title: string
  description: string
}

const HIGHLIGHTS: Highlight[] = [
  {
    icon: Leaf,
    title: '100% Natural Henna',
    description: 'Triple-sifted organic Sojat henna leaves with no chemicals or PPD.',
  },
  {
    icon: Heart,
    title: 'Handcrafted with Care',
    description: 'Freshly mixed in small batches with pure eucalyptus and cajeput oils.',
  },
  {
    icon: Truck,
    title: 'Express All-India Delivery',
    description: 'Fresh cones packed in temperature-controlled insulating pouches.',
  },
  {
    icon: ShieldCheck,
    title: 'Dark & Long-Lasting Stain',
    description: 'Guaranteed rich mahogany to deep burgundy stain with proper aftercare.',
  },
]

export default function BrandHighlights({ className }: { className?: string }) {
  return (
    <section className={cn('bg-warm-ivory/60 border-y border-subtle-border py-12', className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="flex items-start gap-4 rounded-xl bg-white/70 p-5 shadow-xs transition-transform hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-bottle-green/10 text-bottle-green">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-primary-text">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-secondary-text">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
