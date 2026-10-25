import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'

export default function TermsPage() {
  useEffect(() => {
    document.title = 'Terms & Conditions — Mehndi By Dhirali'
  }, [])

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Terms and Conditions' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-subtle-border pb-6 mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-antique-gold">
            Store Terms
          </span>
          <h1 className="font-serif text-3xl font-bold text-bottle-green mt-1">
            Terms & Conditions
          </h1>
          <p className="text-xs text-secondary-text mt-1">Effective Date: October 2024</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-primary-text">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-bottle-green">
              1. General Acceptance
            </h2>
            <p>
              By visiting, browsing, or purchasing from <strong>Mehndi By Dhirali</strong>, you agree to be bound by the terms and conditions outlined herein.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-bottle-green">
              2. Product Perishability & Natural Variations
            </h2>
            <p>
              Our fresh organic henna cones contain natural botanical ingredients without synthetic chemical preservatives. Because henna is a perishable natural item:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-secondary-text">
              <li>Customers must freeze cones upon arrival until use.</li>
              <li>Final stain results vary depending on body temperature, skin chemistry, application time, and aftercare diligence.</li>
              <li>A patch test is recommended before applying any essential oil-containing henna paste to verify sensitivity.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-bottle-green">
              3. Pricing and Payments
            </h2>
            <p>
              All prices are listed in Indian Rupees (INR) and are subject to change without prior notice. Orders are accepted upon successful payment authorization through Razorpay.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-bottle-green">
              4. Governing Law and Jurisdiction
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India, with exclusive jurisdiction in the courts of Gujarat, India.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  )
}
