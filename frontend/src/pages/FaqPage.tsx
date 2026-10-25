import { useState, useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
  q: string
  a: string
}

const FAQS: FaqItem[] = [
  {
    q: 'How long do fresh Mehndi By Dhirali cones last?',
    a: 'Because our cones contain zero synthetic preservatives, you must store them in your freezer immediately upon arrival. Frozen cones remain in peak condition for up to 6 months. When ready to use, thaw at room temperature for 15–20 minutes.',
  },
  {
    q: 'Are your henna cones safe for children and pregnant women?',
    a: 'Our signature organic cones are made purely with organic Sojat henna powder, sugar, and water, scented with pure essential oils. For expectant mothers and children, we offer a specialized lavender-only essential oil blend which is widely recognized as the safest choice. Always perform a patch test prior to full application.',
  },
  {
    q: 'How can I get the darkest stain on bridal hands?',
    a: 'Apply onto clean, lotion-free hands. Leave the paste on skin for at least 6 to 8 hours. Moisten dried paste gently with lemon-sugar sealant spray. Scrape off paste (do not wash with water for the first 24 hours). Apply our eucalyptus aftercare balm. The rich stain matures into deep mahogany over 48 hours.',
  },
  {
    q: 'How do you prevent cones from spoiling during transit in summer?',
    a: 'We pack every parcel with specialized multi-layer thermal insulating foil pouches. We only dispatch on days that ensure direct transit without weekend layovers.',
  },
  {
    q: 'Do you offer bulk quantities for bridal events and workshops?',
    a: 'Yes! We supply fresh batches for weddings, festivals, and henna academies. Contact us at least 1–2 weeks ahead via WhatsApp or our Contact Us page for customized volume pricing.',
  },
]

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    document.title = 'Frequently Asked Questions — Mehndi By Dhirali'
  }, [])

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'FAQ' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-antique-gold">
            Help & Guidance
          </span>
          <h1 className="font-serif text-3xl font-bold text-bottle-green mt-1">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-sm text-secondary-text">
            Everything you need to know about fresh henna care, storage, and stain longevity.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className="rounded-2xl border border-subtle-border bg-white overflow-hidden shadow-xs transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-serif font-semibold text-bottle-green hover:bg-warm-ivory/30 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-antique-gold transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-secondary-text leading-relaxed border-t border-subtle-border/50 bg-warm-ivory/10">
                    {faq.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </PageLayout>
  )
}
