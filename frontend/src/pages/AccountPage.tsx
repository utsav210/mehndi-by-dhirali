import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { useAuthStore } from '@/lib/auth-store'
import { Package, MapPin, Heart, LogOut, Shield } from 'lucide-react'

export default function AccountPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    document.title = 'My Account — Mehndi By Dhirali'
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const currentUser = user || {
    first_name: 'Valued',
    last_name: 'Customer',
    email: 'customer@mehndibydhirali.com',
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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-subtle-border gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-antique-gold">
              Account Overview
            </span>
            <h1 className="font-serif text-3xl font-bold text-bottle-green mt-1">
              Namaste, {currentUser.first_name}!
            </h1>
            <p className="text-xs text-secondary-text mt-1">{currentUser.email}</p>
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
              className="inline-flex items-center gap-1.5 rounded-full border border-subtle-border px-4 py-2 text-xs font-semibold text-secondary-text hover:text-error hover:border-error transition cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Tiles */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/account/orders"
            className="group rounded-2xl border border-subtle-border p-6 bg-white shadow-xs hover:shadow-card transition flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bottle-green/10 text-bottle-green mb-4 group-hover:scale-105 transition-transform">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-bottle-green">
                Order History
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                View your active shipments, delivery tracking, and past invoices.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-antique-gold group-hover:underline">
              View all orders →
            </span>
          </Link>

          <Link
            to="/wishlist"
            className="group rounded-2xl border border-subtle-border p-6 bg-white shadow-xs hover:shadow-card transition flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bottle-green/10 text-bottle-green mb-4 group-hover:scale-105 transition-transform">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-bottle-green">
                My Wishlist
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Saved cones, oils, and henna practice templates for later.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-antique-gold group-hover:underline">
              Explore wishlist →
            </span>
          </Link>

          <div className="rounded-2xl border border-subtle-border p-6 bg-white shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bottle-green/10 text-bottle-green mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-bottle-green">
                Saved Addresses
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Manage default delivery addresses for quick checkout.
              </p>
            </div>
            <span className="mt-4 text-xs text-secondary-text">
              Updated automatically during checkout
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
