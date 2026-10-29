import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { apiClient, ApiClientError } from '@/lib/api-client'
import { useAuthStore } from '@/lib/auth-store'
import { formatPrice } from '@/lib/utils'
import type { OrderTrackingResponse } from '@/types'
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  MapPin,
  Calendar,
  Phone,
  Mail,
} from 'lucide-react'

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams()
  const { user } = useAuthStore()

  const [orderQuery, setOrderQuery] = useState(
    searchParams.get('order') || searchParams.get('tracking') || ''
  )
  const [contactQuery, setContactQuery] = useState(
    user?.email || user?.phone || ''
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [trackingData, setTrackingData] = useState<OrderTrackingResponse | null>(null)

  useEffect(() => {
    document.title = 'Track Your Order — Mehndi By Dhirali'
  }, [])

  // Auto-search if query params are present in URL
  useEffect(() => {
    const qOrder = searchParams.get('order') || searchParams.get('tracking')
    if (qOrder) {
      setOrderQuery(qOrder)
      handleLookup(qOrder, contactQuery)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleLookup = async (orderOrAwb: string, contact: string) => {
    const cleanRef = orderOrAwb.trim()
    const cleanContact = contact.trim()

    if (!cleanRef) {
      setError('Please enter your Order Number (e.g. MBD-...) or Tracking Number.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const isOrderNum = cleanRef.toUpperCase().startsWith('MBD-')
      const params: Record<string, string> = {}

      if (isOrderNum) {
        params.order_number = cleanRef
      } else {
        // Try as tracking number first, or order number fallback
        params.tracking_number = cleanRef
      }

      if (cleanContact) {
        params.email_or_phone = cleanContact
      }

      let res: OrderTrackingResponse
      try {
        res = await apiClient.get<OrderTrackingResponse>('/orders/track', { params })
      } catch (firstErr) {
        // If searching with tracking_number gave 404, try searching as order_number
        if (!isOrderNum && firstErr instanceof ApiClientError && firstErr.status === 404) {
          const fallbackParams: Record<string, string> = { order_number: cleanRef }
          if (cleanContact) fallbackParams.email_or_phone = cleanContact
          res = await apiClient.get<OrderTrackingResponse>('/orders/track', { params: fallbackParams })
        } else {
          throw firstErr
        }
      }

      setTrackingData(res)
    } catch (err) {
      setTrackingData(null)
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError('Unable to retrieve tracking information. Please check your reference and try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLookup(orderQuery, contactQuery)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'out_for_delivery':
      case 'in_transit':
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-warm-ivory text-bottle-green border-sand-beige'
    }
  }

  return (
    <PageLayout>
      {/* Hero Header */}
      <section className="bg-forest-green text-warm-ivory py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C4A15A_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-antique-gold/40 bg-antique-gold/10 px-4 py-1 text-xs tracking-wider uppercase text-antique-gold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Live Shipment Tracker
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
            Track Your Fresh Henna Order
          </h1>
          <p className="text-sm sm:text-base text-warm-ivory/80 max-w-2xl mx-auto">
            Freshly prepared artisanal Sojat henna cones and kits are made in batches and dispatched in insulated packaging with premium courier partners.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-16 relative z-20">
        {/* Search Card */}
        <div className="rounded-2xl border border-subtle-border bg-white p-6 sm:p-8 shadow-lg">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Order Number or Tracking AWB <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    placeholder="e.g. MBD-2026-1001 or DEL123456789"
                    required
                    className="w-full rounded-xl border border-subtle-border bg-warm-ivory/30 px-4 py-3 pl-10 text-sm text-charcoal placeholder:text-secondary-text/60 focus:border-bottle-green focus:bg-white focus:outline-hidden transition"
                  />
                  <Search className="h-4 w-4 text-secondary-text absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Email or Mobile Number <span className="text-secondary-text font-normal lowercase">(for verification)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={contactQuery}
                    onChange={(e) => setContactQuery(e.target.value)}
                    placeholder="e.g. bride@example.com or 9876543210"
                    className="w-full rounded-xl border border-subtle-border bg-warm-ivory/30 px-4 py-3 pl-10 text-sm text-charcoal placeholder:text-secondary-text/60 focus:border-bottle-green focus:bg-white focus:outline-hidden transition"
                  />
                  <ShieldCheck className="h-4 w-4 text-secondary-text absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-secondary-text flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                Contact verification keeps your order addresses and items secure.
              </span>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-bottle-green px-8 py-3 text-sm font-medium text-warm-ivory shadow-xs hover:bg-deep-forest hover:text-white transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Clock className="h-4 w-4 animate-spin" />
                    Checking Status...
                  </>
                ) : (
                  <>
                    <Truck className="h-4 w-4" />
                    Track Shipment
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Tracking Inquiry Notice</p>
                <p className="text-xs mt-1 text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tracking Details Result */}
        {trackingData && (
          <div className="mt-8 space-y-6">
            {/* Top Fulfillment Card */}
            <div className="rounded-2xl border border-subtle-border bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-subtle-border">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-serif text-2xl font-bold text-bottle-green">
                      Order #{trackingData.order_number}
                    </h2>
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeClass(
                        trackingData.status
                      )}`}
                    >
                      {trackingData.status_label}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-text mt-1">
                    Placed on {new Date(trackingData.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {trackingData.tracking_url && (
                  <a
                    href={trackingData.tracking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-antique-gold/50 bg-warm-ivory/50 px-4 py-2.5 text-xs font-semibold text-bottle-green hover:bg-warm-ivory hover:border-antique-gold transition"
                  >
                    Track on Courier Portal
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              {/* Courier & AWB Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div className="rounded-xl bg-warm-ivory/40 p-4 border border-sand-beige/40">
                  <span className="text-xs text-secondary-text font-medium uppercase tracking-wider block">
                    Courier Partner
                  </span>
                  <span className="text-sm font-semibold text-bottle-green mt-1 block">
                    {trackingData.courier_partner || 'Assigning Partner'}
                  </span>
                </div>

                <div className="rounded-xl bg-warm-ivory/40 p-4 border border-sand-beige/40">
                  <span className="text-xs text-secondary-text font-medium uppercase tracking-wider block">
                    Waybill (AWB) No.
                  </span>
                  <span className="text-sm font-mono font-semibold text-bottle-green mt-1 block select-all">
                    {trackingData.tracking_number || 'Generated on dispatch'}
                  </span>
                </div>

                <div className="rounded-xl bg-warm-ivory/40 p-4 border border-sand-beige/40">
                  <span className="text-xs text-secondary-text font-medium uppercase tracking-wider block">
                    Estimated Delivery
                  </span>
                  <span className="text-sm font-semibold text-bottle-green mt-1 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-antique-gold shrink-0" />
                    {trackingData.estimated_delivery || '2-4 business days'}
                  </span>
                </div>

                <div className="rounded-xl bg-warm-ivory/40 p-4 border border-sand-beige/40">
                  <span className="text-xs text-secondary-text font-medium uppercase tracking-wider block">
                    Shipment Destination
                  </span>
                  <span className="text-sm font-semibold text-bottle-green mt-1 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-antique-gold shrink-0" />
                    {trackingData.destination_city
                      ? `${trackingData.destination_city}${trackingData.destination_state ? `, ${trackingData.destination_state}` : ''}`
                      : 'India'}
                  </span>
                </div>
              </div>

              {/* Optional Tracking Notes */}
              {trackingData.tracking_notes && (
                <div className="mt-4 rounded-xl border border-antique-gold/30 bg-warm-ivory/30 p-3.5 text-xs text-bottle-green flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-antique-gold shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Fulfillment Update: </span>
                    <span>{trackingData.tracking_notes}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Shipment Timeline */}
            <div className="rounded-2xl border border-subtle-border bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-bottle-green mb-6 flex items-center gap-2">
                <Truck className="h-5 w-5 text-antique-gold" />
                Shipment Journey
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-sand-beige">
                {trackingData.timeline.map((step) => {
                  return (
                    <div key={step.step_key} className="relative flex items-start gap-4">
                      {/* Timeline Node Icon */}
                      <div
                        className={`absolute -left-6 sm:-left-8 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 transition ${
                          step.is_current
                            ? 'bg-bottle-green border-antique-gold text-white ring-4 ring-antique-gold/20'
                            : step.is_completed
                            ? 'bg-bottle-green border-bottle-green text-warm-ivory'
                            : 'bg-white border-sand-beige text-secondary-text/50'
                        }`}
                      >
                        {step.is_completed ? (
                          <CheckCircle2 className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-sand-beige" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-0.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4
                            className={`text-sm font-semibold ${
                              step.is_current
                                ? 'text-bottle-green font-bold'
                                : step.is_completed
                                ? 'text-charcoal'
                                : 'text-secondary-text/70'
                            }`}
                          >
                            {step.title}
                          </h4>
                          {step.timestamp && (
                            <span className="text-xs text-secondary-text flex items-center gap-1">
                              <Clock className="h-3 w-3 text-secondary-text/70" />
                              {new Date(step.timestamp).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-secondary-text mt-1 max-w-xl">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="rounded-2xl border border-subtle-border bg-white p-6 sm:p-8 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-bottle-green mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-antique-gold" />
                Items In This Package
              </h3>

              <div className="divide-y divide-subtle-border">
                {trackingData.items.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-warm-ivory/60 border border-subtle-border flex items-center justify-center">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 text-bottle-green/50" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-bottle-green">
                          {item.product_name}
                        </h4>
                        <p className="text-xs text-secondary-text mt-0.5">
                          Qty: {item.quantity} · SKU: {item.sku}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-bottle-green">
                        {formatPrice(item.total_price_minor)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-subtle-border flex justify-between items-center text-sm font-bold text-bottle-green">
                <span>Total Amount Paid</span>
                <span>{formatPrice(trackingData.total_minor)}</span>
              </div>
            </div>

            {/* Assistance Card */}
            <div className="rounded-2xl border border-antique-gold/30 bg-warm-ivory/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-serif font-bold text-bottle-green">
                  Need Help With Your Shipment?
                </h4>
                <p className="text-xs text-secondary-text mt-1">
                  Our artisan dispatch team is available Monday to Saturday to assist with tracking & delivery queries.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-bottle-green px-4 py-2 text-xs font-medium text-warm-ivory hover:bg-deep-forest transition"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact Support
                </Link>
                <a
                  href="https://wa.me/919988776655"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-bottle-green/30 bg-white px-4 py-2 text-xs font-medium text-bottle-green hover:bg-warm-ivory transition"
                >
                  <Phone className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  )
}