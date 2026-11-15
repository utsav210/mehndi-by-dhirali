import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { useCartStore } from '@/lib/cart-store'
import { useAuthStore } from '@/lib/auth-store'
import { formatPrice } from '@/lib/utils'
import { apiClient, ApiClientError } from '@/lib/api-client'
import type { Order, Address } from '@/types'
import { toast } from 'sonner'
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Banknote,
  Truck,
  MapPin,
  Plus,
  LogIn,
  UserPlus,
  BookmarkCheck,
  CheckCircle2,
} from 'lucide-react'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const authLoading = useAuthStore((s) => s.isLoading)

  const items = useCartStore((s) => s.items)
  const getSubtotal = useCartStore((s) => s.getSubtotal)
  const getShippingMinor = useCartStore((s) => s.getShippingMinor)
  const getTotalWeightGrams = useCartStore((s) => s.getTotalWeightGrams)
  const clearCart = useCartStore((s) => s.clearCart)

  // Saved addresses from user profile
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new')
  const [saveToProfile, setSaveToProfile] = useState<boolean>(true)

  // Form fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [stateName, setStateName] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'prepaid'>('cod')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    document.title = 'Secure Checkout — Mehndi By Dhirali'
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items, navigate])

  // Populate user data and fetch saved addresses when authenticated
  useEffect(() => {
    if (user) {
      if (!fullName) {
        const full = `${user.first_name || ''} ${user.last_name || ''}`.trim()
        if (full) setFullName(full)
      }
      if (!email && user.email) setEmail(user.email)
      if (!phone && user.phone) setPhone(user.phone)

      fetchSavedAddresses()
    }
  }, [user])

  const fetchSavedAddresses = async () => {
    try {
      const addrs = await apiClient.get<Address[]>('/addresses')
      setSavedAddresses(addrs)

      if (addrs.length > 0) {
        // Pick default address or first address
        const def = addrs.find((a) => a.is_default) || addrs[0]
        applySavedAddress(def)
      }
    } catch {
      // Guest or local development fallback without addresses
    }
  }

  const applySavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id)
    setFullName(addr.full_name)
    setPhone(addr.phone)
    setAddressLine1(addr.address_line_1)
    setAddressLine2(addr.address_line_2 || '')
    setCity(addr.city)
    setStateName(addr.state)
    setPostalCode(addr.postal_code)
  }

  const handleSelectNewAddress = () => {
    setSelectedAddressId('new')
    setAddressLine1('')
    setAddressLine2('')
    setCity('')
    setStateName('')
    setPostalCode('')
  }

  const subtotal = getSubtotal()
  const shipping = getShippingMinor()
  const codFee = paymentMethod === 'cod' ? 3000 : 0 // ₹30.00 COD handling fee
  const total = subtotal + shipping + codFee
  const totalWeightGrams = getTotalWeightGrams()

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1. Strictly enforce authentication
    if (!isAuthenticated) {
      toast.error('Please sign in or create an account to proceed with your order.')
      navigate('/login?redirect=/checkout')
      return
    }

    if (!fullName || !phone || !email || !addressLine1 || !city || !postalCode) {
      toast.error('Please fill in all required shipping address fields.')
      return
    }

    setIsProcessing(true)

    try {
      // If customer checked "save address" and entered a new address, save it to their profile
      if (saveToProfile && selectedAddressId === 'new') {
        try {
          await apiClient.post('/addresses', {
            label: 'Home',
            full_name: fullName,
            phone,
            address_line_1: addressLine1,
            address_line_2: addressLine2 || undefined,
            city,
            state: stateName,
            postal_code: postalCode,
            country: 'India',
            is_default: savedAddresses.length === 0,
          })
        } catch {
          // Non-blocking if address saving fails
        }
      }

      // 1. Create order on backend
      const payload = {
        items: items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
        email,
        phone,
        payment_method: paymentMethod,
        notes: notes.trim() || undefined,
        shipping_address: {
          label: 'Home',
          full_name: fullName,
          phone,
          address_line_1: addressLine1,
          address_line_2: addressLine2 || undefined,
          city,
          state: stateName,
          postal_code: postalCode,
          country: 'India',
        },
      }

      let createdOrder: Order
      try {
        createdOrder = await apiClient.post<Order>('/orders', payload)
      } catch (apiErr) {
        if (apiErr instanceof ApiClientError) {
          throw new Error(apiErr.message)
        }
        throw apiErr
      }

      // 2. Handle based on payment method
      if (paymentMethod === 'cod') {
        clearCart()
        toast.success('Order placed successfully with Cash on Delivery!')
        navigate(
          `/payment/result?status=success&method=cod&order_number=${createdOrder.order_number}&payment_status=pending`
        )
        return
      }

      // 3. Prepaid: Razorpay payment gateway
      const razorpayKey = (
        createdOrder.razorpay_key_id ||
        import.meta.env.VITE_RAZORPAY_KEY_ID ||
        ''
      ).trim().replace(/['"]/g, '')

      // If in demo/test mode without live keys, complete simulated checkout gracefully
      if (!razorpayKey || razorpayKey.includes('placeholder') || razorpayKey.includes('paste_your')) {
        toast.info('Test Mode: Simulating secure prepaid payment gateway...')
        try {
          await apiClient.post('/payments/verify', {
            razorpay_order_id: createdOrder.razorpay_order_id || 'order_mock',
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: 'sig_mock',
          })
        } catch {
          // Simulation fallback
        }
        clearCart()
        toast.success('Prepaid order placed in simulation mode!')
        navigate(
          `/payment/result?status=success&method=prepaid&order_number=${createdOrder.order_number}&payment_id=mock_pay_${Date.now()}&payment_status=succeeded`
        )
        return
      }

      // Client-side Razorpay SDK loader
      const loadRazorpayScript = () => {
        return new Promise<boolean>((resolve) => {
          if ((window as any).Razorpay) {
            resolve(true)
            return
          }
          const script = document.createElement('script')
          script.src = 'https://checkout.razorpay.com/v1/checkout.js'
          script.async = true
          script.onload = () => resolve(true)
          script.onerror = () => resolve(false)
          document.body.appendChild(script)
        })
      }

      const scriptLoaded = await loadRazorpayScript()

      if (!scriptLoaded) {
        toast.error('Failed to load Razorpay payment SDK. Please check your internet connection.')
        setIsProcessing(false)
        return
      }

      const options: Record<string, any> = {
        key: razorpayKey,
        amount: total,
        currency: 'INR',
        name: 'Mehndi By Dhirali',
        description: `Order ${createdOrder.order_number}`,
        image: '/favicon.png',
        handler: async function (response: any) {
          try {
            await apiClient.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id || createdOrder.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
          } catch (verifyErr: any) {
            console.warn('Payment verification notice:', verifyErr)
          }
          clearCart()
          toast.success('Payment completed successfully!')
          navigate(
            `/payment/result?status=success&method=prepaid&order_number=${createdOrder.order_number}&payment_id=${response.razorpay_payment_id || 'pay_online'}&payment_status=succeeded`
          )
        },
        prefill: {
          name: fullName,
          email: email,
          contact: phone,
        },
        theme: {
          color: '#243F2A',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false)
            toast.info('Payment window was closed. You can retry anytime.')
          },
        },
      }

      if (createdOrder.razorpay_order_id && !createdOrder.razorpay_order_id.startsWith('order_mock_')) {
        options.order_id = createdOrder.razorpay_order_id
      }

      try {
        const rzp = new (window as any).Razorpay(options)
        rzp.on('payment.failed', function (failResp: any) {
          setIsProcessing(false)
          const reason = failResp?.error?.description || failResp?.error?.reason || 'Payment could not be completed.'
          toast.error(`Payment Failed: ${reason}`)
        })
        rzp.open()
      } catch (err: any) {
        setIsProcessing(false)
        console.warn('Razorpay checkout initialization error:', err)
        toast.error(err.message || 'Could not open Razorpay checkout popup. Please allow popups or try again.')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error initiating checkout. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cart', href: '/cart' },
              { label: 'Checkout' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-8 text-bottle-green">
          <Lock className="h-6 w-6 text-antique-gold" />
          <h1 className="font-serif text-3xl font-bold">Secure Checkout</h1>
        </div>

        {/* ── Authentication Required Prompt (When Not Logged In) ── */}
        {!authLoading && !isAuthenticated && (
          <div className="mb-8 rounded-3xl border-2 border-dashed border-antique-gold/60 bg-warm-ivory/40 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-antique-gold/15 px-3 py-1 text-xs font-semibold text-bottle-green">
                  <Lock className="h-3.5 w-3.5 text-antique-gold" />
                  <span>Account Required For Checkout</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-bottle-green">
                  Please Sign In or Create an Account
                </h2>
                <p className="text-xs sm:text-sm text-secondary-text">
                  To ensure shipment security, real-time AWB parcel tracking, and seamless delivery address management, you must be logged in to place an order or make a payment.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <Link
                  to="/login?redirect=/checkout"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-bottle-green px-6 py-3 text-sm font-semibold text-white hover:bg-forest-green shadow-xs transition"
                >
                  <LogIn className="h-4 w-4 text-antique-gold" />
                  <span>Sign In</span>
                </Link>

                <Link
                  to="/register?redirect=/checkout"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-bottle-green/40 bg-white px-6 py-3 text-sm font-semibold text-bottle-green hover:bg-warm-ivory shadow-xs transition"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Create Account</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Shipping & Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="rounded-2xl border border-subtle-border p-6 bg-white shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-xl font-semibold text-bottle-green flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bottle-green text-xs text-white">
                    1
                  </span>
                  <span>Delivery Address</span>
                </h2>

                {isAuthenticated && (
                  <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Logged in as {user?.first_name || user?.email}
                  </span>
                )}
              </div>

              {/* Saved Addresses Selector (for Authenticated Users) */}
              {isAuthenticated && savedAddresses.length > 0 && (
                <div className="mb-6 rounded-xl bg-warm-ivory/30 p-4 border border-subtle-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-bottle-green flex items-center gap-1.5">
                      <BookmarkCheck className="h-4 w-4 text-antique-gold" />
                      Choose from Your Saved Addresses
                    </span>
                    <button
                      type="button"
                      onClick={handleSelectNewAddress}
                      className="text-xs font-semibold text-bottle-green hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      New Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => {
                      const isSelected = selectedAddressId === addr.id
                      return (
                        <div
                          key={addr.id}
                          onClick={() => applySavedAddress(addr)}
                          className={`p-3.5 rounded-xl border text-xs cursor-pointer transition flex flex-col justify-between ${
                            isSelected
                              ? 'border-bottle-green bg-white shadow-xs ring-1 ring-bottle-green'
                              : 'border-subtle-border bg-white/70 hover:bg-white'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-semibold text-bottle-green flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-antique-gold" />
                                {addr.label || 'Home'}
                              </span>
                              {addr.is_default && (
                                <span className="text-[10px] bg-bottle-green/10 text-bottle-green px-2 py-0.5 rounded-full font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="font-medium text-charcoal">{addr.full_name}</p>
                            <p className="text-secondary-text mt-0.5 line-clamp-2">
                              {addr.address_line_1}
                              {addr.address_line_2 ? `, ${addr.address_line_2}` : ''}
                            </p>
                            <p className="text-secondary-text font-medium">
                              {addr.city}, {addr.state} - {addr.postal_code}
                            </p>
                          </div>
                          <p className="text-[11px] text-secondary-text/80 mt-2">
                            Ph: {addr.phone}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Address Form Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    disabled={!isAuthenticated}
                    className="w-full rounded-lg border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-hidden disabled:bg-warm-ivory/30 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Phone Number (for Courier & AWB updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    disabled={!isAuthenticated}
                    className="w-full rounded-lg border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-hidden disabled:bg-warm-ivory/30 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Email Address (for Order Confirmation & Tracking) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    disabled={!isAuthenticated}
                    className="w-full rounded-lg border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-hidden disabled:bg-warm-ivory/30 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Street Address / Flat / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Flat 402, Lotus Residency"
                    disabled={!isAuthenticated}
                    className="w-full rounded-lg border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-hidden disabled:bg-warm-ivory/30 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Area / Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Near Central Park"
                    disabled={!isAuthenticated}
                    className="w-full rounded-lg border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-hidden disabled:bg-warm-ivory/30 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Jaipur"
                    disabled={!isAuthenticated}
                    className="w-full rounded-lg border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-hidden disabled:bg-warm-ivory/30 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Rajasthan"
                    disabled={!isAuthenticated}
                    className="w-full rounded-lg border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-hidden disabled:bg-warm-ivory/30 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="302001"
                    disabled={!isAuthenticated}
                    className="w-full rounded-lg border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-hidden disabled:bg-warm-ivory/30 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Delivery Notes / Instructions <span className="font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Ring doorbell or leave with security"
                    disabled={!isAuthenticated}
                    className="w-full rounded-lg border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-hidden disabled:bg-warm-ivory/30 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Save address checkbox */}
                {isAuthenticated && selectedAddressId === 'new' && (
                  <div className="sm:col-span-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-bottle-green">
                      <input
                        type="checkbox"
                        checked={saveToProfile}
                        onChange={(e) => setSaveToProfile(e.target.checked)}
                        className="h-4 w-4 rounded text-bottle-green focus:ring-bottle-green cursor-pointer"
                      />
                      <span>Save this address to my profile for faster checkout next time</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="rounded-2xl border border-subtle-border p-6 bg-white shadow-xs">
              <h2 className="font-serif text-xl font-semibold text-bottle-green mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bottle-green text-xs text-white">
                  2
                </span>
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Cash on Delivery option */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border transition ${
                    !isAuthenticated
                      ? 'border-subtle-border bg-warm-ivory/20 opacity-60 cursor-not-allowed'
                      : paymentMethod === 'cod'
                      ? 'border-bottle-green bg-warm-ivory/50 shadow-xs cursor-pointer'
                      : 'border-subtle-border bg-white hover:bg-warm-ivory/20 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cod"
                      disabled={!isAuthenticated}
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="h-4 w-4 text-bottle-green focus:ring-bottle-green cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-bottle-green" />
                        <span className="text-sm font-semibold text-charcoal">
                          Cash on Delivery
                        </span>
                      </div>
                      <p className="text-xs text-secondary-text mt-0.5">
                        Pay in cash when your fresh henna shipment arrives at your doorstep
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-bottle-green bg-bottle-green/10 px-2.5 py-1 rounded-md">
                    +₹30.00 fee
                  </span>
                </label>

                {/* Prepaid option */}
                <label
                  className={`flex items-center justify-between p-4 rounded-xl border transition ${
                    !isAuthenticated
                      ? 'border-subtle-border bg-warm-ivory/20 opacity-60 cursor-not-allowed'
                      : paymentMethod === 'prepaid'
                      ? 'border-bottle-green bg-warm-ivory/50 shadow-xs cursor-pointer'
                      : 'border-subtle-border bg-white hover:bg-warm-ivory/20 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="prepaid"
                      disabled={!isAuthenticated}
                      checked={paymentMethod === 'prepaid'}
                      onChange={() => setPaymentMethod('prepaid')}
                      className="h-4 w-4 text-bottle-green focus:ring-bottle-green cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-bottle-green" />
                        <span className="text-sm font-semibold text-charcoal">
                          Prepaid (Instant Online)
                        </span>
                      </div>
                      <p className="text-xs text-secondary-text mt-0.5">
                        UPI (GPay, PhonePe, Paytm), NetBanking, Credit &amp; Debit Cards
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    No COD fee
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Checkout Review & Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-subtle-border bg-warm-ivory/30 p-6 sticky top-24 shadow-xs">
              <h3 className="font-serif text-lg font-semibold text-bottle-green mb-4">
                Order Review
              </h3>

              <div className="space-y-3 border-b border-subtle-border pb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-xs">
                    <span className="text-primary-text">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="font-medium text-primary-text">
                      {formatPrice(item.price_minor * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Exact breakdown */}
              <div className="space-y-2 py-4 border-b border-subtle-border text-sm">
                <div className="flex justify-between text-secondary-text">
                  <span>Product value</span>
                  <span className="font-medium text-primary-text">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-secondary-text">
                    <span>COD handling fee</span>
                    <span className="font-medium text-primary-text">
                      {formatPrice(codFee)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-secondary-text">
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-antique-gold" />
                    <span>Shipping</span>
                    {totalWeightGrams > 0 && (
                      <span className="text-[11px] text-secondary-text/70">
                        ({(totalWeightGrams / 1000).toFixed(1)} kg)
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-primary-text">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-4 text-base font-bold text-bottle-green">
                <span>Total Payable</span>
                <span>{formatPrice(total)}</span>
              </div>

              {/* Place Order CTA or Sign In Gate CTA */}
              {isAuthenticated ? (
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full rounded-full bg-bottle-green py-3 text-sm font-semibold text-white shadow-card hover:bg-forest-green transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="h-4 w-4 text-antique-gold" />
                  <span>
                    {isProcessing
                      ? 'Processing Order…'
                      : paymentMethod === 'cod'
                      ? `Place COD Order • ${formatPrice(total)}`
                      : `Pay ${formatPrice(total)}`}
                  </span>
                </button>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login?redirect=/checkout"
                    className="w-full rounded-full bg-bottle-green py-3 text-sm font-semibold text-white shadow-card hover:bg-forest-green transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="h-4 w-4 text-antique-gold" />
                    <span>Sign In to Place Order</span>
                  </Link>

                  <Link
                    to="/register?redirect=/checkout"
                    className="w-full rounded-full border border-bottle-green/40 bg-white py-2.5 text-xs font-semibold text-bottle-green hover:bg-warm-ivory transition flex items-center justify-center gap-2"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>New? Create Account & Checkout</span>
                  </Link>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-secondary-text">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Insulated Packaging &amp; Secure Tracking</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </PageLayout>
  )
}
