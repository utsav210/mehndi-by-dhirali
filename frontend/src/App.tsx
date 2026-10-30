import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/lib/auth-store'

// Pages
import HomePage from '@/pages/HomePage'
import ProductsPage from '@/pages/ProductsPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import PaymentResultPage from '@/pages/PaymentResultPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import AccountPage from '@/pages/AccountPage'
import OrdersPage from '@/pages/OrdersPage'
import WishlistPage from '@/pages/WishlistPage'
import ComparePage from '@/pages/ComparePage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import TrackOrderPage from '@/pages/TrackOrderPage'
import PrivacyPage from '@/pages/PrivacyPage'
import TermsPage from '@/pages/TermsPage'
import ShippingReturnsPage from '@/pages/ShippingReturnsPage'
import CancellationPage from '@/pages/CancellationPage'
import FaqPage from '@/pages/FaqPage'
import NotFoundPage from '@/pages/NotFoundPage'

// Admin Pages
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AdminProductsPage from '@/pages/admin/AdminProductsPage'
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage'
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export default function App() {
  const fetchUser = useAuthStore((s) => s.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Storefront Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/categories" element={<ProductsPage />} />
          <Route path="/categories/:slug" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/result" element={<PaymentResultPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/track" element={<TrackOrderPage />} />
          <Route path="/tracking" element={<TrackOrderPage />} />

          {/* Customer Authentication & Account */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/orders" element={<OrdersPage />} />

          {/* Brand & Policy Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
          <Route path="/cancellation" element={<CancellationPage />} />
          <Route path="/faq" element={<FaqPage />} />

          {/* Admin Management Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
