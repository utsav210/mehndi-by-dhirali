import { useState } from 'react'
import { Send, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function NewsletterSection({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubscribed(true)
      toast.success('Thank you for subscribing to Mehndi By Dhirali updates!')
      setEmail('')
    }, 600)
  }

  return (
    <section className={cn('py-16 bg-forest-green text-white relative overflow-hidden', className)}>
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full border-[30px] border-white" />
      </div>

      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8 relative z-10">
        <span className="text-antique-gold font-decorative text-sm uppercase tracking-widest">
          Join Our Henna Circle
        </span>
        <h2 className="font-serif text-3xl font-bold mt-2 sm:text-4xl text-warm-ivory">
          Exclusive Offers & Mehndi Art Inspiration
        </h2>
        <p className="mt-3 text-warm-ivory/80 text-sm sm:text-base max-w-xl mx-auto">
          Subscribe for fresh batch release alerts, festive pre-booking discounts, and masterclass updates.
        </p>

        {isSubscribed ? (
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-bottle-green/80 border border-antique-gold/40 px-6 py-3 text-antique-gold">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">You are subscribed to our newsletter!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 rounded-full bg-white/10 border border-white/20 px-5 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-antique-gold focus:border-transparent transition"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-antique-gold text-forest-green px-7 py-3 text-sm font-semibold hover:bg-antique-gold/90 transition disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Subscribing…' : 'Subscribe'}</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-warm-ivory/60">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  )
}
