import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type { Product, Category, CartItem, Order, Address, StoreSettings, PaymentPreference, DashboardStats, PaginatedResponse, ShippingConfig } from '../types'

// ─── Products ───
export function useProducts(params?: { page?: number; category?: string; search?: string }) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => api.get<PaginatedResponse<Product>>('/products', { params }).then(r => r.data),
  })
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
    mutationFn: (data: { shipping_address: Address; notes?: string; shipping_cost?: number }) =>
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
export function useCalculateShipping(province: string, cartTotal: number) {
  return useQuery({
    queryKey: ['shipping', province, cartTotal],
    queryFn: () => api.post<{ cost: number; free_shipping: boolean }>('/shipping/calculate', { province, cart_total: cartTotal }).then(r => r.data),
    enabled: !!province,
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
