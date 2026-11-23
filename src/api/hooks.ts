import { useEffect, useState } from 'react'
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type { Product, Category, CartItem, Order, Address, StoreSettings, PaymentPreference, DashboardStats, PaginatedResponse, OrderMessage } from '../types'

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}

// ─── Products ───
export function useProducts(params?: { page?: number; category?: string; search?: string; on_sale?: string }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get<PaginatedResponse<Product>>('/products', { params }).then(r => r.data),
  })
}

export function isOnSale(product: Product): boolean {
  return !!product.compare_price && product.compare_price > product.price
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get<Product>(`/products/${slug}`).then(r => r.data),
    enabled: !!slug,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<Product>) => api.post('/products', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) => api.put(`/products/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useUploadImages() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) => {
      const form = new FormData()
      files.forEach(f => form.append('images', f))
      return api.post(`/products/${id}/images`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['product'] })
      qc.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

// ─── Categories ───
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get<Category[]>('/products/c/list/all').then(r => r.data),
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) => api.post('/products/c', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

export function useUploadCategoryImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => {
      const form = new FormData()
      form.append('image', file)
      return api.post(`/products/c/${id}/image`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  })
}

// ─── Cart ───
export function useCart() {
  const token = localStorage.getItem('token')
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => api.get<{ items: CartItem[]; total: number }>('/cart').then(r => r.data),
    enabled: !!token,
  })
}

export function useAddToCart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ product_id, quantity }: { product_id: string; quantity?: number }) =>
      api.post('/cart', { product_id, quantity: quantity || 1 }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export function useUpdateCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      api.put(`/cart/${id}`, { quantity }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export function useRemoveCartItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/cart/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  })
}

export function useClearCart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.delete('/cart'),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
  })
}

// ─── Orders ───
export function useOrders(page = 1) {
  return useQuery({
    queryKey: ['orders', page],
    queryFn: () => api.get<PaginatedResponse<Order>>('/orders/me', { params: { page } }).then(r => r.data),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => api.get<Order>(`/orders/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { shipping_address: Address; notes?: string; shipping_cost?: number; delivery_method?: DeliveryMethod }) =>
      api.post('/orders', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['orders'] })
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

// ─── Admin Orders ───
export function useAdminOrders(page = 1) {
  return useQuery({
    queryKey: ['admin-orders', page],
    queryFn: () => api.get<PaginatedResponse<Order>>('/orders', { params: { page } }).then(r => r.data),
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/orders/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }),
  })
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: ['admin-order', id],
    queryFn: () => api.get<Order>(`/orders/${id}`).then(r => r.data),
    enabled: !!id,
  })
}

// ─── Order Messages ───
export function useOrderMessages(orderId: string) {
  return useQuery({
    queryKey: ['order-messages', orderId],
    queryFn: () => api.get<OrderMessage[]>(`/orders/${orderId}/messages`).then(r => r.data),
    enabled: !!orderId,
    refetchInterval: 30000,
  })
}

export function useSendMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, content }: { orderId: string; content: string }) =>
      api.post<OrderMessage>(`/orders/${orderId}/messages`, { content }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['order-messages', variables.orderId] })
    },
  })
}

