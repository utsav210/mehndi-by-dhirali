import { MessageSquareQuote, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function TestimonialsSection({ className }: { className?: string }) {
  return (
    <section className={cn('py-16 bg-warm-ivory/40 border-t border-subtle-border', className)}>
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-antique-gold/20 text-bottle-green mb-4">
          <MessageSquareQuote className="h-6 w-6 text-antique-gold" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-bottle-green sm:text-3xl">
          Verified Customer Experiences
        </h2>
        <div className="ornamental-divider my-4 max-w-xs mx-auto">
          <span className="text-antique-gold text-sm">✦</span>
        </div>
        <div className="rounded-2xl border border-dashed border-subtle-border bg-white p-8 mt-6">
          <ShieldCheck className="h-8 w-8 text-bottle-green mx-auto mb-2 opacity-80" />
          <p className="text-secondary-text text-sm sm:text-base max-w-md mx-auto">
            We value genuine customer trust. Authentic verified buyer ratings and reviews will be published directly here following product shipments.
          </p>
        </div>
      </div>
    </section>
  )
}
