// Core product types used across the application

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  specifications: string | null
  category_id: string
  category_name: string
  category_slug: string
  price_minor: number
  compare_at_price_minor: number | null
  stock_quantity: number
  is_active: boolean
  is_featured: boolean
  sku: string
  weight_grams: number | null
  images: ProductImage[]
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text: string
  sort_order: number
  is_primary: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  sort_order: number
  is_active: boolean
  product_count?: number
}

export interface CartItem {
  product_id: string
  product_name: string
  product_slug: string
  product_image: string
  price_minor: number
  compare_at_price_minor: number | null
  quantity: number
  stock_quantity: number
  sku: string
  weight_grams?: number | null
}

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  role: 'customer' | 'admin'
  is_active: boolean
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string
  full_name: string
  phone: string
  address_line_1: string
  address_line_2: string | null
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

export interface Order {
  id: string
  order_number: string
  user_id: string
  status: OrderStatus
  subtotal_minor: number
  shipping_minor: number
  cod_fee_minor?: number | null
  discount_minor: number
  total_minor: number
  currency: string
  payment_method?: string | null
  shipping_address: Address
  items: OrderItem[]
  razorpay_order_id: string | null
  tracking_number?: string | null
  courier_partner?: string | null
  tracking_url?: string | null
  estimated_delivery?: string | null
  shipped_at?: string | null
  delivered_at?: string | null
  tracking_notes?: string | null
  created_at: string
  updated_at: string
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'payment_failed'
  | 'cancelled'
  | 'refund_pending'
  | 'refunded'

export interface TrackingTimelineStep {
  step_key: string
  title: string
  description: string
  timestamp: string | null
  is_completed: boolean
  is_current: boolean
}

export interface OrderTrackingResponse {
  order_number: string
  tracking_number: string | null
  courier_partner: string | null
  tracking_url: string | null
  status: string
  status_label: string
  estimated_delivery: string | null
  shipped_at: string | null
  delivered_at: string | null
  tracking_notes: string | null
  recipient_name: string | null
  destination_city: string | null
  destination_state: string | null
  total_minor: number
  currency: string
  items: OrderItem[]
  timeline: TrackingTimelineStep[]
  created_at: string
}

export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  product_image: string
  sku: string
  quantity: number
  unit_price_minor: number
  total_price_minor: number
}

export interface WishlistItem {
  id: string
  product_id: string
  product: Product
  added_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface ApiError {
  detail: string
  status_code?: number
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export interface NewsletterData {
  email: string
}
