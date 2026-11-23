import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFavoritesContext } from '../../context/FavoritesContext'
import type { Product } from '../../types'
import ProductCard from '../../components/ProductCard'
import QuickViewModal from '../../components/QuickViewModal'

export default function Favorites() {
  const { items, count, isLoading } = useFavoritesContext()
  const [quickView, setQuickView] = useState<Product | null>(null)
  const closeQuickView = useCallback(() => setQuickView(null), [])

  return (
    <div className="page-container">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="ds-eyebrow">Tu selección</p>
          <h1 className="mt-1 text-[26px] font-semibold tracking-[-0.035em] sm:text-[32px]" style={{ color: 'var(--color-text)' }}>
            Favoritos
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
            {count > 0 ? `${count} producto${count === 1 ? '' : 's'} guardado${count === 1 ? '' : 's'}` : 'Guardá los productos que te gusten para volver rápido'}
          </p>
        </div>
        <Link to="/products" className="ds-btn ds-btn-outline !h-9">
          Seguir explorando
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-72 rounded-xl" />)}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
          ))}
        </div>
      ) : (
        <div className="ds-panel flex flex-col items-center px-6 py-20 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-muted)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.4 1.1-1.1a5.5 5.5 0 0 0 0-7.9Z" />
            </svg>
          </span>
          <h2 className="mt-4 text-[16px] font-semibold" style={{ color: 'var(--color-text)' }}>Todavía no guardaste nada</h2>
          <p className="mt-1 max-w-sm text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            Tocá el corazón en cualquier producto para guardarlo acá y encontrarlo cuando quieras.
          </p>
          <Link to="/products" className="ds-btn ds-btn-accent mt-6">
            Explorar productos
          </Link>
        </div>
      )}

      <QuickViewModal product={quickView} onClose={closeQuickView} />
    </div>
  )
}
