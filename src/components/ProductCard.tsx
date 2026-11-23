import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useFavoritesContext } from '../context/FavoritesContext'
import LazyImage from './LazyImage'

interface ProductCardProps {
  product: Product
  onQuickView?: (product: Product) => void
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { isFavorite, toggle } = useFavoritesContext()
  const favorite = isFavorite(product.id)
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0

  const stop = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block focus-visible:outline-none"
      aria-label={`Ver detalles de ${product.name}`}
    >
      <article
        className="card-hover rounded-xl overflow-hidden h-full flex flex-col"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}
      >
        <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
          {product.images?.[0] ? (
            <LazyImage
              src={product.images[0]}
              alt={product.name}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--color-text-muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--color-text) 18%, transparent), transparent 45%)' }} />

          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[11px] font-bold text-white rounded-md shadow-sm" style={{ backgroundColor: 'var(--color-danger)' }}>
              -{discountPercent}%
            </span>
          )}

          <button
            type="button"
            onClick={(event) => { stop(event); toggle(product) }}
            aria-label={favorite ? `Quitar ${product.name} de favoritos` : `Agregar ${product.name} a favoritos`}
            aria-pressed={favorite}
            className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-lg border transition-colors duration-150 hover:opacity-80"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 92%, transparent)',
              borderColor: 'var(--color-border)',
              color: favorite ? 'var(--color-danger)' : 'var(--color-text-secondary)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.4 1.1-1.1a5.5 5.5 0 0 0 0-7.9Z" />
            </svg>
          </button>

          {product.stock === 0 && (
            <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 text-[11px] font-bold text-white rounded-md" style={{ backgroundColor: 'color-mix(in srgb, var(--color-text) 65%, transparent)' }}>
              Agotado
            </span>
          )}

          {onQuickView && (
            <button
              type="button"
              onClick={(event) => { stop(event); onQuickView(product) }}
              className="absolute bottom-2.5 right-2.5 flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-medium opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-hover:opacity-100"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--color-bg-card) 94%, transparent)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              aria-label={`Vista rápida de ${product.name}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
                <circle cx="12" cy="12" r="2.8" />
              </svg>
              Vista rápida
            </button>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          {product.category_name && (
            <p className="text-[11px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
              {product.category_name}
            </p>
          )}
          <h3 className="font-semibold text-[15px] leading-tight mb-2.5 line-clamp-2" style={{ color: 'var(--color-text)' }}>
            {product.name}
          </h3>

          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="num text-[15px] font-semibold tracking-tight" style={{ color: 'var(--color-text)' }}>
                ${Number(product.price).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs line-through" style={{ color: 'var(--color-text-muted)' }}>
                  ${Number(product.compare_price!).toLocaleString()}
                </span>
              )}
            </div>
            {hasDiscount && (
              <p className="mt-1 text-[11px] font-medium" style={{ color: 'var(--color-success)' }}>
                Ahorrás ${Number(product.compare_price! - product.price).toLocaleString()}
              </p>
            )}
            <span className="inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: product.stock > 0 ? 'color-mix(in srgb, var(--color-success) 12%, transparent)' : 'color-mix(in srgb, var(--color-danger) 12%, transparent)', color: product.stock > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {product.stock > 0 ? 'En stock' : 'Sin stock'}
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}
