import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Mail,
  Phone,
  MapPin,
  Send,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Social SVG Icons ──────────────────────────────────────────────── */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('h-5 w-5', className)}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('h-5 w-5', className)}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  )
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('h-5 w-5', className)}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  )
}

/* ─── Data ─────────────────────────────────────────────────────────── */

interface FooterLink {
  label: string
  href: string
}

const QUICK_LINKS: FooterLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Track Your Order', href: '/track' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const POLICY_LINKS: FooterLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
  { label: 'Shipping Policy', href: '/shipping-returns' },
  { label: 'Returns & Refunds', href: '/shipping-returns' },
]

interface SocialLink {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/',
    icon: InstagramIcon,
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/',
    icon: FacebookIcon,
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/',
    icon: YoutubeIcon,
  },
  {
    label: 'Pinterest',
    href: 'https://pinterest.com/',
    icon: PinterestIcon,
  },
]

/* ─── Component ────────────────────────────────────────────────────── */

export function SiteFooter() {
  const [email, setEmail] = useState('')
  const currentYear = new Date().getFullYear()

  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // TODO: Wire to newsletter API
    setEmail('')
  }

  return (
    <footer className="bg-bottle-green text-warm-ivory" role="contentinfo">
      {/* ── Newsletter Section ──────────────────────────────────── */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div className="max-w-md">
              <h3 className="font-serif text-xl font-semibold text-white sm:text-2xl">
                Join Our Community
              </h3>
              <p className="text-warm-ivory/70 mt-1 text-sm">
                Subscribe for exclusive offers, mehndi tips &amp; new product launches.
              </p>
            </div>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex w-full max-w-sm gap-2"
            >
              <label htmlFor="footer-newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="footer-newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 rounded-md border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50 focus:border-antique-gold focus:outline-none focus:ring-1 focus:ring-antique-gold/40"
              />
              <button
                type="submit"
                className="bg-antique-gold hover:bg-antique-gold/90 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Gold Ornamental Divider ─────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-center gap-3 py-1">
          <div className="from-antique-gold/0 via-antique-gold/60 to-antique-gold/0 h-px flex-1 bg-gradient-to-r" />
          <span className="text-antique-gold text-xs">✦</span>
          <div className="from-antique-gold/0 via-antique-gold/60 to-antique-gold/0 h-px flex-1 bg-gradient-to-r" />
        </div>
      </div>

      {/* ── Main Footer Grid ────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex flex-col items-start">
              <span className="font-serif text-xl font-semibold tracking-wide text-white">
                Mehndi
              </span>
              <span className="text-antique-gold -mt-0.5 font-decorative text-[0.6rem] font-medium uppercase tracking-[0.25em]">
                by Dhirali
              </span>
            </Link>
            <p className="text-warm-ivory/70 mt-4 max-w-xs text-sm leading-relaxed">
              Crafting the finest natural mehndi products with love, tradition
              and a commitment to quality since generations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-antique-gold mb-4 text-xs font-semibold uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-warm-ivory/70 text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-antique-gold mb-4 text-xs font-semibold uppercase tracking-widest">
              Policies
            </h4>
            <ul className="space-y-2.5">
              {POLICY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-warm-ivory/70 text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-antique-gold mb-4 text-xs font-semibold uppercase tracking-widest">
              Get in Touch
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@mehndibydhirali.com"
                  className="text-warm-ivory/70 flex items-start gap-2.5 text-sm transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  hello@mehndibydhirali.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="text-warm-ivory/70 flex items-start gap-2.5 text-sm transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  +91 98765 43210
                </a>
              </li>
              <li>
                <span className="text-warm-ivory/70 flex items-start gap-2.5 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  Mumbai, Maharashtra, India
                </span>
              </li>
            </ul>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-ivory/60 rounded-md p-1.5 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Gold Ornamental Divider ─────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="flex items-center gap-3 py-1">
          <div className="from-antique-gold/0 via-antique-gold/60 to-antique-gold/0 h-px flex-1 bg-gradient-to-r" />
          <span className="text-antique-gold text-xs">✦</span>
          <div className="from-antique-gold/0 via-antique-gold/60 to-antique-gold/0 h-px flex-1 bg-gradient-to-r" />
        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-5 lg:px-6">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <p className="text-warm-ivory/50 text-xs">
            © {currentYear} Mehndi By Dhirali. All rights reserved.
          </p>
          <p className="text-warm-ivory/40 text-xs">
            Handcrafted with ♥ in India
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Pinterest Icon (not available in Lucide) ─────────────────────── */

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-5 w-5', className)}
      aria-hidden="true"
    >
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M8 22l4-5 4 5" />
      <circle cx="12" cy="10" r="7" />
      <path d="M9.5 7.5C10 6 12 5 12 5s2 1 2.5 2.5C15 9 14 11 12 12c-2-1-3-3-2.5-4.5z" />
    </svg>
  )
}
