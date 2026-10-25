import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Contact Us', href: '/contact' },
]

export function MainNavigation() {
  const { pathname } = useLocation()

  return (
    <nav
      className="border-subtle-border hidden border-b bg-white lg:block"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <ul className="flex items-center justify-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)

            return (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={cn(
                    'text-bottle-green relative inline-block py-3 text-sm font-medium tracking-wide transition-colors',
                    'after:bg-antique-gold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-center after:scale-x-0 after:transition-transform after:duration-300',
                    'hover:text-forest-green hover:after:scale-x-100',
                    isActive && 'after:scale-x-100'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
