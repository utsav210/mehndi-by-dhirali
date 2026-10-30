import { useState, useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Contact Us — Mehndi By Dhirali'
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) {
      toast.error('Please complete all required fields.')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      toast.success('Your message has been sent! Our team will contact you shortly.')
      setName('')
      setEmail('')
      setPhone('')
      setSubject('')
      setMessage('')
    }, 600)
  }

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Contact Us' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-antique-gold">
            Get in Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bottle-green mt-1">
            We'd Love to Hear From You
          </h1>
          <p className="mt-2 text-sm text-secondary-text">
            Have questions about bridal bulk orders, workshops, or product storage? Reach out to us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Contact Details Card */}
          <div className="lg:col-span-1 rounded-3xl bg-forest-green text-white p-8 space-y-6 shadow-card">
            <div>
              <h3 className="font-serif text-xl font-bold text-warm-ivory">
                Contact Information
              </h3>
              <p className="text-xs text-warm-ivory/80 mt-1">
                Our support team responds within 24 business hours.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-antique-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-warm-ivory">Email Us</span>
                  <a href="mailto:dhiralidarji2103@gmail.com" className="text-warm-ivory/80 hover:underline">
                    dhiralidarji2103@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-antique-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-warm-ivory">Customer Care</span>
                  <p className="text-warm-ivory/80">
                    <a href="tel:+918140745001" className="hover:underline">+91 81407 45001</a>,{' '}
                    <a href="tel:+919662746292" className="hover:underline">+91 96627 46292</a>
                  </p>
                  <p className="text-[11px] text-warm-ivory/60 mt-0.5">Mon–Sat, 10am – 7pm IST</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-antique-gold shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-warm-ivory">Address</span>
                  <p className="text-warm-ivory/80">
                    Mehndi By Dhirali, Ambalalpark Society, 38, near Uma Hospital, Nava Naroda, Ahmedabad, Gujarat 382330
                  </p>
                  <a
                    href="https://share.google/00ZRrLHQcSv6uUyWW"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-antique-gold hover:underline mt-1 font-medium"
                  >
                    <span>View on Google Maps</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <div>
                <span className="text-xs text-antique-gold block font-semibold mb-2">WhatsApp Support</span>
                <a
                  href="https://wa.me/918140745001"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-xs text-white hover:bg-emerald-800 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat on WhatsApp (+91 81407 45001)</span>
                </a>
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className="text-xs text-antique-gold block font-semibold mb-2">Follow Our Work</span>
                <div className="flex flex-col gap-1.5 text-xs text-warm-ivory/90">
                  <a
                    href="https://www.youtube.com/channel/UCmJikx0yiVrpqzps213L-KA"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-antique-gold transition"
                  >
                    <span className="font-semibold text-white">YouTube:</span>
                    <span>@mehndi_by_dhirali07</span>
                  </a>
                  <a
                    href="https://www.instagram.com/mehndi_by_dhirali07/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 hover:text-antique-gold transition"
                  >
                    <span className="font-semibold text-white">Instagram:</span>
                    <span>@mehndi_by_dhirali07</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 rounded-3xl border border-subtle-border bg-white p-8 shadow-card">
            <h3 className="font-serif text-xl font-bold text-bottle-green mb-6">
              Send a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Dhirali Gandhi"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Bridal bulk order inquiry"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you today?"
                  className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-bottle-green px-8 py-3 text-sm font-semibold text-white shadow-card hover:bg-forest-green transition disabled:opacity-50 cursor-pointer"
              >
                <span>{isSubmitting ? 'Sending…' : 'Send Message'}</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
