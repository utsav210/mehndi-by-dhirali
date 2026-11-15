import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { apiClient, ApiClientError } from '@/lib/api-client'
import { formatPrice } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'
import {
  ArrowLeft,
  Search,
  Package,
  ExternalLink,
  Edit3,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Filter,
  User,
  MapPin,
  CreditCard,
  Banknote,
  FileText,
  Phone,
  Mail,
  CheckCircle2,
} from 'lucide-react'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modal state for viewing order details & updating fulfillment
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'fulfillment'>('details')
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
    document.title = 'Orders & Customer Management — Mehndi By Dhirali Admin'
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

  const openOrderActionModal = (order: Order, defaultTab: 'details' | 'fulfillment' = 'details') => {
    setSelectedOrder(order)
    setActiveTab(defaultTab)
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
      setSelectedOrder((prev) => (prev ? { ...prev, ...updated } : null))
      setUpdateSuccess('Fulfillment details updated successfully! Live on tracking page.')
      setTimeout(() => {
        setUpdateSuccess(null)
      }, 3000)
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

    const customerName = (order.customer_name || order.shipping_address?.full_name || order.guest_name || '').toLowerCase()
    const city = (order.destination_city || order.shipping_address?.city || '').toLowerCase()
    const email = (order.customer_email || order.guest_email || '').toLowerCase()
    const tracking = (order.tracking_number || '').toLowerCase()
    const orderNum = order.order_number.toLowerCase()

    return (
      matchesStatus &&
      (orderNum.includes(q) ||
        customerName.includes(q) ||
        city.includes(q) ||
        email.includes(q) ||
        tracking.includes(q))
    )
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

  const getPaymentStatusBadge = (order: Order) => {
    const statusText = order.payment_status || (order.payment_method === 'cod' ? 'Pending (COD)' : 'Paid (Online)')
    const isPaid = statusText.toLowerCase().includes('paid') || statusText.toLowerCase().includes('captured')

    if (isPaid) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-semibold border border-emerald-200">
          <CheckCircle2 className="h-3 w-3" />
          {statusText}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-2.5 py-0.5 text-[11px] font-semibold border border-amber-200">
        <Banknote className="h-3 w-3" />
        {statusText}
      </span>
    )
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
              <h1 className="font-serif text-2xl font-bold">Orders & Fulfillment Console</h1>
              <p className="text-xs text-warm-ivory/70">
                Manage live customer orders, view full checkout details & addresses, and update courier shipments
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-medium text-warm-ivory hover:bg-white/20 transition disabled:opacity-50 cursor-pointer"
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
                placeholder="Search by order #, customer name, city, email, or AWB tracking #..."
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
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition cursor-pointer ${
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
                    <th className="py-3 px-4">Payment Status</th>
                    <th className="py-3 px-4">Order Status</th>
                    <th className="py-3 px-4">Fulfillment / AWB</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle-border">
                  {filteredOrders.map((order) => {
                    const customerName =
                      order.customer_name ||
                      order.shipping_address?.full_name ||
                      order.guest_name ||
                      'Customer'
                    const destinationCity =
                      order.destination_city ||
                      order.shipping_address?.city ||
                      'India'
                    const isRegistered = Boolean(order.user_id)

                    return (
                      <tr key={order.id} className="hover:bg-warm-ivory/20 transition">
                        {/* Order Number */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-bottle-green">
                          <button
                            type="button"
                            onClick={() => openOrderActionModal(order, 'details')}
                            className="hover:underline text-left cursor-pointer"
                          >
                            {order.order_number}
                          </button>
                        </td>

                        {/* Customer & City */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-charcoal">{customerName}</span>
                            {isRegistered ? (
                              <span
                                className="text-[10px] bg-bottle-green/10 text-bottle-green px-1.5 py-0.2 rounded font-semibold"
                                title="Registered customer"
                              >
                                User
                              </span>
                            ) : (
                              <span
                                className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded"
                                title="Guest checkout"
                              >
                                Guest
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-secondary-text mt-0.5">
                            <MapPin className="h-3 w-3 text-antique-gold shrink-0" />
                            <span>{destinationCity}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-secondary-text whitespace-nowrap">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 px-4 font-semibold text-charcoal whitespace-nowrap">
                          {formatPrice(order.total_minor)}
                        </td>

                        {/* Payment Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getPaymentStatusBadge(order)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
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
                              onClick={() => openOrderActionModal(order, 'details')}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-bottle-green/30 bg-warm-ivory/50 px-2.5 py-1.5 text-xs font-medium text-bottle-green hover:bg-warm-ivory hover:border-bottle-green transition cursor-pointer"
                              title="View Customer Details & Address"
                            >
                              <FileText className="h-3.5 w-3.5 text-antique-gold" />
                              View Details
                            </button>

                            <button
                              onClick={() => openOrderActionModal(order, 'fulfillment')}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-bottle-green/30 bg-bottle-green/10 px-2.5 py-1.5 text-xs font-medium text-bottle-green hover:bg-bottle-green hover:text-white transition cursor-pointer"
                              title="Update Fulfillment & Tracking"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-antique-gold" />
                              Fulfillment
                            </button>

                            <Link
                              to={`/track?order=${order.order_number}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-secondary-text hover:text-bottle-green hover:bg-warm-ivory transition"
                              title="Preview Customer Tracking Page"
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

      {/* ── Order Action & Details Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl border border-subtle-border bg-white p-6 sm:p-8 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-5 top-5 p-1.5 rounded-xl text-secondary-text hover:text-charcoal hover:bg-warm-ivory transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-subtle-border pr-8">
              <div>
                <div className="flex items-center gap-2.5">
                  <Package className="h-5 w-5 text-antique-gold" />
                  <h3 className="font-serif text-xl font-bold text-bottle-green">
                    Order #{selectedOrder.order_number}
                  </h3>
                </div>
                <p className="text-xs text-secondary-text mt-1 flex items-center gap-2">
                  <span>Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}</span>
                  <span>•</span>
                  <span className="font-semibold text-charcoal">{formatPrice(selectedOrder.total_minor)}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status.replace(/_/g, ' ')}
                </span>
                {getPaymentStatusBadge(selectedOrder)}
              </div>
            </div>

            {/* Tab Selector */}
            <div className="flex items-center gap-2 pt-4 pb-2 border-b border-subtle-border mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-bottle-green text-bottle-green'
                    : 'border-transparent text-secondary-text hover:text-charcoal'
                }`}
              >
                Customer &amp; Checkout Information
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('fulfillment')}
                className={`pb-2.5 px-3 text-xs font-semibold transition border-b-2 cursor-pointer ${
                  activeTab === 'fulfillment'
                    ? 'border-bottle-green text-bottle-green'
                    : 'border-transparent text-secondary-text hover:text-charcoal'
                }`}
              >
                Fulfillment &amp; Courier Dispatch
              </button>
            </div>

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

            {/* ── TAB 1: Complete Customer, Address, Payment & Items Details ── */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* 1. Customer Details */}
                <div className="rounded-2xl bg-warm-ivory/30 p-4 border border-subtle-border">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-bottle-green flex items-center gap-1.5 mb-3">
                    <User className="h-4 w-4 text-antique-gold" />
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-secondary-text block">Customer Name</span>
                      <span className="font-semibold text-charcoal">
                        {selectedOrder.customer_name || selectedOrder.shipping_address?.full_name || selectedOrder.guest_name || 'Customer'}
                      </span>
                      {selectedOrder.user_id && (
                        <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                          Registered User
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-secondary-text block">Email Address</span>
                      <span className="font-medium text-charcoal flex items-center gap-1 mt-0.5">
                        <Mail className="h-3 w-3 text-secondary-text" />
                        {selectedOrder.customer_email || selectedOrder.guest_email || 'Not provided'}
                      </span>
                    </div>

                    <div>
                      <span className="text-secondary-text block">Phone Number</span>
                      <span className="font-medium text-charcoal flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3 text-secondary-text" />
                        {selectedOrder.customer_phone || selectedOrder.shipping_address?.phone || selectedOrder.guest_phone || 'Not provided'}
                      </span>
                    </div>

                    <div>
                      <span className="text-secondary-text block">Checkout Notes</span>
                      <span className="font-medium text-charcoal italic">
                        {selectedOrder.notes || 'No special delivery notes provided.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Shipping / Delivery Address */}
                <div className="rounded-2xl bg-warm-ivory/30 p-4 border border-subtle-border">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-bottle-green flex items-center gap-1.5 mb-3">
                    <MapPin className="h-4 w-4 text-antique-gold" />
                    Delivery / Shipping Address (Taken During Checkout)
                  </h4>
                  {selectedOrder.shipping_address ? (
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-charcoal">
                        {selectedOrder.shipping_address.full_name} ({selectedOrder.shipping_address.label || 'Home'})
                      </p>
                      <p className="text-secondary-text">
                        {selectedOrder.shipping_address.address_line_1}
                      </p>
                      {selectedOrder.shipping_address.address_line_2 && (
                        <p className="text-secondary-text">
                          {selectedOrder.shipping_address.address_line_2}
                        </p>
                      )}
                      <p className="font-medium text-charcoal">
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} - {selectedOrder.shipping_address.postal_code}
                      </p>
                      <p className="text-secondary-text">{selectedOrder.shipping_address.country}</p>
                      <p className="text-secondary-text pt-1 font-mono">
                        Contact: {selectedOrder.shipping_address.phone}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-secondary-text">
                      No explicit shipping address captured on record.
                    </p>
                  )}
                </div>

                {/* 3. Payment Status & Transaction Details */}
                <div className="rounded-2xl bg-warm-ivory/30 p-4 border border-subtle-border">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-bottle-green flex items-center gap-1.5 mb-3">
                    <CreditCard className="h-4 w-4 text-antique-gold" />
                    Payment Details &amp; Status
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-secondary-text block">Payment Method</span>
                      <span className="font-semibold text-charcoal capitalize">
                        {selectedOrder.payment_method === 'cod'
                          ? 'Cash on Delivery (COD)'
                          : 'Prepaid (Razorpay Instant Online)'}
                      </span>
                    </div>

                    <div>
                      <span className="text-secondary-text block">Payment Status</span>
                      <span className="font-semibold text-charcoal">
                        {selectedOrder.payment_status || (selectedOrder.payment_method === 'cod' ? 'Pending COD Collection' : 'Paid')}
                      </span>
                    </div>

                    {selectedOrder.razorpay_order_id && (
                      <div className="sm:col-span-2">
                        <span className="text-secondary-text block">Razorpay Order Reference</span>
                        <span className="font-mono text-charcoal select-all">
                          {selectedOrder.razorpay_order_id}
                        </span>
                      </div>
                    )}

                    <div className="sm:col-span-2 pt-2 border-t border-subtle-border/60">
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-secondary-text">
                          <span>Subtotal:</span>
                          <span className="font-medium text-charcoal">{formatPrice(selectedOrder.subtotal_minor)}</span>
                        </div>
                        <div className="flex justify-between text-secondary-text">
                          <span>Shipping Fee:</span>
                          <span className="font-medium text-charcoal">
                            {selectedOrder.shipping_minor === 0 ? 'Free' : formatPrice(selectedOrder.shipping_minor)}
                          </span>
                        </div>
                        {selectedOrder.cod_fee_minor ? (
                          <div className="flex justify-between text-secondary-text">
                            <span>COD Handling Fee:</span>
                            <span className="font-medium text-charcoal">{formatPrice(selectedOrder.cod_fee_minor)}</span>
                          </div>
                        ) : null}
                        <div className="flex justify-between font-bold text-bottle-green pt-1 border-t border-subtle-border">
                          <span>Total Amount:</span>
                          <span>{formatPrice(selectedOrder.total_minor)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Products Purchased */}
                <div className="rounded-2xl border border-subtle-border p-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-bottle-green flex items-center gap-1.5 mb-3">
                    <Package className="h-4 w-4 text-antique-gold" />
                    Products Purchased ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="divide-y divide-subtle-border">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-lg bg-warm-ivory/50 border border-subtle-border overflow-hidden flex items-center justify-center">
                            {item.product_image ? (
                              <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />
                            ) : (
                              <Package className="h-4 w-4 text-bottle-green/50" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-charcoal">{item.product_name}</p>
                            <p className="text-[11px] text-secondary-text">
                              Qty: {item.quantity} · SKU: {item.sku} · Unit: {formatPrice(item.unit_price_minor)}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-bottle-green whitespace-nowrap">
                          {formatPrice(item.total_price_minor)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('fulfillment')}
                    className="rounded-xl bg-bottle-green px-5 py-2.5 text-xs font-semibold text-white hover:bg-forest-green transition cursor-pointer"
                  >
                    Proceed to Update Fulfillment →
                  </button>
                </div>
              </div>
            )}

            {/* ── TAB 2: Fulfillment & Courier Dispatch Form ── */}
            {activeTab === 'fulfillment' && (
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
                    <option value="processing">Processing (Fresh Batch Preparation)</option>
                    <option value="shipped">Shipped (Dispatched to Courier)</option>
                    <option value="in_transit">In Transit (Logistics Hub)</option>
                    <option value="out_for_delivery">Out for Delivery (Doorstep Delivery)</option>
                    <option value="delivered">Delivered (Successfully Received)</option>
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

                {/* Direct Tracking URL */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Direct Courier Portal URL <span className="text-secondary-text font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formTrackingUrl}
                    onChange={(e) => setFormTrackingUrl(e.target.value)}
                    placeholder="https://www.delhivery.com/track/package/..."
                    className="w-full rounded-xl border border-subtle-border bg-white px-3.5 py-2.5 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                  />
                </div>

                {/* Estimated Delivery Date */}
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

                {/* Status Notes */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Status Notes <span className="text-secondary-text font-normal lowercase">(visible to customer on tracking page)</span>
                  </label>
                  <textarea
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    rows={2}
                    placeholder="e.g. Fresh organic batch prepared and sealed in insulated cold pack."
                    className="w-full rounded-xl border border-subtle-border bg-white px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-subtle-border">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="rounded-xl border border-subtle-border bg-warm-ivory/50 px-4 py-2 text-xs font-medium text-secondary-text hover:bg-warm-ivory transition cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="rounded-xl bg-bottle-green px-5 py-2 text-xs font-medium text-warm-ivory hover:bg-forest-green hover:text-white transition disabled:opacity-50 cursor-pointer"
                  >
                    {isUpdating ? 'Saving...' : 'Save Fulfillment Details'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  )
}
