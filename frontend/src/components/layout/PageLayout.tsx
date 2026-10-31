import type { ReactNode } from 'react'
import { ContinuousRunningLine } from './ContinuousRunningLine'
import { SiteHeader } from './SiteHeader'
import { MainNavigation } from './MainNavigation'
import { SiteFooter } from './SiteFooter'
import CartDrawer from '@/components/cart/CartDrawer'

interface PageLayoutProps {
  children: ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ContinuousRunningLine />
      <SiteHeader />
      <MainNavigation />

      <main className="flex-1" id="main-content">
        {children}
      </main>

      <SiteFooter />
      <CartDrawer />
    </div>
  )
}

export default PageLayout
