import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { apiClient, ApiClientError } from '@/lib/api-client'
import { formatPrice } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'
import {
  ArrowLeft,
  Search,
  Truck,
  Package,
  ExternalLink,
  Edit3,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Filter,
} from 'lucide-react'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modal state for updating tracking & fulfillment
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)
  const [updateError, setUpdateError] = useState<string | null>(null)

  // Tracking form inputs
  const [formStatus, setFormStatus] = useState<OrderStatus>('processing')
  const [formTrackingNum, setFormTrackingNum] = useState('')
  const [formCourier, setFormCourier] = useState('')
  const [formTrackingUrl, setFormTrackingUrl] = useState('')
  const [formEstDelivery, setFormEstDelivery] = useState('')
  const [formNotes, setFormNotes] = useState('')

  useEffect(() => {
    document.title = 'Orders & Fulfillment — Mehndi By Dhirali Admin'
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await apiClient.get<Order[]>('/admin/orders')
      setOrders(data)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message)
      } else {
        setError('Failed to load orders. Please refresh.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const openUpdateModal = (order: Order) => {
    setSelectedOrder(order)
    setFormStatus(order.status)
    setFormTrackingNum(order.tracking_number || '')
    setFormCourier(order.courier_partner || 'Delhivery Express')
    setFormTrackingUrl(order.tracking_url || '')
    setFormEstDelivery(order.estimated_delivery || 'Within 2-3 business days')
    setFormNotes(order.tracking_notes || '')
    setUpdateSuccess(null)
    setUpdateError(null)
  }

  const handleFulfillmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return

    setIsUpdating(true)
    setUpdateError(null)
    setUpdateSuccess(null)

    try {
      const updated = await apiClient.put<Order>(`/admin/orders/${selectedOrder.id}/tracking`, {
        status: formStatus,
        tracking_number: formTrackingNum.trim() || null,
        courier_partner: formCourier.trim() || null,
        tracking_url: formTrackingUrl.trim() || null,
        estimated_delivery: formEstDelivery.trim() || null,
        tracking_notes: formNotes.trim() || null,
      })

      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? { ...o, ...updated } : o))
      )
      setUpdateSuccess('Fulfillment details updated successfully! Live on tracking page.')
      setTimeout(() => {
        setSelectedOrder(null)
      }, 1200)
    } catch (err) {
      if (err instanceof ApiClientError) {
        setUpdateError(err.message)
      } else {
        setUpdateError('Failed to update fulfillment details.')
      }
    } finally {
      setIsUpdating(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter

    const q = searchQuery.toLowerCase().trim()
    if (!q) return matchesStatus

    const matchesSearch =
      order.order_number.toLowerCase().includes(q) ||
      (order.tracking_number && order.tracking_number.toLowerCase().includes(q)) ||
      (order.shipping_address && order.shipping_address.full_name.toLowerCase().includes(q)) ||
      (order.shipping_address && order.shipping_address.city.toLowerCase().includes(q))

    return matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'out_for_delivery':
      case 'in_transit':
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'processing':
        return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'paid':
      case 'confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <PageLayout>
      {/* Top Banner */}
      <div className="bg-forest-green text-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold">Orders & Fulfillment</h1>
              <p className="text-xs text-warm-ivory/70">
                Update tracking numbers, courier dispatches, and delivery milestones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/track"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-xl border border-antique-gold/40 bg-antique-gold/10 px-3.5 py-2 text-xs font-medium text-warm-ivory hover:bg-antique-gold/20 transition"
            >
              <ExternalLink className="h-3.5 w-3.5 text-antique-gold" />
              Customer Tracking Page
            </Link>
            <button
              onClick={fetchOrders}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-medium text-warm-ivory hover:bg-white/20 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters & Search Bar */}
        <div className="rounded-2xl border border-subtle-border bg-white p-4 sm:p-5 shadow-xs mb-6">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order #, customer, city, or AWB tracking #..."
                className="w-full rounded-xl border border-subtle-border bg-warm-ivory/20 px-4 py-2.5 pl-10 text-xs sm:text-sm text-charcoal placeholder:text-secondary-text/60 focus:border-bottle-green focus:bg-white focus:outline-hidden transition"
              />
              <Search className="h-4 w-4 text-secondary-text absolute left-3.5 top-3" />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <Filter className="h-4 w-4 text-secondary-text shrink-0" />
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'paid', label: 'Paid / Confirmed' },
                { id: 'processing', label: 'Processing' },
                { id: 'shipped', label: 'Shipped' },
                { id: 'in_transit', label: 'In Transit' },
                { id: 'delivered', label: 'Delivered' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                    statusFilter === tab.id
                      ? 'bg-bottle-green text-warm-ivory'
                      : 'bg-warm-ivory/40 text-secondary-text hover:bg-warm-ivory hover:text-charcoal'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-red-800 text-sm">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Orders Table */}
        <div className="rounded-2xl border border-subtle-border bg-white shadow-xs overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-secondary-text text-sm flex items-center justify-center gap-2">
              <RefreshCw className="h-4 w-4 animate-spin text-bottle-green" />
              Loading customer orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-warm-ivory text-secondary-text mb-3">
                <Package className="h-6 w-6 text-bottle-green" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-bottle-green">
                No orders match your filter
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                {orders.length === 0
                  ? 'No customer orders have been received yet. Test by placing an order via checkout!'
                  : 'Try clearing your search query or choosing another status tab.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-warm-ivory/50 border-b border-subtle-border text-secondary-text font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Customer & City</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4">Fulfillment & Courier</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle-border">
                  {filteredOrders.map((order) => {
                    const recipient =
                      order.shipping_address?.full_name || 'Guest Shopper'
                    const destination =
                      order.shipping_address?.city || 'India'

                    return (
                      <tr key={order.id} className="hover:bg-warm-ivory/20 transition">
                        {/* Order Number */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-bottle-green">
                          {order.order_number}
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-charcoal">{recipient}</p>
                          <p className="text-xs text-secondary-text">{destination}</p>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-secondary-text whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 font-semibold text-charcoal">
                          {formatPrice(order.total_minor)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${getStatusBadge(
                              order.status
                            )}`}
                          >
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </td>

                        {/* Courier / Tracking */}
                        <td className="py-3.5 px-4">
                          {order.tracking_number ? (
                            <div>
                              <p className="font-mono text-xs font-semibold text-bottle-green">
                                {order.tracking_number}
                              </p>
                              <p className="text-[11px] text-secondary-text">
                                {order.courier_partner || 'Courier'}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-secondary-text italic">
                              Unassigned
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openUpdateModal(order)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-bottle-green/30 bg-warm-ivory/50 px-2.5 py-1.5 text-xs font-medium text-bottle-green hover:bg-warm-ivory hover:border-bottle-green transition"
                              title="Update Tracking & Fulfillment"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-antique-gold" />
                              Fulfillment
                            </button>

                            <Link
                              to={`/track?order=${order.order_number}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-secondary-text hover:text-bottle-green hover:bg-warm-ivory transition"
                              title="Preview Customer Tracking View"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Fulfillment Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-subtle-border bg-white p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-secondary-text hover:text-charcoal hover:bg-warm-ivory transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <Truck className="h-5 w-5 text-antique-gold" />
              <h3 className="font-serif text-lg font-bold text-bottle-green">
                Update Fulfillment & Tracking
              </h3>
            </div>
            <p className="text-xs text-secondary-text mb-4">
              Order <span className="font-mono font-semibold text-bottle-green">#{selectedOrder.order_number}</span> · {selectedOrder.shipping_address?.full_name || 'Customer'}
            </p>

            {updateSuccess && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{updateSuccess}</span>
              </div>
            )}

            {updateError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{updateError}</span>
              </div>
            )}

            <form onSubmit={handleFulfillmentSubmit} className="space-y-4">
              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Order Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as OrderStatus)}
                  className="w-full rounded-xl border border-subtle-border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                >
                  <option value="confirmed">Confirmed (Payment Received)</option>
                  <option value="processing">Processing (Fresh Batch Prep)</option>
                  <option value="shipped">Shipped (Dispatched to Courier)</option>
                  <option value="in_transit">In Transit (Logistics Hub)</option>
                  <option value="out_for_delivery">Out for Delivery (Doorstep)</option>
                  <option value="delivered">Delivered (Completed)</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Courier Partner */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Courier Partner
                </label>
                <input
                  type="text"
                  value={formCourier}
                  onChange={(e) => setFormCourier(e.target.value)}
                  placeholder="e.g. Delhivery Express, Blue Dart, DTDC, India Post Speed Post"
                  className="w-full rounded-xl border border-subtle-border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                />
              </div>

              {/* Tracking Number (AWB) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Tracking / Waybill (AWB) Number
                </label>
                <input
                  type="text"
                  value={formTrackingNum}
                  onChange={(e) => setFormTrackingNum(e.target.value)}
                  placeholder="e.g. DEL123456789 or SPEEDPOST1234IN"
                  className="w-full rounded-xl border border-subtle-border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-charcoal font-mono focus:border-bottle-green focus:outline-hidden"
                />
              </div>

              {/* Tracking Portal URL */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Direct Tracking URL <span className="text-secondary-text font-normal lowercase">(optional)</span>
                </label>
                <input
                  type="url"
                  value={formTrackingUrl}
                  onChange={(e) => setFormTrackingUrl(e.target.value)}
                  placeholder="https://www.delhivery.com/track/package/..."
                  className="w-full rounded-xl border border-subtle-border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                />
              </div>

              {/* Estimated Delivery */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Estimated Delivery Date
                </label>
                <input
                  type="text"
                  value={formEstDelivery}
                  onChange={(e) => setFormEstDelivery(e.target.value)}
                  placeholder="e.g. Within 2-3 business days or 28 Oct 2026"
                  className="w-full rounded-xl border border-subtle-border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                />
              </div>

              {/* Fulfillment Notes */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Status Notes <span className="text-secondary-text font-normal lowercase">(visible to customer)</span>
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  rows={2}
                  placeholder="e.g. Fresh organic batch prepared and sealed in insulated cold pack."
                  className="w-full rounded-xl border border-subtle-border bg-white px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-subtle-border">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-xl border border-subtle-border bg-warm-ivory/50 px-4 py-2 text-xs font-medium text-secondary-text hover:bg-warm-ivory transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="rounded-xl bg-bottle-green px-5 py-2 text-xs font-medium text-warm-ivory hover:bg-deep-forest hover:text-white transition disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Fulfillment Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  )
}