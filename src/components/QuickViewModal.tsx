import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Product } from '../types'
import { useAddToCart } from '../api/hooks'
import { useAuth } from '../context/AuthContext'
import { useFavoritesContext } from '../context/FavoritesContext'
import { useToast } from './Toast'
import LazyImage from './LazyImage'

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1)
  const { user } = useAuth()
  const { showToast } = useToast()
  const { isFavorite, toggle } = useFavoritesContext()
  const addToCart = useAddToCart()
  const navigate = useNavigate()

  useEffect(() => setQuantity(1), [product?.id])

  useEffect(() => {
    if (!product) return
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [product, onClose])

  if (!product) return null

  const hasDiscount = !!product.compare_price && product.compare_price > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0
  const favorite = isFavorite(product.id)
  const maxQuantity = Math.max(1, Math.min(product.stock, 10))

  const handleAdd = () => {
    if (!user) {
      showToast('Ingresá para agregar al carrito', 'info')
      navigate('/login')
      return
    }
    addToCart.mutate(
      { product_id: product.id, quantity },
      {
        onSuccess: () => {
          showToast('Producto agregado al carrito', 'success')
          onClose()
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`Vista rápida: ${product.name}`}>
      <div className="absolute inset-0 animate-fade-in bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-3xl animate-scale-in overflow-hidden rounded-2xl shadow-2xl"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Cerrar vista rápida"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:opacity-80"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 92%, transparent)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="grid sm:grid-cols-2">
          <div className="relative aspect-square sm:aspect-auto sm:min-h-[380px]" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
            {product.images?.[0] ? (
              <LazyImage src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center" style={{ color: 'var(--color-text-muted)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden>
                  <path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            )}
            {hasDiscount && (
              <span className="absolute left-3 top-3 rounded-md px-2 py-1 text-[11px] font-bold text-white" style={{ backgroundColor: 'var(--color-danger)' }}>
                -{discountPercent}% OFF
              </span>
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-7">
            {product.category_name && <p className="ds-eyebrow">{product.category_name}</p>}
            <h2 className="mt-1.5 text-[22px] font-semibold leading-tight tracking-[-0.03em]" style={{ color: 'var(--color-text)' }}>
              {product.name}
            </h2>

            <div className="mt-4 flex flex-wrap items-baseline gap-2.5">
              <span className="num text-[26px] font-semibold tracking-tight" style={{ color: 'var(--color-text)' }}>
                ${Number(product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm line-through" style={{ color: 'var(--color-text-muted)' }}>
                    ${Number(product.compare_price).toLocaleString()}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: 'color-mix(in srgb, var(--color-success) 12%, transparent)', color: 'var(--color-success)' }}>
                    Ahorrás ${Number(product.compare_price! - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {product.description}
              </p>
            )}

            <span className="mt-4 inline-flex w-fit items-center gap-1.5 text-[12px] font-medium" style={{ color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: product.stock > 0 ? 'var(--color-success)' : 'var(--color-danger)' }} />
              {product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}
            </span>

            <div className="mt-auto pt-6">
              <button
                type="button"
                onClick={() => toggle(product)}
                className="ds-btn ds-btn-outline mb-3 w-full"
                style={{ color: favorite ? 'var(--color-danger)' : undefined }}
                aria-pressed={favorite}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.4 1.1-1.1a5.5 5.5 0 0 0 0-7.9Z" />
                </svg>
                {favorite ? 'En tus favoritos' : 'Guardar en favoritos'}
              </button>

              <div className="flex gap-2">
                <div className="flex h-10 items-center rounded-lg" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-9 items-center justify-center" aria-label="Restar cantidad">−</button>
                  <span className="num w-7 text-center text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>{quantity}</span>
                  <button type="button" onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))} className="flex h-10 w-9 items-center justify-center" aria-label="Sumar cantidad">+</button>
                </div>
                <button type="button" onClick={handleAdd} disabled={product.stock === 0 || addToCart.isPending} className="ds-btn ds-btn-accent flex-1 disabled:cursor-not-allowed disabled:opacity-50">
                  {addToCart.isPending ? 'Agregando...' : 'Agregar al carrito'}
                </button>
              </div>

              <Link to={`/products/${product.slug}`} onClick={onClose} className="mt-3 block text-center text-[12px] font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
                Ver todos los detalles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
