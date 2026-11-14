import { useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { CheckCircle2, XCircle, ArrowRight, Package, Home, Truck, Clock } from 'lucide-react'

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status') || 'success'
  const method = (searchParams.get('method') || 'prepaid').toLowerCase()
  const orderNumber = searchParams.get('order_number') || ''
  const paymentId = searchParams.get('payment_id') || ''
  const paymentStatus = (searchParams.get('payment_status') || (method === 'cod' ? 'pending' : 'paid')).toLowerCase()

  const isSuccess = status === 'success'
  const isCOD = method === 'cod'
  const isPaymentPending = paymentStatus === 'pending' || isCOD

  useEffect(() => {
    if (!isSuccess) {
      document.title = 'Payment Failed — Mehndi By Dhirali'
    } else if (isCOD) {
      document.title = 'Order Placed — Mehndi By Dhirali'
    } else {
      document.title = 'Payment Confirmed — Mehndi By Dhirali'
    }
  }, [isSuccess, isCOD])

  return (
    <PageLayout>
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-subtle-border bg-white p-8 md:p-12 shadow-card">
          {isSuccess ? (
            <>
              {isCOD ? (
                <>
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-bottle-green/10 text-bottle-green mb-6">
                    <CheckCircle2 className="h-10 w-10 text-bottle-green" />
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-bottle-green">
                    Order Placed Successfully!
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-secondary-text">
                    Thank you for choosing <strong>Mehndi By Dhirali</strong>. Your Cash on Delivery order has been received and scheduled for fresh batch preparation.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Order Placed
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      <Clock className="h-3 w-3 text-amber-600" />
                      Payment: {isPaymentPending ? 'Pending (Pay on Delivery)' : 'Paid'}
                    </span>
                  </div>

                  <div className="mt-6 rounded-2xl bg-warm-ivory/40 p-5 border border-subtle-border text-left max-w-md mx-auto text-xs space-y-2.5">
                    {orderNumber && (
                      <div className="flex justify-between items-center pb-2 border-b border-subtle-border">
                        <span className="text-secondary-text">Order Number:</span>
                        <span className="font-mono font-bold text-bottle-green text-sm">{orderNumber}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-secondary-text">Order Status:</span>
                      <span className="font-semibold text-bottle-green">Confirmed / Order Placed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-text">Payment Method:</span>
                      <span className="font-medium text-primary-text">Cash on Delivery (COD)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-text">Payment Status:</span>
                      <span className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                        isPaymentPending
                          ? 'text-amber-700 bg-amber-100/70'
                          : 'text-emerald-700 bg-emerald-100/70'
                      }`}>
                        {isPaymentPending ? 'Payment Pending' : 'Paid & Verified'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-text">Estimated Dispatch:</span>
                      <span className="text-primary-text font-medium">Within 2-3 business days</span>
                    </div>
                    <p className="text-[11px] text-secondary-text/80 pt-2 border-t border-subtle-border italic">
                      Please have the exact cash or UPI ready for the courier executive upon doorstep delivery.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success mb-6">
                    <CheckCircle2 className="h-10 w-10 text-success" />
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-bottle-green">
                    Payment Successful!
                  </h1>
                  <p className="mt-3 text-sm sm:text-base text-secondary-text">
                    Thank you for your order with <strong>Mehndi By Dhirali</strong>. Your online payment has been received and verified.
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      Order Placed &amp; Paid
                    </span>
                  </div>

                  <div className="mt-6 rounded-2xl bg-warm-ivory/40 p-5 border border-subtle-border text-left max-w-md mx-auto text-xs space-y-2.5">
                    {orderNumber && (
                      <div className="flex justify-between items-center pb-2 border-b border-subtle-border">
                        <span className="text-secondary-text">Order Number:</span>
                        <span className="font-mono font-bold text-bottle-green text-sm">{orderNumber}</span>
                      </div>
                    )}
                    {paymentId && (
                      <div className="flex justify-between">
                        <span className="text-secondary-text">Payment Reference:</span>
                        <span className="font-mono font-medium text-primary-text">{paymentId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-secondary-text">Order Status:</span>
                      <span className="font-semibold text-bottle-green">Confirmed</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-text">Payment Status:</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
                        Paid &amp; Verified
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-text">Estimated Dispatch:</span>
                      <span className="text-primary-text font-medium">Within 2-3 business days</span>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                {orderNumber && (
                  <Link
                    to={`/track?order=${encodeURIComponent(orderNumber)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-bottle-green px-6 py-2.5 text-sm font-semibold text-white hover:bg-forest-green transition shadow-xs w-full sm:w-auto justify-center"
                  >
                    <Truck className="h-4 w-4 text-antique-gold" />
                    <span>Track Order</span>
                  </Link>
                )}
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full border border-bottle-green px-6 py-2.5 text-sm font-semibold text-bottle-green hover:bg-bottle-green/5 transition shadow-xs w-full sm:w-auto justify-center"
                >
                  <Package className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-full border border-subtle-border px-6 py-2.5 text-sm font-semibold text-primary-text hover:bg-warm-ivory transition w-full sm:w-auto justify-center"
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