export function useMarkMessagesRead(orderId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.put(`/orders/${orderId}/messages/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['order-messages', orderId] })
      qc.invalidateQueries({ queryKey: ['unread-count'] })
      qc.invalidateQueries({ queryKey: ['unread-by-order'] })
    },
  })
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['unread-count'],
    queryFn: () => api.get<{ count: number }>('/orders/messages/unread').then(r => r.data.count),
    refetchInterval: 30000,
  })
}

export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.put('/orders/messages/read-all'),
    onSuccess: () => {
      qc.setQueryData(['unread-count'], 0)
      qc.invalidateQueries({ queryKey: ['unread-by-order'] })
    },
  })
}

export function useUnreadByOrder() {
  return useQuery({
    queryKey: ['unread-by-order'],
    queryFn: () => api.get<{ order_id: string; count: string }[]>('/orders/messages/unread/by-order').then(r => r.data),
    refetchInterval: 30000,
  })
}

// ─── Addresses ───
export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => api.get<Address[]>('/addresses').then(r => r.data),
  })
}

export function useCreateAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Address) => api.post('/addresses', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

export function useDeleteAddress() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/addresses/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  })
}

// ─── Shipping ───
export type DeliveryMethod = 'domicilio' | 'sucursal'

export function useCalculateShipping(zipCode: string, cartTotal: number, deliveryMethod: DeliveryMethod = 'domicilio') {
  const debouncedZipCode = useDebouncedValue(zipCode, 500)
  return useQuery({
    queryKey: ['shipping', debouncedZipCode, cartTotal, deliveryMethod],
    queryFn: () => api.post<{ cost: number; free_shipping: boolean }>('/shipping/calculate', {
      zip_code: debouncedZipCode, cart_total: cartTotal, delivery_method: deliveryMethod,
    }).then(r => r.data),
    enabled: !!debouncedZipCode && debouncedZipCode.length >= 4,
  })
}

// ─── Payments ───
export function useCreatePreference() {
  return useMutation({
    mutationFn: (order_id: string) => api.post<PaymentPreference>('/payments/create-preference', { order_id }),
  })
}

export function useRetryPayment() {
  return useMutation({
    mutationFn: (order_id: string) => api.post<PaymentPreference>('/payments/create-preference', { order_id }),
  })
}

// ─── Admin ───
export function useStoreSettings() {
  return useQuery({
    queryKey: ['store-settings'],
    queryFn: () => api.get<StoreSettings>('/admin/settings').then(r => r.data),
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<StoreSettings>) => api.put('/admin/settings', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['store-settings'] }),
  })
}

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardStats>('/admin/dashboard').then(r => r.data),
  })
}

// ─── Users ───
export function useUsers(page = 1) {
  return useQuery({
    queryKey: ['users', page],
    queryFn: () => api.get<PaginatedResponse<import('../types').User>>('/users', { params: { page } }).then(r => r.data),
  })
}

// ─── Contact ───
export function useSendContactMessage() {
  return useMutation({
    mutationFn: (data: { name: string; email: string; subject: string; message: string }) =>
      api.post('/contact', data),
  })
}

const FAVORITES_KEY = 'favorites'
const FAVORITES_CACHE_KEY = 'favorites_cache'

function readFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : []
  } catch {
    return []
  }
}

export function readFavoritesCache(): Record<string, Product> {
  try {
    const raw = localStorage.getItem(FAVORITES_CACHE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

function persistFavorites(ids: string[], cache: Record<string, Product>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids))
  localStorage.setItem(FAVORITES_CACHE_KEY, JSON.stringify(cache))
}

export function useFavorites() {
  const token = localStorage.getItem('token')
  return useQuery<string[]>({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!token) return readFavorites()
      try {
        const r = await api.get<{ product_ids: string[] } | string[]>('/favorites')
        const ids = Array.isArray(r.data) ? r.data : r.data?.product_ids || []
        const safe = ids.filter((id): id is string => typeof id === 'string')
        persistFavorites(safe, readFavoritesCache())
        return safe
      } catch {
        return readFavorites()
      }
    },
  })
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  const token = localStorage.getItem('token')
  return useMutation({
    mutationFn: async ({ product, favorite }: { product: Product; favorite: boolean }) => {
      const ids = readFavorites()
      const next = favorite ? [...new Set([...ids, product.id])] : ids.filter(id => id !== product.id)
      const cache = readFavoritesCache()
      if (favorite) cache[product.id] = product
      else delete cache[product.id]
      persistFavorites(next, cache)
      if (token) {
        try {
          if (favorite) await api.post('/favorites', { product_id: product.id })
          else await api.delete(`/favorites/${product.id}`)
        } catch {
          return next
        }
      }
      return next
    },
    onMutate: async ({ product, favorite }) => {
      await qc.cancelQueries({ queryKey: ['favorites'] })
      const previous = qc.getQueryData<string[]>(['favorites']) || []
      const next = favorite ? [...new Set([...previous, product.id])] : previous.filter(id => id !== product.id)
      qc.setQueryData<string[]>(['favorites'], next)
      return { previous }
    },
    onError: (_error, _variables, context) => {
      qc.setQueryData(['favorites'], context?.previous || [])
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['favorites'] }),
  })
}

export function useFavoriteProducts(ids: string[]) {
  return useQueries({
    queries: ids.map(id => ({
      queryKey: ['product', id],
      queryFn: () => api.get<Product>(`/products/${id}`).then(r => r.data),
      enabled: !!id,
      retry: false,
      staleTime: 5 * 60 * 1000,
    })),
  })
}
