import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import HeroBanner from '@/components/home/HeroBanner'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import BrandHighlights from '@/components/home/BrandHighlights'
import SpecialOffers from '@/components/home/SpecialOffers'
import MediaSection from '@/components/home/MediaSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import NewsletterSection from '@/components/home/NewsletterSection'

export default function HomePage() {
  useEffect(() => {
    document.title = 'Mehndi By Dhirali — Premium Organic Henna Cones & Bridal Kits'
  }, [])

  return (
    <PageLayout>
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Brand Highlights / Trust Factors */}
      <BrandHighlights />

      {/* 3. Shop by Category */}
      <CategoryGrid categories={[]} />

      {/* 4. Special Offers / Bridal Kit */}
      <SpecialOffers />

      {/* 5. Featured / Latest Products (empty for now, owner will add products later) */}
      <FeaturedProducts products={[]} title="Featured Mehndi Cones & Powder" />

      {/* 6. Media / Tutorials Section */}
      <MediaSection />

      {/* 7. Verified Reviews Section (ethical placeholder) */}
      <TestimonialsSection />

      {/* 8. Newsletter Section */}
      <NewsletterSection />
    </PageLayout>
  )
}
