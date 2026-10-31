import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import PriceDisplay from '@/components/products/PriceDisplay'
import { useCartStore } from '@/lib/cart-store'
import { toast } from 'sonner'
import { INITIAL_PRODUCTS } from '@/data/initial-products'
import { apiClient } from '@/lib/api-client'
import type { Product } from '@/types'
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  Sparkles,
  Minus,
  Plus,
  Check,
} from 'lucide-react'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(() => {
    return INITIAL_PRODUCTS.find((p) => p.slug === slug) || null
  })
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  useEffect(() => {
    // Attempt to fetch fresh product from API, keep initial product as fallback
    async function fetchProduct() {
      if (!slug) return
      try {
        const data = await apiClient.get<Product>(`/products/${slug}`)
        if (data) {
          setProduct(data)
          return
        }
      } catch {
        // Fall back to matched initial product
      }
      const matched = INITIAL_PRODUCTS.find((p) => p.slug === slug)
      if (matched) {
        setProduct(matched)
      }
    }
    fetchProduct()
  }, [slug])

  const productTitle = product
    ? product.name
    : slug
    ? slug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : 'Premium Rajasthani Mehndi Cone'

  useEffect(() => {
    document.title = `${productTitle} — Mehndi By Dhirali`
  }, [productTitle])

  const primaryImage = product?.images?.find((img) => img.is_primary) ?? product?.images?.[0]
  const priceMinor = product?.price_minor ?? 9900
  const compareAtPriceMinor = product?.compare_at_price_minor ?? 14900
  const stockQuantity = product?.stock_quantity ?? 100

  const handleAddToCart = () => {
    addItem({
      product_id: product?.id || slug || 'preview-product',
      product_name: productTitle,
      product_slug: product?.slug || slug || 'preview-product',
      product_image: primaryImage?.url || '/images/products/mehndi-cones.png',
      price_minor: priceMinor,
      compare_at_price_minor: compareAtPriceMinor,
      quantity,
      stock_quantity: stockQuantity,
      sku: product?.sku || 'MBD-CONE-01',
      weight_grams: product?.weight_grams,
    })
    toast.success(`Added ${quantity} × ${productTitle} to your cart!`)
    openCart()
  }

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: productTitle },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left: Product Image Gallery */}
          <div>
            <div className="aspect-square w-full rounded-2xl border border-subtle-border bg-warm-ivory/40 flex items-center justify-center overflow-hidden relative shadow-xs">
              {primaryImage?.url ? (
                <img
                  src={primaryImage.url}
                  alt={primaryImage.alt_text || productTitle}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = '/images/products/mehndi-cones.png'
                  }}
                />
              ) : (
                <div className="text-center p-8">
                  <Sparkles className="h-16 w-16 text-antique-gold mx-auto mb-3 opacity-60" />
                  <p className="font-serif text-lg font-semibold text-bottle-green">
                    {productTitle}
                  </p>
                </div>
              )}
              <div className="absolute top-4 left-4 rounded-full bg-antique-gold px-3 py-1 text-xs font-semibold text-forest-green shadow-xs">
                Fresh Batch
              </div>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col justify-start">
            <span className="text-xs font-semibold uppercase tracking-wider text-antique-gold">
              {product?.category_name || 'Mehndi Cones'}
            </span>
            <h1 className="font-serif text-3xl font-bold text-bottle-green mt-2 sm:text-4xl">
              {productTitle}
            </h1>

            {/* Price Showcase: OG strikethrough price first, discounted bold price second */}
            <div className="mt-4">
              <PriceDisplay priceMinor={priceMinor} compareAtPriceMinor={compareAtPriceMinor} size="lg" />
              <p className="text-xs text-secondary-text mt-1">Inclusive of all taxes.</p>
            </div>

            {/* Description */}
            {product?.description && (
              <p className="mt-4 text-sm leading-relaxed text-secondary-text">
                {product.description}
              </p>
            )}

            {/* Highlights */}
            <div className="my-6 border-y border-subtle-border py-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-primary-text">
                <Check className="h-4 w-4 text-success" />
                <span>100% Organic Rajasthani Sojat Henna</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary-text">
                <Check className="h-4 w-4 text-success" />
                <span>Zero chemicals, PPD, or synthetic dyes</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary-text">
                <Check className="h-4 w-4 text-success" />
                <span>Ultra-smooth 0.38mm tip for intricate bridal work</span>
              </div>
              {product?.specifications && (
                <div className="flex items-center gap-2 text-xs text-primary-text font-medium text-bottle-green pt-1">
                  <span>✦ {product.specifications}</span>
                </div>
              )}
            </div>

            {/* Quantity Selector and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-subtle-border rounded-full overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 hover:bg-warm-ivory text-primary-text transition cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold text-primary-text">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 hover:bg-warm-ivory text-primary-text transition cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-bottle-green px-8 py-3 text-sm font-semibold text-white shadow-card hover:bg-forest-green transition cursor-pointer"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsWishlisted(!isWishlisted)
                    toast.success(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist!')
                  }}
                  className={`p-3 rounded-full border transition cursor-pointer ${
                    isWishlisted
                      ? 'border-error text-error bg-error/10'
                      : 'border-subtle-border text-secondary-text hover:text-bottle-green'
                  }`}
                  aria-label="Toggle wishlist"
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Trust and Delivery Details */}
            <div className="mt-8 rounded-2xl bg-warm-ivory/30 p-4 border border-subtle-border space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-bottle-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-primary-text">Express Dispatch</h4>
                  <p className="text-xs text-secondary-text">
                    Orders dispatched with insulated protective packaging within 24-48 hours.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-bottle-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-primary-text">Storage & Shelf Life</h4>
                  <p className="text-xs text-secondary-text">
                    Freeze immediately upon arrival. Stays fresh for up to 6 months in freezer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
