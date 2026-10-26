import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { ArrowLeft } from 'lucide-react'

interface CategoryItem {
  id: string
  name: string
  slug: string
  description: string
  itemsCount: number
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Mehndi Cones', slug: 'mehndi-cones', description: 'Freshly mixed organic henna cones', itemsCount: 0 },
  { id: '2', name: 'Mehndi Powder', slug: 'mehndi-powder', description: 'Triple-sifted 100% natural Sojat henna powder', itemsCount: 0 },
  { id: '3', name: 'Mehndi Kits', slug: 'mehndi-kits', description: 'Complete bridal and professional student kits', itemsCount: 0 },
  { id: '4', name: 'Accessories', slug: 'accessories', description: 'Sealant spray, cellophane rolling sheets, pin tips', itemsCount: 0 },
]

export default function AdminCategoriesPage() {
  const [categories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES)

  useEffect(() => {
    document.title = 'Manage Categories — Mehndi By Dhirali Admin'
  }, [])

  return (
    <PageLayout>
      <div className="bg-forest-green text-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="font-serif text-2xl font-bold">Category Management</h1>
              <p className="text-xs text-warm-ivory/70">Store taxonomy & navigation sections</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-subtle-border bg-white shadow-xs overflow-hidden">
          <div className="p-6 border-b border-subtle-border">
            <h3 className="font-serif text-lg font-semibold text-bottle-green">
              Active Store Categories ({categories.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-ivory/50 text-secondary-text font-semibold uppercase tracking-wider border-b border-subtle-border">
                <tr>
                  <th className="py-3 px-4">Category Name</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Products</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-subtle-border">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-warm-ivory/20 transition">
                    <td className="py-3 px-4 font-semibold text-primary-text">{c.name}</td>
                    <td className="py-3 px-4 font-mono text-secondary-text">{c.slug}</td>
                    <td className="py-3 px-4 text-secondary-text">{c.description}</td>
                    <td className="py-3 px-4 text-primary-text">{c.itemsCount} products</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
