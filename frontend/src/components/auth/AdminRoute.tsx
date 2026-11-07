import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/lib/auth-store'
import PageLayout from '@/components/layout/PageLayout'
import { ShieldAlert, Lock, Loader2, KeyRound } from 'lucide-react'
import { toast } from 'sonner'

interface AdminRouteProps {
  children: ReactNode
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const login = useAuthStore((s) => s.login)

  // Quick inline login form state for administrators
  const [email, setEmail] = useState('admin@mehndibydhirali.com')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-bottle-green" />
          <p className="text-sm text-secondary-text font-serif">Verifying administrative credentials…</p>
        </div>
      </PageLayout>
    )
  }

  // If user is authenticated and is an administrator, render child page
  if (user && user.role === 'admin') {
    return <>{children}</>
  }

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both admin email and password.')
      return
    }

    setIsSubmitting(true)
    try {
      await login(email, password)
      toast.success('Admin authorization verified!')
    } catch (err: any) {
      toast.error(err?.message || 'Invalid administrator credentials. Access denied.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-antique-gold/40 bg-white p-8 shadow-card text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-green/10 text-bottle-green mb-5">
            <ShieldAlert className="h-7 w-7 text-bottle-green" />
          </div>

          <span className="text-[11px] font-bold uppercase tracking-widest text-antique-gold">
            Restricted Access
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-bottle-green mt-1">
            Admin Console Verification
          </h1>
          <p className="mt-2 text-xs text-secondary-text leading-relaxed">
            This module requires administrative clearance to view and manage boutique orders, product inventory, and prices.
          </p>

          <form onSubmit={handleAdminSignIn} className="mt-8 space-y-4 text-left">
            <div>
              <label className="block text-xs font-medium text-secondary-text mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@mehndibydhirali.com"
                className="w-full rounded-xl border border-subtle-border px-3.5 py-2.5 text-sm text-primary-text focus:border-bottle-green focus:outline-none bg-warm-ivory/20"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-secondary-text mb-1">
                Admin Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-subtle-border px-3.5 py-2.5 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                />
                <KeyRound className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-text pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-bottle-green py-2.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-forest-green transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authenticating…</span>
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 text-antique-gold" />
                  <span>Authorize & Access Admin Console</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-subtle-border flex items-center justify-between text-xs">
            <Link to="/" className="text-secondary-text hover:text-bottle-green transition-colors">
              ← Return to Storefront
            </Link>
            <span className="text-[11px] text-secondary-text/70">
              Role-Based Access Control Active
            </span>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
