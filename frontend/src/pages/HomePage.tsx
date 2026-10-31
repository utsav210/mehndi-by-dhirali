import { useState, useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import HeroBanner from '@/components/home/HeroBanner'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import { INITIAL_PRODUCTS } from '@/data/initial-products'
import BrandHighlights from '@/components/home/BrandHighlights'
import SpecialOffers from '@/components/home/SpecialOffers'
import MediaSection from '@/components/home/MediaSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import NewsletterSection from '@/components/home/NewsletterSection'
import { apiClient } from '@/lib/api-client'
import type { Product, Category } from '@/types'

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    document.title = 'Mehndi By Dhirali — Premium Organic Henna Cones & Bridal Kits'

    async function loadData() {
      try {
        const prodData = await apiClient.get<{ items: Product[] }>('/products', {
          params: { sort: 'featured', page_size: 8 },
        })
        if (prodData?.items && prodData.items.length > 0) {
          setProducts(prodData.items)
        }
      } catch (err) {
        console.warn('Live products fetch failed, using default collection:', err)
      }

      try {
        const catData = await apiClient.get<Category[]>('/categories')
        if (catData && catData.length > 0) {
          setCategories(catData)
        }
      } catch (err) {
        console.warn('Live categories fetch failed, using default categories:', err)
      }
    }

    loadData()
  }, [])

  return (
    <PageLayout>
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Brand Highlights / Trust Factors */}
      <BrandHighlights />

      {/* 3. Shop by Category */}
      <CategoryGrid categories={categories} />

      {/* 4. Special Offers / Bridal Kit */}
      <SpecialOffers />

      {/* 5. Featured / Latest Products */}
      <FeaturedProducts products={products} title="Featured Henna Cones, Powder & Kits" />

      {/* 6. Media / Tutorials Section */}
      <MediaSection />

      {/* 7. Verified Reviews Section */}
      <TestimonialsSection />

      {/* 8. Newsletter Section */}
      <NewsletterSection />
    </PageLayout>
  )
}
