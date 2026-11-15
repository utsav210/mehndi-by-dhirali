import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { useAuthStore } from '@/lib/auth-store'
import { apiClient, ApiClientError } from '@/lib/api-client'
import type { Address } from '@/types'
import {
  Package,
  MapPin,
  Truck,
  LogOut,
  Shield,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Home,
  Briefcase,
} from 'lucide-react'
import { toast } from 'sonner'

export default function AccountPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)
  const logout = useAuthStore((s) => s.logout)

  const [addresses, setAddresses] = useState<Address[]>([])
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(true)

  // Modal state for Add/Edit address
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form inputs
  const [label, setLabel] = useState('Home')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [city, setCity] = useState('')
  const [stateName, setStateName] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  useEffect(() => {
    document.title = 'My Account — Mehndi By Dhirali'
    if (!isLoading && !isAuthenticated && !user) {
      navigate('/login')
    } else if (user) {
      fetchAddresses()
    }
  }, [user, isAuthenticated, isLoading, navigate])

  const fetchAddresses = async () => {
    setLoadingAddresses(true)
    try {
      const data = await apiClient.get<Address[]>('/addresses')
      setAddresses(data)
    } catch {
      // Fallback
    } finally {
      setLoadingAddresses(false)
    }
  }

  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await logout()
      toast.success('Signed out successfully.')
    } catch (err) {
      console.warn('Sign out notice:', err)
      toast.success('Signed out successfully.')
    } finally {
      setIsLoggingOut(false)
      navigate('/', { replace: true })
    }
  }

  const openAddModal = () => {
    setEditingAddress(null)
    setLabel('Home')
    setFullName(`${user?.first_name || ''} ${user?.last_name || ''}`.trim())
    setPhone(user?.phone || '')
    setAddressLine1('')
    setAddressLine2('')
    setCity('')
    setStateName('')
    setPostalCode('')
    setIsDefault(addresses.length === 0)
    setIsModalOpen(true)
  }

  const openEditModal = (addr: Address) => {
    setEditingAddress(addr)
    setLabel(addr.label || 'Home')
    setFullName(addr.full_name)
    setPhone(addr.phone)
    setAddressLine1(addr.address_line_1)
    setAddressLine2(addr.address_line_2 || '')
    setCity(addr.city)
    setStateName(addr.state)
    setPostalCode(addr.postal_code)
    setIsDefault(addr.is_default)
    setIsModalOpen(true)
  }

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !phone || !addressLine1 || !city || !stateName || !postalCode) {
      toast.error('Please fill in all required address fields.')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        label,
        full_name: fullName,
        phone,
        address_line_1: addressLine1,
        address_line_2: addressLine2 || undefined,
        city,
        state: stateName,
        postal_code: postalCode,
        country: 'India',
        is_default: isDefault,
      }

      if (editingAddress) {
        await apiClient.put(`/addresses/${editingAddress.id}`, payload)
        toast.success('Address updated successfully!')
      } else {
        await apiClient.post('/addresses', payload)
        toast.success('New address added to your profile!')
      }

      setIsModalOpen(false)
      fetchAddresses()
    } catch (err) {
      if (err instanceof ApiClientError) {
        toast.error(err.message)
      } else {
        toast.error('Failed to save address. Please try again.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to remove this saved address?')) return

    try {
      await apiClient.delete(`/addresses/${id}`)
      toast.success('Address removed from your profile.')
      fetchAddresses()
    } catch (err) {
      if (err instanceof ApiClientError) {
        toast.error(err.message)
      } else {
        toast.error('Failed to delete address.')
      }
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await apiClient.post(`/addresses/${id}/default`)
      toast.success('Default address updated.')
      fetchAddresses()
    } catch (err) {
      if (err instanceof ApiClientError) {
        toast.error(err.message)
      } else {
        toast.error('Failed to set default address.')
      }
    }
  }

  const currentUser = user || {
    first_name: 'Customer',
    last_name: '',
    email: '',
    role: 'customer',
  }

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'My Account' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-subtle-border gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-antique-gold">
              Account Overview
            </span>
            <h1 className="font-serif text-3xl font-bold text-bottle-green mt-1">
              Namaste, {currentUser.first_name || 'Henna Lover'}!
            </h1>
            {currentUser.email && (
              <p className="text-xs text-secondary-text mt-1">{currentUser.email}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentUser.role === 'admin' && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-full bg-forest-green text-antique-gold px-4 py-2 text-xs font-semibold shadow-xs hover:bg-bottle-green transition"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Admin Portal</span>
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-subtle-border px-4 py-2 text-xs font-semibold text-secondary-text hover:text-red-700 hover:border-red-300 transition cursor-pointer disabled:opacity-50"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>{isLoggingOut ? 'Signing Out…' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Account Tiles */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/account/orders"
            className="group rounded-2xl border border-subtle-border p-6 bg-white shadow-xs hover:shadow-card hover:border-bottle-green/30 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bottle-green/10 text-bottle-green mb-4 group-hover:scale-105 transition-transform">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-bottle-green">
                Order History
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                View your purchases, historical receipts, and invoice summaries.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-antique-gold group-hover:underline">
              View all orders →
            </span>
          </Link>

          <Link
            to="/track"
            className="group rounded-2xl border border-subtle-border p-6 bg-white shadow-xs hover:shadow-card hover:border-bottle-green/30 transition flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bottle-green/10 text-bottle-green mb-4 group-hover:scale-105 transition-transform">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-bottle-green">
                Live Shipment Tracking
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Real-time tracking with AWB number and courier partner delivery status.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-antique-gold group-hover:underline">
              Track active shipment →
            </span>
          </Link>

          <div className="group rounded-2xl border border-subtle-border p-6 bg-white shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bottle-green/10 text-bottle-green mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-bottle-green">
                Saved Delivery Addresses
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                {addresses.length === 0
                  ? 'No saved delivery addresses yet. Add one below for faster checkout.'
                  : `${addresses.length} saved address${addresses.length === 1 ? '' : 'es'} ready for 1-click checkout.`}
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-antique-gold hover:underline cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add new address
            </button>
          </div>
        </div>

        {/* ── Saved Delivery Addresses Section ── */}
        <div className="mt-12 rounded-3xl border border-subtle-border bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-subtle-border gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-antique-gold">
                Manage Addresses
              </span>
              <h2 className="font-serif text-2xl font-bold text-bottle-green mt-0.5">
                Saved Delivery Addresses
              </h2>
              <p className="text-xs text-secondary-text mt-1">
                Addresses saved here are automatically available for one-click selection during checkout.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-bottle-green px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-forest-green transition cursor-pointer self-start sm:self-auto"
            >
              <Plus className="h-4 w-4 text-antique-gold" />
              <span>Add New Address</span>
            </button>
          </div>

          {loadingAddresses ? (
            <div className="py-12 text-center text-xs text-secondary-text">
              Loading your saved addresses...
            </div>
          ) : addresses.length === 0 ? (
            <div className="py-12 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-warm-ivory text-secondary-text mb-3">
                <MapPin className="h-6 w-6 text-bottle-green" />
              </div>
              <h3 className="font-serif text-base font-semibold text-bottle-green">
                No saved addresses yet
              </h3>
              <p className="text-xs text-secondary-text mt-1 max-w-sm mx-auto">
                Add your home, bridal studio, or workshop delivery addresses to speed up future orders.
              </p>
              <button
                type="button"
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-bottle-green/30 px-4 py-2 text-xs font-semibold text-bottle-green hover:bg-warm-ivory transition cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition ${
                    addr.is_default
                      ? 'border-bottle-green bg-warm-ivory/20 shadow-xs ring-1 ring-bottle-green/30'
                      : 'border-subtle-border bg-white hover:border-bottle-green/30'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-bottle-green/10 px-2 py-0.5 text-xs font-semibold text-bottle-green">
                        {addr.label === 'Work' || addr.label === 'Studio' ? (
                          <Briefcase className="h-3 w-3 text-antique-gold" />
                        ) : (
                          <Home className="h-3 w-3 text-antique-gold" />
                        )}
                        {addr.label || 'Home'}
                      </span>

                      {addr.is_default && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-semibold border border-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Default
                        </span>
                      )}
                    </div>

                    <h4 className="font-semibold text-charcoal text-sm">{addr.full_name}</h4>
                    <p className="text-xs text-secondary-text mt-1">{addr.address_line_1}</p>
                    {addr.address_line_2 && (
                      <p className="text-xs text-secondary-text">{addr.address_line_2}</p>
                    )}
                    <p className="text-xs font-medium text-charcoal mt-1">
                      {addr.city}, {addr.state} - {addr.postal_code}
                    </p>
                    <p className="text-xs text-secondary-text mt-2 font-mono">
                      Ph: {addr.phone}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-subtle-border flex items-center justify-between gap-2">
                    {!addr.is_default && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr.id)}
                        className="text-[11px] font-semibold text-bottle-green hover:underline cursor-pointer"
                      >
                        Set as Default
                      </button>
                    )}

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        type="button"
                        onClick={() => openEditModal(addr)}
                        className="p-1.5 rounded-lg text-secondary-text hover:text-bottle-green hover:bg-warm-ivory transition cursor-pointer"
                        title="Edit Address"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 rounded-lg text-secondary-text hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                        title="Delete Address"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add / Edit Address Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-subtle-border bg-white p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-secondary-text hover:text-charcoal hover:bg-warm-ivory transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-5 w-5 text-antique-gold" />
              <h3 className="font-serif text-lg font-bold text-bottle-green">
                {editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
            </div>
            <p className="text-xs text-secondary-text mb-4">
              Saved addresses can be used instantly during checkout.
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              {/* Address Label */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                  Address Label (e.g. Home, Studio, Workshop)
                </label>
                <div className="flex items-center gap-2">
                  {['Home', 'Studio', 'Work', 'Other'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setLabel(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                        label === preset
                          ? 'border-bottle-green bg-bottle-green text-white'
                          : 'border-subtle-border bg-warm-ivory/40 text-secondary-text hover:bg-warm-ivory'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Recipient name"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Street Address / Flat / Building *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="e.g. 38, Ambalalpark Society, near Uma Hospital"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    Area / Landmark <span className="font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="e.g. Nava Naroda"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ahmedabad"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Gujarat"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal mb-1">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="382330"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs sm:text-sm text-charcoal focus:border-bottle-green focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-bottle-green">
                    <input
                      type="checkbox"
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                      className="h-4 w-4 rounded text-bottle-green focus:ring-bottle-green cursor-pointer"
                    />
                    <span>Set as default address</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-subtle-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-subtle-border bg-warm-ivory/50 px-4 py-2 text-xs font-medium text-secondary-text hover:bg-warm-ivory transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-bottle-green px-5 py-2 text-xs font-medium text-warm-ivory hover:bg-forest-green hover:text-white transition disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
