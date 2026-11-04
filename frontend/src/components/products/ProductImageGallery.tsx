import { useState, useRef, useEffect } from 'react'
import type { ProductImage } from '@/types'
import {
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  ZoomIn,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductImageGalleryProps {
  /** Array of product images */
  images: ProductImage[]
  /** Product title for alt text */
  productTitle: string
  /** Optional badge text */
  badgeText?: string
  /** Additional container classes */
  className?: string
}

export default function ProductImageGallery({
  images,
  productTitle,
  badgeText = 'Fresh Batch',
  className,
}: ProductImageGalleryProps) {
  // Sort images so primary is first, then by sort_order
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1
    if (!a.is_primary && b.is_primary) return 1
    return (a.sort_order ?? 0) - (b.sort_order ?? 0)
  })

  // Fallback if no images
  const displayImages = sortedImages.length > 0
    ? sortedImages
    : [
        {
          id: 'placeholder',
          product_id: '',
          url: '/images/products/mehndi-cones.jpg',
          alt_text: productTitle,
          sort_order: 1,
          is_primary: true,
        },
      ]

  const [activeIndex, setActiveIndex] = useState(0)
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const activeImage = displayImages[activeIndex] || displayImages[0]

  // Track mouse position over main image for Amazon-style smooth magnifier
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setZoomPos({ x, y })
  }

  const handleMouseEnter = () => {
    setIsZooming(true)
  }

  const handleMouseLeave = () => {
    setIsZooming(false)
  }

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setActiveIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    setActiveIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!isLightboxOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false)
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, displayImages.length])

  return (
    <div className={cn('flex flex-col-reverse gap-4 sm:flex-row', className)}>
      {/* ── Amazon-Style Thumbnail Strip (Vertical on sm+, horizontal below) ── */}
      {displayImages.length > 1 && (
        <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px] py-1 px-0.5 scrollbar-thin">
          {displayImages.map((img, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={cn(
                  'relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border bg-warm-ivory/50 transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'ring-2 ring-bottle-green border-bottle-green shadow-xs scale-102'
                    : 'border-subtle-border opacity-70 hover:opacity-100 hover:border-bottle-green/60'
                )}
                aria-label={`View image ${idx + 1} of ${displayImages.length}`}
              >
                <img
                  src={img.url}
                  alt={img.alt_text || `${productTitle} thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src = '/images/products/mehndi-cones.jpg'
                  }}
                />
              </button>
            )
          })}
        </div>
      )}

      {/* ── Main Showcase Viewport with Interactive Zoom ── */}
      <div className="flex-1">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setIsLightboxOpen(true)}
          className="group relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-2xl border border-subtle-border bg-warm-ivory/30 shadow-xs"
          role="button"
          tabIndex={0}
          aria-label="Click to expand image"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setIsLightboxOpen(true)
            }
          }}
        >
          {/* Main Product Image with Smooth Cursor Zoom */}
          {activeImage?.url ? (
            <img
              src={activeImage.url}
              alt={activeImage.alt_text || productTitle}
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              }}
              className={cn(
                'h-full w-full object-cover transition-transform duration-150 ease-out select-none',
                isZooming ? 'scale-180 sm:scale-210' : 'scale-100'
              )}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).src = '/images/products/mehndi-cones.jpg'
              }}
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
              <Sparkles className="h-16 w-16 text-antique-gold opacity-60 mb-3" />
              <p className="font-serif text-lg font-semibold text-bottle-green">
                {productTitle}
              </p>
            </div>
          )}

          {/* Badge (e.g. Fresh Batch) */}
          {badgeText && (
            <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-antique-gold px-3 py-1 text-xs font-semibold text-forest-green shadow-xs">
              {badgeText}
            </div>
          )}

          {/* Top-Right Expand Icon Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsLightboxOpen(true)
            }}
            className="absolute right-3.5 top-3.5 rounded-full bg-white/80 p-2 text-bottle-green backdrop-blur-xs transition hover:bg-white hover:scale-105 shadow-xs cursor-pointer"
            aria-label="Open expanded image view"
            title="Click to expand"
          >
            <Maximize2 className="h-4 w-4" />
          </button>

          {/* Image Navigation Arrows (if multiple images) */}
          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-bottle-green shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105 cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-2 text-bottle-green shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:scale-105 cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Bottom Amazon-style Hover Zoom Hint Bar */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent p-3 text-center text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex items-center justify-center gap-1.5 font-medium">
            <ZoomIn className="h-3.5 w-3.5 text-antique-gold" />
            <span>Roll over image to zoom in • Click to expand</span>
            {displayImages.length > 1 && (
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[11px]">
                {activeIndex + 1} / {displayImages.length}
              </span>
            )}
          </div>
        </div>

        {/* Mobile image count pill */}
        {displayImages.length > 1 && (
          <div className="mt-2.5 flex sm:hidden items-center justify-center gap-1.5">
            {displayImages.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === activeIndex ? 'w-5 bg-bottle-green' : 'w-1.5 bg-subtle-border'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Amazon-Style Fullscreen Lightbox Modal ── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Modal Header Bar */}
          <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg font-semibold drop-shadow-sm">
                {productTitle}
              </span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs">
                {activeIndex + 1} of {displayImages.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="rounded-full bg-white/10 p-2.5 text-white hover:bg-white/25 transition cursor-pointer"
              aria-label="Close enlarged view"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Modal Image Box */}
          <div
            className="relative max-h-[80vh] max-w-4xl w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeImage.url}
              alt={activeImage.alt_text || productTitle}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />

            {/* Prev / Next Buttons */}
            {displayImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-xs hover:bg-white/40 transition cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-xs hover:bg-white/40 transition cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Thumbnails in Lightbox */}
          {displayImages.length > 1 && (
            <div
              className="absolute bottom-5 inset-x-4 flex items-center justify-center gap-2.5 z-10 overflow-x-auto py-2"
              onClick={(e) => e.stopPropagation()}
            >
              {displayImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    'h-14 w-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer',
                    idx === activeIndex
                      ? 'border-antique-gold ring-2 ring-white/50 scale-105'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  )}
                >
                  <img
                    src={img.url}
                    alt={img.alt_text || `Image ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
