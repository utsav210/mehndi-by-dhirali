import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { Plus, ArrowLeft, Package, Trash2, Check, X } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'
import type { Product } from '@/types'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isAdding, setIsAdding] = useState(false)

  // Form fields for new product
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [categorySlug, setCategorySlug] = useState('mehndi-cones')
  const [priceRupees, setPriceRupees] = useState('')
  const [comparePriceRupees, setComparePriceRupees] = useState('')
  const [stock, setStock] = useState('100')
  const [description, setDescription] = useState('')

  useEffect(() => {
    document.title = 'Manage Products — Mehndi By Dhirali Admin'
  }, [])

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !priceRupees) {
      toast.error('Please enter product name and price.')
      return
    }

    const priceMinor = Math.round(parseFloat(priceRupees) * 100)
    const compareMinor = comparePriceRupees ? Math.round(parseFloat(comparePriceRupees) * 100) : null

    const newProd: Product = {
      id: 'prod_' + Date.now(),
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description || 'Premium artisanal henna product.',
      specifications: '100% Organic Henna, Essential Oils',
      category_id: 'cat_' + categorySlug,
      category_name: categorySlug.replace(/-/g, ' ').toUpperCase(),
      category_slug: categorySlug,
      price_minor: priceMinor,
      compare_at_price_minor: compareMinor,
      stock_quantity: parseInt(stock, 10) || 50,
      is_active: true,
      is_featured: true,
      sku: 'MBD-' + Date.now().toString().slice(-4),
      weight_grams: 30,
      images: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setProducts([newProd, ...products])
    setIsAdding(false)
    toast.success(`Product "${name}" saved to catalog!`)

    // Reset form
    setName('')
    setSlug('')
    setPriceRupees('')
    setComparePriceRupees('')
    setDescription('')
  }

  return (
    <PageLayout>
      <div className="bg-forest-green text-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold">Product Catalog Management</h1>
              <p className="text-xs text-warm-ivory/70">Create and publish products for Mehndi By Dhirali</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 rounded-full bg-antique-gold px-4 py-2 text-xs font-semibold text-forest-green hover:bg-antique-gold/90 transition shadow-xs cursor-pointer"
          >
            {isAdding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            <span>{isAdding ? 'Close Form' : 'New Product'}</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Creation Form Modal/Card */}
        {isAdding && (
          <form
            onSubmit={handleCreateProduct}
            className="mb-10 rounded-3xl border border-antique-gold/40 bg-warm-ivory/20 p-6 sm:p-8 shadow-card animate-slide-up"
          >
            <h2 className="font-serif text-xl font-bold text-bottle-green mb-6">
              Create New Mehndi Product
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                  }}
                  placeholder="e.g. Organic Bridal Henna Cone (30g)"
                  className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="organic-bridal-henna-cone"
                  className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Category *
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none bg-white"
                >
                  <option value="mehndi-cones">Mehndi Cones</option>
                  <option value="mehndi-powder">Mehndi Powder</option>
                  <option value="aftercare-oils">Aftercare Oils</option>
                  <option value="practice-tools">Practice Tools</option>
                  <option value="mehndi-kits">Bridal & Student Kits</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={priceRupees}
                  onChange={(e) => setPriceRupees(e.target.value)}
                  placeholder="120.00"
                  className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Original Price / MRP (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={comparePriceRupees}
                  onChange={(e) => setComparePriceRupees(e.target.value)}
                  placeholder="150.00"
                  className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Initial Stock Quantity
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-secondary-text mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed botanical ingredients, tip thickness, stain intensity, aftercare..."
                  className="w-full rounded-xl border border-subtle-border px-3.5 py-2 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-5 py-2 rounded-full border border-subtle-border text-xs font-medium text-secondary-text hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-bottle-green text-xs font-semibold text-white hover:bg-forest-green shadow-xs cursor-pointer"
              >
                <Check className="h-3.5 w-3.5 text-antique-gold" />
                <span>Save Product</span>
              </button>
            </div>
          </form>
        )}

        {/* Existing Products Table */}
        <div className="rounded-3xl border border-subtle-border bg-white shadow-xs overflow-hidden">
          <div className="p-6 border-b border-subtle-border flex justify-between items-center">
            <h3 className="font-serif text-lg font-semibold text-bottle-green">
              Published Products ({products.length})
            </h3>
          </div>

          {products.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="h-10 w-10 text-secondary-text/50 mx-auto mb-2" />
              <p className="font-serif text-base font-semibold text-primary-text">
                No products published yet
              </p>
              <p className="text-xs text-secondary-text mt-1 max-w-sm mx-auto">
                Ready to add products! Click "New Product" above whenever you are ready to publish items to your store.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-warm-ivory/50 text-secondary-text font-semibold uppercase tracking-wider border-b border-subtle-border">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-subtle-border">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-warm-ivory/20 transition">
                      <td className="py-3 px-4 font-medium text-primary-text">{p.name}</td>
                      <td className="py-3 px-4 text-secondary-text">{p.category_name}</td>
                      <td className="py-3 px-4 font-semibold text-bottle-green">
                        {formatPrice(p.price_minor)}
                      </td>
                      <td className="py-3 px-4 text-primary-text">{p.stock_quantity} in stock</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setProducts(products.filter((item) => item.id !== p.id))
                            toast.info(`Removed ${p.name}`)
                          }}
                          className="p-1.5 text-error hover:bg-error/10 rounded-md transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}
