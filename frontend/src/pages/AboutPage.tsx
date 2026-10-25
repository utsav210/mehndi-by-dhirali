import { useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { Heart, Leaf, Award } from 'lucide-react'

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Us — Mehndi By Dhirali'
  }, [])

  return (
    <PageLayout>
      <div className="bg-warm-ivory/30 border-b border-subtle-border py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'About Us' },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-antique-gold">
            Our Heritage & Passion
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-bottle-green mt-2">
            The Story Behind Mehndi By Dhirali
          </h1>
          <div className="ornamental-divider my-4 max-w-xs mx-auto">
            <span className="text-antique-gold">✦</span>
          </div>
          <p className="mt-4 text-sm sm:text-base text-secondary-text leading-relaxed max-w-2xl mx-auto">
            Born from an enduring passion for authentic Indian henna rituals, Mehndi By Dhirali delivers artisanal, chemical-free henna products formulated for bridal artists, enthusiasts, and conscious consumers.
          </p>
        </div>

        {/* Narrative Card */}
        <div className="mt-12 rounded-3xl border border-subtle-border bg-warm-ivory/20 p-8 sm:p-12 space-y-6 text-sm leading-relaxed text-primary-text">
          <h2 className="font-serif text-2xl font-bold text-bottle-green">
            Rooted in Tradition, Perfected for Modern Artistry
          </h2>
          <p>
            Mehndi has always been more than an adornment — it is an emotional celebration of auspicious beginnings, fragrant memories, and artistic expression. For generations, traditional henna pastes were ground at home with pure botanicals.
          </p>
          <p>
            In today's fast-moving market flooded with toxic chemical dyes and chemical additives, <strong>Mehndi By Dhirali</strong> was founded to preserve authentic purity. Every batch is hand-blended with triple-sifted certified organic Rajasthani Sojat henna leaf powder, natural cane sugar, and steam-distilled pure essential oils (eucalyptus, cajeput, and lavender).
          </p>
          <p className="border-l-4 border-antique-gold pl-4 italic text-bottle-green font-medium">
            "We believe every bride and henna lover deserves a safe, deeply rich, stain-perfect canvas without compromising their skin's well-being."
          </p>
        </div>

        {/* Values Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-subtle-border p-6 bg-white text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-bottle-green/10 text-bottle-green mb-3">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-base font-semibold text-bottle-green">100% Organic</h3>
            <p className="mt-1 text-xs text-secondary-text">
              Zero chemicals, heavy metals, PPD, or synthetic black pigments.
            </p>
          </div>

          <div className="rounded-2xl border border-subtle-border p-6 bg-white text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-bottle-green/10 text-bottle-green mb-3">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-base font-semibold text-bottle-green">Handmade Fresh</h3>
            <p className="mt-1 text-xs text-secondary-text">
              Cones are rolled and filled fresh per dispatch to ensure maximum dye release.
            </p>
          </div>

          <div className="rounded-2xl border border-subtle-border p-6 bg-white text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-bottle-green/10 text-bottle-green mb-3">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-base font-semibold text-bottle-green">Artist Approved</h3>
            <p className="mt-1 text-xs text-secondary-text">
              Precision tips engineered for effortless flow, intricate mandalas, and bridal figures.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
