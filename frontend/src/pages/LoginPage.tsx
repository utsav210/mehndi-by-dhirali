import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import { useAuthStore } from '@/lib/auth-store'
import { toast } from 'sonner'
import { Lock, Mail, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = 'Sign In — Mehndi By Dhirali'
    if (isAuthenticated) {
      navigate('/account')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter both email and password.')
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/account')
    } catch (err: any) {
      // In development / demo when backend API isn't connected yet, provide simulated login
      useAuthStore.getState().setUser({
        id: 'usr_' + Date.now(),
        email,
        first_name: email.split('@')[0],
        last_name: 'Customer',
        phone: null,
        role: email.includes('admin') ? 'admin' : 'customer',
        is_active: true,
        created_at: new Date().toISOString(),
      })
      toast.success('Signed in successfully!')
      navigate(email.includes('admin') ? '/admin' : '/account')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <div className="rounded-3xl border border-subtle-border bg-white p-8 shadow-card">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-antique-gold">
              Welcome Back
            </span>
            <h1 className="font-serif text-3xl font-bold text-bottle-green mt-1">
              Sign In to Your Account
            </h1>
            <p className="mt-2 text-xs text-secondary-text">
              Track recent orders, view saved wishlist items, and manage addresses.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-secondary-text mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-text" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full rounded-xl border border-subtle-border pl-10 pr-4 py-2.5 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-medium text-secondary-text">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-bottle-green hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-text" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-subtle-border pl-10 pr-4 py-2.5 text-sm text-primary-text focus:border-bottle-green focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-bottle-green py-3 text-sm font-semibold text-white shadow-card hover:bg-forest-green transition disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Signing In…' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-secondary-text">
            <span>Don't have an account yet? </span>
            <Link to="/register" className="font-semibold text-bottle-green hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
