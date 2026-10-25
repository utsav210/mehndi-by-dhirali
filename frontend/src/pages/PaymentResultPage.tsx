import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { CheckCircle2, XCircle, ArrowRight, Package, Home } from 'lucide-react'

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status') || 'success'
  const paymentId = searchParams.get('payment_id') || 'pay_' + Date.now().toString().slice(-8)

  const isSuccess = status === 'success'

  useEffect(() => {
    document.title = isSuccess
      ? 'Payment Confirmed — Mehndi By Dhirali'
      : 'Payment Failed — Mehndi By Dhirali'
  }, [isSuccess])

  return (
    <PageLayout>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-subtle-border bg-white p-8 md:p-12 shadow-card">
          {isSuccess ? (
            <>
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success mb-6">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-bottle-green">
                Payment Successful!
              </h1>
              <p className="mt-3 text-sm sm:text-base text-secondary-text">
                Thank you for your order with <strong>Mehndi By Dhirali</strong>. Your payment has been received and verified.
              </p>

              <div className="mt-6 rounded-2xl bg-warm-ivory/40 p-4 border border-subtle-border text-left max-w-md mx-auto text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-secondary-text">Payment Reference:</span>
                  <span className="font-mono font-medium text-primary-text">{paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-text">Status:</span>
                  <span className="font-semibold text-success">Confirmed / Paid</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-text">Estimated Dispatch:</span>
                  <span className="text-primary-text">Within 24-48 business hours</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-bottle-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-green transition shadow-xs"
                >
                  <Package className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full border border-subtle-border px-6 py-2.5 text-sm font-semibold text-primary-text hover:bg-warm-ivory transition"
                >
                  <Home className="h-4 w-4" />
                  <span>Return to Home</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-error/10 text-error mb-6">
                <XCircle className="h-10 w-10" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-bottle-green">
                Payment Not Completed
              </h1>
              <p className="mt-3 text-sm sm:text-base text-secondary-text">
                The transaction was interrupted or declined by your bank. No money has been debited from your account.
              </p>

              <div className="mt-8 flex justify-center gap-4">
                <Link
                  to="/checkout"
                  className="inline-flex items-center gap-2 rounded-full bg-bottle-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-green transition shadow-xs"
                >
                  <span>Try Payment Again</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
