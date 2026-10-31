import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'
import { useAuthStore } from '@/lib/auth-store'
import { MobileNavigation } from './MobileNavigation'

export function SiteHeader() {
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const itemCount = useCartStore((s) => s.getItemCount())
  const openCart = useCartStore((s) => s.openCart)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
    }
  }

  return (
    <>
      <header className="border-subtle-border sticky top-0 z-40 border-b bg-white shadow-2xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
          {/* ── Left: Hamburger (mobile) + Search ───────────────── */}
          <div className="flex items-center gap-3 lg:flex-1">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(true)}
              className="text-bottle-green -ml-1 rounded-md p-1.5 transition-colors hover:bg-warm-ivory lg:hidden cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search bar — desktop */}
            <form onSubmit={handleSearchSubmit} className="relative hidden lg:block lg:w-72">
              <Search className="text-secondary-text pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="border-subtle-border bg-warm-ivory/50 placeholder:text-secondary-text focus:border-bottle-green w-full rounded-full border py-2 pl-9 pr-4 text-sm transition-colors focus:outline-hidden focus:ring-1 focus:ring-bottle-green/30"
              />
            </form>

            {/* Search toggle — mobile */}
            <button
              type="button"
              onClick={() => setIsSearchOpen((o) => !o)}
              className="text-bottle-green rounded-md p-1.5 transition-colors hover:bg-warm-ivory lg:hidden cursor-pointer"
              aria-label={isSearchOpen ? 'Close search' : 'Open search'}
            >
              {isSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* ── Center: Brand Logo ───────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center justify-center transition-opacity hover:opacity-85 py-0.5"
            aria-label="Mehndi By Dhirali — Home"
          >
            <img
              src="/images/logo.png"
              alt="Mehndi By Dhirali"
              className="h-16 w-auto object-contain sm:h-20 lg:h-24 transition-transform duration-300 hover:scale-[1.02]"
              width={825}
              height={804}
            />
          </Link>

          {/* ── Right: Action Icons ──────────────────────────────── */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 lg:flex-1">
            {/* Account (man / sign-in icon + Login / Register text) */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="text-bottle-green group flex items-center gap-1.5 sm:gap-2 rounded-full px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors hover:bg-warm-ivory cursor-pointer"
              aria-label={isAuthenticated ? 'My account' : 'Login / Register'}
              title={isAuthenticated ? 'My Account' : 'Login / Register'}
            >
              <User className="h-5 w-5 text-bottle-green shrink-0 transition-transform group-hover:scale-105" />
              <span className="hidden sm:inline font-medium text-primary-text group-hover:text-bottle-green tracking-tight whitespace-nowrap">
                {isAuthenticated ? (user?.first_name ? `Hi, ${user.first_name}` : 'My Account') : 'Login / Register'}
              </span>
            </Link>

            {/* Cart */}
            <button
              type="button"
              onClick={openCart}
              className="text-bottle-green relative rounded-md p-2 transition-colors hover:bg-warm-ivory cursor-pointer"
              aria-label={`Shopping bag${itemCount > 0 ? ` (${itemCount} items)` : ''}`}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && <IconBadge count={itemCount} />}
            </button>
          </div>
        </div>

        {/* ── Mobile search bar (expandable) ───────────────────── */}
        <div
          className={cn(
            'border-subtle-border overflow-hidden border-t transition-all duration-300 lg:hidden',
            isSearchOpen ? 'max-h-16 opacity-100' : 'max-h-0 border-t-0 opacity-0'
          )}
        >
          <div className="px-4 py-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="text-secondary-text pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cones, powders, kits…"
                className="border-subtle-border bg-warm-ivory/50 placeholder:text-secondary-text focus:border-bottle-green w-full rounded-full border py-2 pl-9 pr-4 text-sm transition-colors focus:outline-hidden focus:ring-1 focus:ring-bottle-green/30"
              />
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <MobileNavigation
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  )
}

/* ─── Shared badge component ──────────────────────────────────────── */

interface IconBadgeProps {
  count: number
}

function IconBadge({ count }: IconBadgeProps) {
  return (
    <span
      className="bg-antique-gold absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[0.6rem] font-bold leading-none text-white"
      aria-hidden="true"
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
