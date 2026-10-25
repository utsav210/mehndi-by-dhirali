import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { Truck, RotateCcw } from 'lucide-react'

export default function ShippingReturnsPage() {
  useEffect(() => {
    document.title = 'Shipping & Returns — Mehndi By Dhirali'
  }, [])

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shipping & Returns' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-subtle-border pb-6 mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-antique-gold">
            Dispatch & Exchange Policy
          </span>
          <h1 className="font-serif text-3xl font-bold text-bottle-green mt-1">
            Shipping & Return Policy
          </h1>
          <p className="text-xs text-secondary-text mt-1">Clear guidelines for fresh perishable henna delivery</p>
        </div>

        <div className="space-y-8 text-sm leading-relaxed text-primary-text">
          {/* Shipping guidelines */}
          <div className="rounded-2xl border border-subtle-border p-6 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-serif text-xl font-semibold text-bottle-green">
              <Truck className="h-5 w-5 text-antique-gold" />
              <h2>Domestic Delivery Guidelines</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-secondary-text">
              <li>
                <strong>Dispatch Schedule:</strong> Fresh cones are mixed and rolled to order. Dispatches occur every Monday, Wednesday, and Friday to avoid weekend parcel transit delays in transit hubs.
              </li>
              <li>
                <strong>Shipping Duration:</strong> Metro cities typically receive packages within 2–3 business days. Non-metro and regional locations require 3–5 business days.
              </li>
              <li>
                <strong>Shipping Rates:</strong> Flat ₹70 for standard insured express shipping. Free express delivery on domestic orders above ₹999.
              </li>
              <li>
                <strong>Protective Packaging:</strong> All fresh cone orders are shipped in thermal insulated sleeves with cooling protection to preserve dye quality.
              </li>
            </ul>
          </div>

          {/* Returns and replacement */}
          <div className="rounded-2xl border border-subtle-border p-6 bg-white shadow-xs space-y-4">
            <div className="flex items-center gap-2 font-serif text-xl font-semibold text-bottle-green">
              <RotateCcw className="h-5 w-5 text-antique-gold" />
              <h2>Perishable Product Return & Replacement</h2>
            </div>
            <p className="text-secondary-text">
              Because freshly mixed organic henna cones and paste are classified as perishable goods under consumer regulations, <strong>we cannot accept physical returns of opened or unsealed cones</strong> once delivered.
            </p>
            <div className="rounded-xl bg-warm-ivory/50 p-4 border border-subtle-border">
              <h3 className="font-semibold text-bottle-green mb-1">Transit Damage / Defect Claim:</h3>
              <p className="text-xs text-secondary-text">
                If your package arrives physically damaged or leaked during transit, please photograph the unopened parcel and damaged cones within <strong>24 hours of delivery</strong> and email <a href="mailto:support@mehndibydhirali.com" className="text-bottle-green underline">support@mehndibydhirali.com</a>. We will dispatch an immediate replacement or issue a store credit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
