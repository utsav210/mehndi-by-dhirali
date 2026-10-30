import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, ShoppingBag, User, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/lib/cart-store'

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
}

interface MobileNavLink {
  label: string
  href: string
}

const NAV_LINKS: MobileNavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Track Order', href: '/track' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
]

const ACCOUNT_LINKS: MobileNavLink[] = [
  { label: 'My Account', href: '/account' },
]

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const { pathname } = useLocation()
  const drawerRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const itemCount = useCartStore((s) => s.getItemCount())
  const openCart = useCartStore((s) => s.openCart)

  // Close when navigating
  useEffect(() => {
    if (isOpen) onClose()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Trap focus & body scroll lock
  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'
    // Focus the close button when drawer opens
    closeButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden',
          isOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-modal transition-transform duration-300 ease-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="border-subtle-border flex items-center justify-between border-b px-5 py-4">
          <Link
            to="/"
            className="flex flex-col items-start"
            onClick={onClose}
          >
            <span className="text-bottle-green font-serif text-lg font-semibold tracking-wide">
              Mehndi
            </span>
            <span className="text-antique-gold -mt-0.5 font-decorative text-[0.6rem] font-medium uppercase tracking-[0.25em]">
              by Dhirali
            </span>
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="text-secondary-text rounded-md p-1.5 transition-colors hover:bg-warm-ivory hover:text-primary-text"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Primary Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)

              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className={cn(
                      'block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-bottle-green/5 text-bottle-green'
                        : 'text-primary-text hover:bg-warm-ivory'
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Divider */}
          <div className="my-4 ornamental-divider">
            <span className="text-antique-gold text-xs">✦</span>
          </div>

          {/* Account / Utility Links */}
          <ul className="space-y-1">
            {ACCOUNT_LINKS.map((link) => {
              const Icon =
                link.href === '/account'
                  ? User
                  : link.href === '/wishlist'
                    ? Heart
                    : User

              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    onClick={onClose}
                    className="text-primary-text flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-warm-ivory"
                  >
                    <Icon className="text-bottle-green h-4 w-4" />
                    {link.label}
                  </Link>
                </li>
              )
            })}
            <li>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  openCart()
                }}
                className="text-primary-text flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors hover:bg-warm-ivory"
              >
                <ShoppingBag className="text-bottle-green h-4 w-4" />
                Shopping Bag
                {itemCount > 0 && (
                  <span className="bg-antique-gold ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.65rem] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="border-subtle-border border-t px-5 py-4">
          <p className="text-secondary-text text-center text-[0.65rem]">
            © {new Date().getFullYear()} Mehndi By Dhirali
          </p>
        </div>
      </aside>
    </>
  )
}
