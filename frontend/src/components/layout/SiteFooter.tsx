import { Link } from 'react-router-dom'
import {
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Social SVG Icons ─────────────────────────────────────────────── */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('h-5 w-5', className)}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn('h-5 w-5', className)}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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
    label: 'Instagram (@mehndi_by_dhirali07)',
    href: 'https://www.instagram.com/mehndi_by_dhirali07/',
    icon: InstagramIcon,
  },
  {
    label: 'YouTube (@mehndi_by_dhirali07)',
    href: 'https://www.youtube.com/channel/UCmJikx0yiVrpqzps213L-KA',
    icon: YoutubeIcon,
  },
  {
    label: 'WhatsApp Support (+91 81407 45001)',
    href: 'https://wa.me/918140745001',
    icon: WhatsAppIcon,
  },
]

/* ─── Component ────────────────────────────────────────────────────── */

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-bottle-green text-warm-ivory" role="contentinfo">
      {/* ── WhatsApp Community Banner (Replaces repeated email subscribe) ── */}
      <div className="border-b border-white/10 bg-forest-green/40">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-widest text-antique-gold flex items-center gap-1.5 justify-center md:justify-start mb-1">
                <span>✦</span>
                <span>Free Classes &amp; Workshop Updates</span>
              </span>
              <h3 className="font-serif text-xl font-bold text-white sm:text-2xl">
                Join Our WhatsApp Community Group
              </h3>
              <p className="text-warm-ivory/80 mt-1 text-xs sm:text-sm">
                Join our exclusive community group for FREE mehndi classes, tips, and live workshop updates.
              </p>
            </div>

            <a
              href="https://chat.whatsapp.com/LVmXHBXQbzH35cg719kxy6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 text-sm shadow-md transition-all hover:scale-105 shrink-0"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span>Join WhatsApp Community</span>
            </a>
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
            <Link
              to="/"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-90"
              aria-label="Mehndi By Dhirali — Home"
            >
              <img
                src="/images/logo-light.png"
                alt="Mehndi By Dhirali"
                className="h-16 w-auto object-contain"
                width={825}
                height={804}
              />
            </Link>
            <p className="text-warm-ivory/70 mt-4 max-w-xs text-sm leading-relaxed">
              Crafting 100% pure organic Rajasthani Sojat henna cones, powders, oils, and bridal kits with artisanal dedication.
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
                  href="mailto:dhiralidarji2103@gmail.com"
                  className="text-warm-ivory/80 flex items-start gap-2.5 text-xs transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-antique-gold" />
                  <span>dhiralidarji2103@gmail.com</span>
                </a>
              </li>
              <li>
                <div className="text-warm-ivory/80 flex items-start gap-2.5 text-xs">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-antique-gold" />
                  <div className="flex flex-col">
                    <a href="tel:+918140745001" className="hover:text-white">+91 81407 45001</a>
                    <a href="tel:+919662746292" className="hover:text-white">+91 96627 46292</a>
                  </div>
                </div>
              </li>
              <li>
                <a
                  href="https://share.google/00ZRrLHQcSv6uUyWW"
                  target="_blank"
                  rel="noreferrer"
                  className="text-warm-ivory/80 flex items-start gap-2.5 text-xs transition-colors hover:text-white group"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-antique-gold" />
                  <span>
                    Mehndi By Dhirali, Ambalalpark Society, 38, near Uma Hospital, Nava Naroda, Ahmedabad, Gujarat 382330
                  </span>
                </a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="mt-5 flex items-center gap-2.5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm-ivory/70 rounded-full bg-white/10 p-2 transition-all hover:bg-antique-gold hover:text-forest-green"
                  aria-label={social.label}
                  title={social.label}
                >
                  <social.icon className="h-4 w-4" />
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

      {/* ── Copyright & Credits ──────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-warm-ivory/50 text-xs">
            &copy; {currentYear} Mehndi By Dhirali. All rights reserved. Artisanal organic henna.
          </p>

          <p className="text-warm-ivory/40 text-xs">
            Crafted with passion in Ahmedabad, Gujarat
          </p>
        </div>
      </div>
    </footer>
  )
}
