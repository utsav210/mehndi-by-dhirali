import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import {
  Package,
  ShoppingCart,
  DollarSign,
  Plus,
  ArrowRight,
  Shield,
  Layers,
  RefreshCw,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'

interface DashboardStats {
  total_revenue_minor: number
  total_orders: number
  paid_orders: number
  total_products: number
  total_categories: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_revenue_minor: 0,
    total_orders: 0,
    paid_orders: 0,
    total_products: 14,
    total_categories: 5,
  })
  const [isLoading, setIsLoading] = useState(false)

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.get<DashboardStats>('/admin/dashboard')
      if (data) {
        setStats(data)
      }
    } catch {
      // Keep existing default counts
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Admin Portal — Mehndi By Dhirali'
    fetchStats()
  }, [])

  return (
    <PageLayout>
      <div className="bg-forest-green text-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-antique-gold/20 text-antique-gold">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-warm-ivory">
                Admin Management Console
              </h1>
              <p className="text-xs text-warm-ivory/70">
                Mehndi By Dhirali • Inventory & Order Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchStats}
              disabled={isLoading}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-warm-ivory cursor-pointer"
              title="Refresh Stats"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-1.5 rounded-full bg-antique-gold px-4 py-2 text-xs font-semibold text-forest-green hover:bg-antique-gold/90 transition shadow-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Product</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="rounded-2xl border border-subtle-border p-5 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-secondary-text">Total Revenue</span>
              <DollarSign className="h-4 w-4 text-antique-gold" />
            </div>
            <p className="font-serif text-2xl font-bold text-bottle-green mt-2">
              {formatPrice(stats.total_revenue_minor || 0)}
            </p>
            <span className="text-[10px] text-secondary-text mt-1 block">
              {stats.paid_orders} paid transactions
            </span>
          </div>

          <div className="rounded-2xl border border-subtle-border p-5 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-secondary-text">Total Orders</span>
              <ShoppingCart className="h-4 w-4 text-bottle-green" />
            </div>
            <p className="font-serif text-2xl font-bold text-bottle-green mt-2">{stats.total_orders}</p>
            <span className="text-[10px] text-secondary-text mt-1 block">
              {stats.total_orders - stats.paid_orders} pending fulfillment
            </span>
          </div>

          <div className="rounded-2xl border border-subtle-border p-5 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-secondary-text">Total Products</span>
              <Package className="h-4 w-4 text-henna-brown" />
            </div>
            <p className="font-serif text-2xl font-bold text-bottle-green mt-2">{stats.total_products}</p>
            <span className="text-[10px] text-secondary-text mt-1 block">
              Active across boutique collections
            </span>
          </div>

          <div className="rounded-2xl border border-subtle-border p-5 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-secondary-text">Categories</span>
              <Layers className="h-4 w-4 text-antique-gold" />
            </div>
            <p className="font-serif text-2xl font-bold text-bottle-green mt-2">{stats.total_categories}</p>
            <span className="text-[10px] text-secondary-text mt-1 block">
              Configured store collections
            </span>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/products"
            className="group rounded-2xl border border-subtle-border p-6 bg-white shadow-xs hover:shadow-card transition flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bottle-green/10 text-bottle-green mb-4">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-bottle-green">
                Product Catalog & Stock
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Add new products, upload product photography, configure prices, and manage stock quantities.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-antique-gold group-hover:underline inline-flex items-center gap-1">
              <span>Manage Products</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>

          <Link
            to="/admin/orders"
            className="group rounded-2xl border border-subtle-border p-6 bg-white shadow-xs hover:shadow-card transition flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bottle-green/10 text-bottle-green mb-4">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-bottle-green">
                Customer Orders & Shipments
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Monitor incoming orders, inspect Razorpay transaction IDs, and update dispatch tracking.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-antique-gold group-hover:underline inline-flex items-center gap-1">
              <span>Manage Orders</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>

          <Link
            to="/admin/categories"
            className="group rounded-2xl border border-subtle-border p-6 bg-white shadow-xs hover:shadow-card transition flex flex-col justify-between"
          >
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bottle-green/10 text-bottle-green mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-bottle-green">
                Categories & Collections
              </h3>
              <p className="text-xs text-secondary-text mt-1">
                Organize store navigation, featured collections, and promotional banners.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold text-antique-gold group-hover:underline inline-flex items-center gap-1">
              <span>Manage Categories</span>
              <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        </div>
      </div>
    </PageLayout>
  )
}
