import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'

export default function CancellationPage() {
  useEffect(() => {
    document.title = 'Cancellation Policy — Mehndi By Dhirali'
  }, [])

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cancellation Policy' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-subtle-border pb-6 mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-antique-gold">
            Order Adjustments
          </span>
          <h1 className="font-serif text-3xl font-bold text-bottle-green mt-1">
            Cancellation Policy
          </h1>
          <p className="text-xs text-secondary-text mt-1">Guidelines for order cancellations and refunds</p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-primary-text">
          <p>
            At <strong>Mehndi By Dhirali</strong>, we strive to dispatch orders rapidly to ensure fresh, peak dye-release upon arrival.
          </p>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-bottle-green">
              Cancellation Before Preparation
            </h2>
            <p className="text-secondary-text">
              You may cancel your order within <strong>2 hours of placing it</strong> or prior to batch mixing and dispatch handover by emailing <a href="mailto:support@mehndibydhirali.com" className="text-bottle-green underline">support@mehndibydhirali.com</a> with your order number. A 100% refund will be credited back to the original payment source within 5–7 business days via Razorpay.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif text-lg font-semibold text-bottle-green">
              Cancellation After Dispatch
            </h2>
            <p className="text-secondary-text">
              Once an order has been handed over to our courier partner and generated an airway bill (AWB), cancellation is no longer possible because fresh natural henna paste cannot be redirected without temperature degradation.
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  )
}
