import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CarouselSlide {
  id: string
  type: 'image' | 'content'
  imageSrc?: string
  altText?: string
  linkUrl: string
  tagline?: string
  title?: string
  description?: string
  primaryCtaText?: string
  primaryCtaLink?: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
}

const SLIDES: CarouselSlide[] = [
  {
    id: 'slide-natural-benefits',
    type: 'image',
    imageSrc: '/images/hero-banner-natural.png',
    altText:
      '100% Natural Henna, Handcrafted with Care, Express All-India Delivery, Safe & Skin Friendly — Mehndi By Dhirali',
    linkUrl: '/products',
  },
  {
    id: 'slide-celebrate-tradition',
    type: 'content',
    tagline: 'Premium Mehndi Collection',
    title: 'Celebrate Tradition with Natural Mehndi',
    description:
      'Discover handcrafted, 100% natural mehndi cones, powders, and oils — made with care for beautiful, long-lasting designs.',
    primaryCtaText: 'Shop Now',
    primaryCtaLink: '/products',
    secondaryCtaText: 'Explore Collections',
    secondaryCtaLink: '/products',
    linkUrl: '/products',
  },
  {
    id: 'slide-bridal-kits',
    type: 'content',
    tagline: 'Artisanal Rajasthani Sojat Henna',
    title: 'Fresh Cones & Bridal Master Kits',
    description:
      'Triple-cloth sifted micro-fine organic henna powder, pure eucalyptus oils & complete artist kits with FREE doorstep shipping.',
    primaryCtaText: 'Explore Kits',
    primaryCtaLink: '/products?search=kit',
    secondaryCtaText: 'View Cones',
    secondaryCtaLink: '/products?search=cone',
    linkUrl: '/products',
  },
]

const AUTO_PLAY_INTERVAL_MS = 5500

export default function HeroBanner({ className }: { className?: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length)
  }, [])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  // Auto-play interval
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(goToNext, AUTO_PLAY_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [isPaused, goToNext])

  // Touch Swipe Handlers for mobile gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    if (diff > 45) {
      goToNext()
    } else if (diff < -45) {
      goToPrev()
    }
  }

  return (
    <section
      className={cn(
        'relative isolate overflow-hidden bg-bottle-green select-none',
        className
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured Promotions and Collections"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel Track */}
      <div
        className="flex w-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {SLIDES.map((slide, index) => {
          const isActive = currentIndex === index

          if (slide.type === 'image') {
            return (
              <div
                key={slide.id}
                className="w-full shrink-0 flex items-center justify-center bg-bottle-green"
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${index + 1} of ${SLIDES.length}`}
                aria-hidden={!isActive}
              >
                <Link
                  to={slide.linkUrl}
                  className="group relative block w-full h-[240px] sm:h-[340px] md:h-[420px] lg:h-[480px] xl:h-[520px] overflow-hidden cursor-pointer"
                  tabIndex={isActive ? 0 : -1}
                  aria-label={slide.altText}
                >
                  <img
                    src={slide.imageSrc}
                    alt={slide.altText}
                    className="h-full w-full object-cover sm:object-contain object-center transition-transform duration-700 group-hover:scale-[1.01]"
                    loading={index === 0 ? 'eager' : 'lazy'}
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/5 pointer-events-none" />
                </Link>
              </div>
            )
          }

          return (
            <div
              key={slide.id}
              className="relative isolate w-full shrink-0 flex items-center min-h-[360px] sm:min-h-[440px] md:min-h-[500px] overflow-hidden bg-bottle-green px-4 py-16 sm:px-6 md:py-24 lg:px-8"
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${SLIDES.length}`}
              aria-hidden={!isActive}
            >
              {/* Gradient background with subtle pattern */}
              <div
                className="absolute inset-0 -z-10 bg-gradient-to-br from-forest-green via-bottle-green to-forest-green"
                aria-hidden="true"
              />

              {/* Decorative mandala-inspired pattern */}
              <div className="absolute inset-0 -z-10 opacity-[0.06]" aria-hidden="true">
                <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3">
                  <div className="h-[600px] w-[600px] rounded-full border-[40px] border-white/30" />
                  <div className="absolute inset-12 rounded-full border-[30px] border-white/20" />
                  <div className="absolute inset-24 rounded-full border-[20px] border-white/10" />
                </div>
                <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full border-[20px] border-white/20" />
              </div>

              {/* Slide Content */}
              <div className="mx-auto flex max-w-7xl w-full items-center">
                <div className="max-w-2xl pl-2 sm:pl-6 md:pl-10">
                  <p className="mb-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-antique-gold">
                    {slide.tagline}
                  </p>
                  <h2 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                    {slide.title}
                  </h2>
                  <p className="mt-5 max-w-lg text-sm sm:text-base leading-relaxed text-warm-ivory/90 sm:text-lg">
                    {slide.description}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    {slide.primaryCtaText && slide.primaryCtaLink && (
                      <Link
                        to={slide.primaryCtaLink}
                        className="inline-flex items-center gap-2 rounded-full bg-antique-gold px-7 py-3 text-sm font-semibold text-forest-green transition-all hover:bg-antique-gold/90 hover:scale-105 shadow-md"
                        tabIndex={isActive ? 0 : -1}
                      >
                        {slide.primaryCtaText}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                    {slide.secondaryCtaText && slide.secondaryCtaLink && (
                      <Link
                        to={slide.secondaryCtaLink}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-antique-gold/60 px-7 py-3 text-sm font-semibold text-antique-gold transition-all hover:border-antique-gold hover:bg-antique-gold/15 hover:scale-105"
                        tabIndex={isActive ? 0 : -1}
                      >
                        {slide.secondaryCtaText}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={goToPrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/40 hover:bg-black/65 text-white backdrop-blur-xs border border-white/20 transition-all hover:scale-110 shadow-lg cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-antique-gold"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      <button
        type="button"
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/40 hover:bg-black/65 text-white backdrop-blur-xs border border-white/20 transition-all hover:scale-110 shadow-lg cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-antique-gold"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>

      {/* Slide Indicators / Pagination Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={cn(
              'transition-all duration-300 rounded-full cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-antique-gold',
              currentIndex === index
                ? 'w-7 sm:w-8 h-2.5 bg-antique-gold shadow-md'
                : 'w-2.5 h-2.5 bg-white/60 hover:bg-white/90'
            )}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentIndex === index ? 'true' : undefined}
          />
        ))}
      </div>

      {/* Bottom Ornamental Gold Border */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-antique-gold to-transparent z-10 pointer-events-none"
        aria-hidden="true"
      />
    </section>
  )
}
