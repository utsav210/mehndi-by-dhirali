import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'

export default function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy — Mehndi By Dhirali'
  }, [])

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Privacy Policy' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-subtle-border pb-6 mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-antique-gold">
            Legal & Compliance
          </span>
          <h1 className="font-serif text-3xl font-bold text-bottle-green mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-secondary-text mt-1">
            Last updated: October 2024 • Compliant with Indian IT Act, 2000 & SPDI Rules
          </p>
        </div>

        <div className="space-y-6 text-sm leading-relaxed text-primary-text">
          <div className="rounded-xl bg-warm-ivory/40 p-4 border border-subtle-border text-xs text-secondary-text">
            <strong>Notice:</strong> This privacy policy explains how <strong>Mehndi By Dhirali</strong> collects, handles, stores, and protects personal information provided by visitors and shoppers on our website.
          </div>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-bottle-green">
              1. Information We Collect
            </h2>
            <p>
              When you purchase or attempt to purchase through our site, we collect specific personal information required to fulfill your order, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-secondary-text">
              <li>Contact details: Name, email address, contact telephone number.</li>
              <li>Delivery details: Physical street address, state, city, and postal code.</li>
              <li>Order history and interaction logs necessary for customer assistance.</li>
            </ul>
            <p className="text-xs text-secondary-text">
              <em>Note:</em> We do <strong>not</strong> collect or store full credit/debit card numbers or bank account credentials on our servers. All financial transactions are securely processed directly by our PCI-DSS compliant payment provider, <strong>Razorpay</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-bottle-green">
              2. How We Use Your Information
            </h2>
            <p>We use the collected information solely for legitimate business operations:</p>
            <ul className="list-disc pl-5 space-y-1 text-secondary-text">
              <li>Processing, packaging, and dispatching your orders.</li>
              <li>Sending transactional SMS and email notifications regarding delivery status.</li>
              <li>Preventing unauthorized fraudulent transactions and protecting store security.</li>
              <li>Responding to your customer service queries.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-bottle-green">
              3. Data Retention and Security
            </h2>
            <p>
              We implement industry-standard encryption protocols (SSL/TLS) for data in transit. Your personal information is retained only as long as necessary to comply with financial accounting obligations under Indian taxation laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-bottle-green">
              4. Contact the Grievance Officer
            </h2>
            <p>
              In accordance with Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, for any queries or privacy requests, contact:
            </p>
            <p className="font-medium text-bottle-green">
              Grievance Officer: Dhirali Gandhi<br />
              Email: privacy@mehndibydhirali.com<br />
              Gujarat, India
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  )
}
