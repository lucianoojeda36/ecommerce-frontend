export interface User {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  avatar_url?: string
  phone?: string
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_price?: number
  category_id?: string
  category_name?: string
  category_slug?: string
  stock: number
  images: string[]
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  name: string
  slug: string
  price: number
  images: string[]
  stock: number
  is_active: boolean
}

export interface Order {
  id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  shipping_address: Address
  payment_id?: string
  notes?: string
  created_at: string
  items?: OrderItem[]
  user_name?: string
  user_email?: string
}

export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
  images?: string[]
}

export interface Address {
  id?: string
  label?: string
  street: string
  number?: string
  complement?: string
  neighborhood?: string
  city: string
  state: string
  zip_code?: string
  country: string
  is_default?: boolean
}

export interface StoreSettings {
  id: string
  store_name: string
  store_logo?: string
  store_favicon?: string
  store_description?: string
  primary_color: string
  secondary_color: string
  about_us?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  social_links: Record<string, string>
  seo_title?: string
  seo_description?: string
  currency: string
}

export interface PaymentPreference {
  preference_id: string
  init_point: string
  sandbox_init_point: string
}

export interface PaginatedResponse<T> {
  total: number
  page: number
  limit: number
  products?: T[]
  orders?: T[]
  users?: T[]
}

export interface DashboardStats {
  stats: {
    totalOrders: number
    totalRevenue: number
    totalUsers: number
    totalProducts: number
    pendingOrders: number
  }
  recentOrders: Order[]
}
