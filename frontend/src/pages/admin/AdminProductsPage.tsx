import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import {
  Plus,
  ArrowLeft,
  Package,
  Trash2,
  Check,
  X,
  Search,
  RefreshCw,
  Edit,
  Eye,
  Star,
  AlertTriangle,
  ImageIcon,
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import type { Product } from '@/types'

const STORE_CATEGORIES = [
  { slug: 'mehndi-powder', name: 'Mehndi Powder' },
  { slug: 'mehndi-oil', name: 'Mehndi Oil' },
  { slug: 'mehndi-cones', name: 'Mehndi Cones' },
  { slug: 'mehndi-kits', name: 'Bridal & Student Kits' },
  { slug: 'accessories', name: 'Accessories' },
]

const QUICK_IMAGE_PRESETS = [
  { label: 'Pink Bowl 1', url: '/images/products/pink-bowl-1.jpg' },
  { label: 'Pink Bowl 2', url: '/images/products/pink-bowl-2.jpg' },
  { label: 'Clip 1', url: '/images/products/clip-for-piping-bag-1.jpg' },
  { label: 'Clip 2', url: '/images/products/clip-for-piping-bag-2.jpg' },
  { label: '0.38mm Pin', url: '/images/products/0-38-mm-pin.jpg' },
  { label: 'Stocking (Set of 2)', url: '/images/products/stocking-set-of-2.jpg' },
  { label: 'Mehndi Powder', url: '/images/products/100-gm-mehndi-powder.jpg' },
  { label: 'Mehndi Oil', url: '/images/products/mehndi-oil.jpg' },
  { label: '5 Cones Pack', url: '/images/products/pack-of-5-mehndi-cones.jpg' },
  { label: 'Artist / DIY Kit', url: '/images/products/mehndi-artist-kit.jpg' },
]

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')

  // Form modal state (for both Create & Edit)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form fields
  const [formName, setFormName] = useState('')
  const [formSlug, setFormSlug] = useState('')
  const [formCategorySlug, setFormCategorySlug] = useState('mehndi-powder')
  const [formPriceRupees, setFormPriceRupees] = useState('')
  const [formComparePriceRupees, setFormComparePriceRupees] = useState('')
  const [formStock, setFormStock] = useState('100')
  const [formWeightGrams, setFormWeightGrams] = useState('50')
  const [formSku, setFormSku] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formSpecifications, setFormSpecifications] = useState('')
  const [formIsActive, setFormIsActive] = useState(true)
  const [formIsFeatured, setFormIsFeatured] = useState(false)
  const [formImageUrls, setFormImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')

  // Delete confirmation modal state
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    document.title = 'Manage Products — Mehndi By Dhirali Admin'
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const data = await apiClient.get<Product[]>('/admin/products')
      if (Array.isArray(data)) {
        setProducts(data)
      }
    } catch (err: any) {
      toast.error('Failed to load products: ' + (err?.message || 'Network error'))
    } finally {
      setIsLoading(false)
    }
  }

  // Open Create Form
  const handleOpenCreate = () => {
    setEditingProduct(null)
    setFormName('')
    setFormSlug('')
    setFormCategorySlug('mehndi-powder')
    setFormPriceRupees('')
    setFormComparePriceRupees('')
    setFormStock('100')
    setFormWeightGrams('50')
    setFormSku('')
    setFormDescription('')
    setFormSpecifications('100% Organic Henna, Triple-sifted, Essential Oils')
    setFormIsActive(true)
    setFormIsFeatured(false)
    setFormImageUrls([])
    setNewImageUrl('')
    setIsFormOpen(true)
  }

  // Open Edit Form
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod)
    setFormName(prod.name)
    setFormSlug(prod.slug)
    setFormCategorySlug(prod.category_slug || 'mehndi-powder')
    setFormPriceRupees((prod.price_minor / 100).toFixed(2))
    setFormComparePriceRupees(
      prod.compare_at_price_minor ? (prod.compare_at_price_minor / 100).toFixed(2) : ''
    )
    setFormStock(String(prod.stock_quantity))
    setFormWeightGrams(String(prod.weight_grams || 50))
    setFormSku(prod.sku)
    setFormDescription(prod.description)
    setFormSpecifications(prod.specifications || '')
    setFormIsActive(prod.is_active)
    setFormIsFeatured(prod.is_featured)
    setFormImageUrls(prod.images ? prod.images.map((img) => img.url) : [])
    setNewImageUrl('')
    setIsFormOpen(true)
  }

  // Add an image URL to the list
  const handleAddImageUrl = (urlToAdd?: string) => {
    const url = (urlToAdd || newImageUrl).trim()
    if (!url) return
    if (!formImageUrls.includes(url)) {
      setFormImageUrls([...formImageUrls, url])
    }
    setNewImageUrl('')
  }

  // Remove an image URL from the list
  const handleRemoveImageUrl = (indexToRemove: number) => {
    setFormImageUrls(formImageUrls.filter((_, idx) => idx !== indexToRemove))
  }

  // Submit Create or Update
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formName.trim() || !formPriceRupees.trim()) {
      toast.error('Please provide at least a Product Name and Price.')
      return
    }

    const priceMinor = Math.round(parseFloat(formPriceRupees) * 100)
    if (isNaN(priceMinor) || priceMinor <= 0) {
      toast.error('Please enter a valid positive price.')
      return
    }

    const compareMinor = formComparePriceRupees.trim()
      ? Math.round(parseFloat(formComparePriceRupees) * 100)
      : null

    setIsSaving(true)

    try {
      const payload = {
        name: formName.trim(),
        slug: formSlug.trim() || undefined,
        category_id: formCategorySlug,
        price_minor: priceMinor,
        compare_at_price_minor: compareMinor,
        stock_quantity: parseInt(formStock, 10) || 0,
        weight_grams: parseInt(formWeightGrams, 10) || 50,
        sku: formSku.trim() || undefined,
        description: formDescription.trim() || 'Premium organic henna product handcrafted with care.',
        specifications: formSpecifications.trim() || null,
        is_active: formIsActive,
        is_featured: formIsFeatured,
        image_urls: formImageUrls,
      }

      if (editingProduct) {
        // Update product
        const updated = await apiClient.put<Product>(`/admin/products/${editingProduct.id}`, payload)
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
        toast.success(`Updated "${updated.name}" successfully!`)
      } else {
        // Create product
        const created = await apiClient.post<Product>('/admin/products', payload)
        setProducts((prev) => [created, ...prev])
        toast.success(`Created "${created.name}" in catalog!`)
      }

      setIsFormOpen(false)
      setEditingProduct(null)
    } catch (err: any) {
      toast.error(err?.message || 'Error saving product. Please check inputs.')
    } finally {
      setIsSaving(false)
    }
  }

  // Quick toggle active status
  const handleToggleStatus = async (prod: Product, field: 'is_active' | 'is_featured') => {
    try {
      const updated = await apiClient.patch<Product>(
        `/admin/products/${prod.id}/toggle-status?field=${field}`
      )
      setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
      const label = field === 'is_active' ? 'Active status' : 'Featured status'
      toast.success(`${label} updated for ${prod.name}`)
    } catch (err: any) {
      toast.error(`Failed to update ${field}: ` + (err?.message || 'Error'))
    }
  }

  // Delete product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      const res: any = await apiClient.delete(`/admin/products/${productToDelete.id}`)
      if (res?.archived) {
        toast.info(res.message || 'Product archived due to existing orders.')
        setProducts((prev) =>
          prev.map((p) => (p.id === productToDelete.id ? { ...p, is_active: false } : p))
        )
      } else {
        toast.success(res?.message || `Deleted "${productToDelete.name}" permanently.`)
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
      }
      setProductToDelete(null)
    } catch (err: any) {
      toast.error(err?.message || 'Error deleting product.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search matching
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase())

      // Category matching
      const matchesCat =
        selectedCategory === 'all' ||
        p.category_slug === selectedCategory ||
        p.category_id === selectedCategory

      // Status matching
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.is_active) ||
        (statusFilter === 'inactive' && !p.is_active)

      return matchesSearch && matchesCat && matchesStatus
    })
  }, [products, searchQuery, selectedCategory, statusFilter])

  return (
    <PageLayout>
      {/* Admin Top Header Banner */}
      <div className="bg-forest-green text-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer"
              title="Back to Admin Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold">Product Catalog Management</h1>
                <span className="text-[10px] font-semibold bg-antique-gold/20 text-antique-gold px-2.5 py-0.5 rounded-full">
                  Admin Role
                </span>
              </div>
              <p className="text-xs text-warm-ivory/70">
                Securely create, edit, activate, price, and maintain boutique inventory
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchProducts}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-medium text-warm-ivory transition cursor-pointer"
              title="Refresh Catalog"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-full bg-antique-gold px-4 py-2 text-xs font-semibold text-forest-green hover:bg-antique-gold/90 transition shadow-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search & Filters Rail */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {/* Search box */}
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-text" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, SKU, or slug…"
              className="w-full rounded-xl border border-subtle-border bg-white py-2 pl-9 pr-4 text-xs text-primary-text focus:border-bottle-green focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-subtle-border bg-white py-2 px-3 text-xs text-primary-text focus:border-bottle-green focus:outline-none"
            >
              <option value="all">All Categories ({products.length})</option>
              {STORE_CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full rounded-xl border border-subtle-border bg-white py-2 px-3 text-xs text-primary-text focus:border-bottle-green focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Archived / Inactive</option>
            </select>
          </div>
        </div>

        {/* Products Table Card */}
        <div className="rounded-3xl border border-subtle-border bg-white shadow-xs overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-subtle-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-bottle-green">
                Catalogue Products
              </h2>
              <span className="rounded-full bg-bottle-green/10 px-2.5 py-0.5 text-xs font-semibold text-bottle-green">
                {filteredProducts.length} items
              </span>
            </div>

            <div className="text-[11px] text-secondary-text">
              Showing filtered results out of {products.length} total catalog products
            </div>
          </div>

          {isLoading ? (
            <div className="p-16 text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-bottle-green mx-auto mb-3" />
              <p className="text-sm font-medium text-primary-text">Loading catalog products…</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-16 text-center">
              <Package className="h-10 w-10 text-secondary-text/50 mx-auto mb-2" />
              <p className="font-serif text-base font-semibold text-primary-text">
                No matching products found
              </p>
              <p className="text-xs text-secondary-text mt-1 max-w-sm mx-auto">
                Try clearing your search query or category filters, or click "Add New Product" above to publish one.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-warm-ivory/50 text-secondary-text font-semibold uppercase tracking-wider border-b border-subtle-border">
                  <tr>
                    <th className="py-3 px-4">Photo</th>
                    <th className="py-3 px-4">Product & SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle-border">
                  {filteredProducts.map((p) => {
                    const primaryImg = p.images && p.images.length > 0 ? p.images[0].url : ''
                    return (
                      <tr key={p.id} className="hover:bg-warm-ivory/20 transition">
                        {/* Thumbnail */}
                        <td className="py-3 px-4">
                          <div className="h-12 w-12 rounded-xl bg-warm-ivory/40 border border-subtle-border overflow-hidden flex items-center justify-center shrink-0">
                            {primaryImg ? (
                              <img
                                src={primaryImg}
                                alt={p.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  ;(e.target as HTMLElement).style.display = 'none'
                                }}
                              />
                            ) : (
                              <ImageIcon className="h-5 w-5 text-secondary-text/40" />
                            )}
                          </div>
                        </td>

                        {/* Title & SKU */}
                        <td className="py-3 px-4">
                          <Link
                            to={`/products/${p.slug}`}
                            target="_blank"
                            className="font-medium text-primary-text hover:text-bottle-green flex items-center gap-1.5"
                          >
                            <span>{p.name}</span>
                            <Eye className="h-3 w-3 text-secondary-text" />
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-secondary-text">
                            <span className="font-mono">{p.sku}</span>
                            {p.weight_grams && <span>• {p.weight_grams}g</span>}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-secondary-text">
                          <span className="inline-block rounded-md bg-warm-ivory/80 px-2 py-0.5 text-[11px] font-medium text-bottle-green">
                            {p.category_name || p.category_slug}
                          </span>
                        </td>

                        {/* Price & MRP */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-bottle-green">
                            {formatPrice(p.price_minor)}
                          </div>
                          {p.compare_at_price_minor && (
                            <div className="text-[10px] text-secondary-text line-through">
                              {formatPrice(p.compare_at_price_minor)}
                            </div>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-3 px-4">
                          {p.stock_quantity <= 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-error/10 px-2 py-0.5 text-[10px] font-semibold text-error">
                              <AlertTriangle className="h-3 w-3" />
                              Out of Stock
                            </span>
                          ) : p.stock_quantity < 10 ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                              Low: {p.stock_quantity} left
                            </span>
                          ) : (
                            <span className="text-secondary-text">
                              {p.stock_quantity} units
                            </span>
                          )}
                        </td>

                        {/* Active Toggle */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(p, 'is_active')}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition cursor-pointer ${
                              p.is_active
                                ? 'bg-bottle-green/10 text-bottle-green hover:bg-bottle-green/20'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                            title="Click to toggle active status"
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                p.is_active ? 'bg-bottle-green' : 'bg-gray-400'
                              }`}
                            />
                            <span>{p.is_active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(p, 'is_featured')}
                            className={`p-1.5 rounded-full transition cursor-pointer ${
                              p.is_featured
                                ? 'text-amber-500 hover:bg-amber-100'
                                : 'text-gray-300 hover:text-gray-500 hover:bg-gray-100'
                            }`}
                            title="Click to toggle featured on home"
                          >
                            <Star
                              className="h-4 w-4"
                              fill={p.is_featured ? 'currentColor' : 'none'}
                            />
                          </button>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 text-bottle-green hover:bg-bottle-green/10 rounded-md transition cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 text-error hover:bg-error/10 rounded-md transition cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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

      {/* ── CREATE / EDIT MODAL ───────────────────────────────────────── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl border border-antique-gold/40 bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between pb-4 border-b border-subtle-border mb-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-bottle-green">
                  {editingProduct ? 'Edit Boutique Product' : 'Add New Boutique Product'}
                </h3>
                <p className="text-xs text-secondary-text">
                  Configure pricing, inventory, categories, and photography
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-secondary-text hover:text-primary-text rounded-full hover:bg-warm-ivory"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Product Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => {
                      setFormName(e.target.value)
                      if (!editingProduct && !formSlug) {
                        setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                      }
                    }}
                    placeholder="e.g. Organic Rajasthani Henna Cone (30g)"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs text-primary-text focus:border-bottle-green focus:outline-none"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategorySlug}
                    onChange={(e) => setFormCategorySlug(e.target.value)}
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs text-primary-text focus:border-bottle-green focus:outline-none bg-white"
                  >
                    {STORE_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="organic-rajasthani-henna-cone"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs text-primary-text focus:border-bottle-green focus:outline-none"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="MBD-CONE-01"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs text-primary-text focus:border-bottle-green focus:outline-none font-mono"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Weight (Grams)
                  </label>
                  <input
                    type="number"
                    value={formWeightGrams}
                    onChange={(e) => setFormWeightGrams(e.target.value)}
                    placeholder="50"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs text-primary-text focus:border-bottle-green focus:outline-none"
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPriceRupees}
                    onChange={(e) => setFormPriceRupees(e.target.value)}
                    placeholder="99.00"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs text-primary-text focus:border-bottle-green focus:outline-none font-semibold text-bottle-green"
                  />
                </div>

                {/* Compare at Price */}
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    MRP / Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formComparePriceRupees}
                    onChange={(e) => setFormComparePriceRupees(e.target.value)}
                    placeholder="149.00"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs text-primary-text focus:border-bottle-green focus:outline-none"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-medium text-secondary-text mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="100"
                    className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs text-primary-text focus:border-bottle-green focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Detailed description of artisanal quality, purity, origin..."
                  className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs text-primary-text focus:border-bottle-green focus:outline-none"
                />
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Specifications & Ingredients
                </label>
                <input
                  type="text"
                  value={formSpecifications}
                  onChange={(e) => setFormSpecifications(e.target.value)}
                  placeholder="100% Organic Henna, Eucalyptus Oil, Clove Bud, Lemon Juice"
                  className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-xs text-primary-text focus:border-bottle-green focus:outline-none"
                />
              </div>

              {/* Product Photography & Gallery */}
              <div className="rounded-2xl border border-subtle-border bg-warm-ivory/20 p-4">
                <label className="block text-xs font-semibold text-bottle-green mb-2 flex items-center justify-between">
                  <span>Product Photography ({formImageUrls.length} images)</span>
                  <span className="text-[11px] font-normal text-secondary-text">First image is primary thumbnail</span>
                </label>

                {/* Quick Presets */}
                <div className="mb-3">
                  <span className="text-[10px] text-secondary-text block mb-1.5">
                    Click to add store product photo presets:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_IMAGE_PRESETS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleAddImageUrl(preset.url)}
                        className="rounded-full border border-antique-gold/40 bg-white px-2 py-0.5 text-[10px] font-medium text-bottle-green hover:bg-antique-gold/10 transition cursor-pointer"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom URL input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or enter custom image URL e.g. /images/products/my-photo.jpg"
                    className="flex-1 rounded-xl border border-subtle-border px-3 py-1.5 text-xs text-primary-text focus:border-bottle-green focus:outline-none bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImageUrl()}
                    className="rounded-xl bg-bottle-green px-4 py-1.5 text-xs font-medium text-white hover:bg-forest-green transition cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>

                {/* Image Gallery previews */}
                {formImageUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {formImageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-xl border border-subtle-border overflow-hidden bg-white aspect-square flex items-center justify-center"
                      >
                        <img
                          src={url}
                          alt={`Product photo ${idx + 1}`}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-bottle-green text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImageUrl(idx)}
                          className="absolute top-1 right-1 bg-error text-white p-1 rounded-md opacity-90 hover:opacity-100 transition cursor-pointer"
                          title="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-primary-text">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-subtle-border text-bottle-green focus:ring-bottle-green"
                  />
                  <span>Active in store (Available for purchase)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-primary-text">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="h-4 w-4 rounded-sm border-subtle-border text-bottle-green focus:ring-bottle-green"
                  />
                  <span>Featured on Home Page Collection</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-subtle-border">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2 rounded-full border border-subtle-border text-xs font-medium text-secondary-text hover:bg-warm-ivory transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-bottle-green text-xs font-semibold text-white hover:bg-forest-green shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5 text-antique-gold" />
                      <span>{editingProduct ? 'Update Product' : 'Save & Publish Product'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ─────────────────────────────────── */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-subtle-border bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-error mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error/10">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-primary-text">
                  Confirm Product Deletion
                </h3>
                <span className="text-xs text-secondary-text">Irreversible action</span>
              </div>
            </div>

            <p className="text-xs text-secondary-text leading-relaxed mb-6">
              Are you sure you want to delete{' '}
              <strong className="text-primary-text font-semibold">
                "{productToDelete.name}"
              </strong>{' '}
              from the catalogue? If the product has customer orders, it will be safely deactivated
              to safeguard historical order receipts.
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-full border border-subtle-border text-xs font-medium text-secondary-text hover:bg-warm-ivory transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-error text-xs font-semibold text-white hover:bg-red-700 shadow-xs transition disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <span>Delete Product</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  )
}
