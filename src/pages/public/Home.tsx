import { Link } from 'react-router-dom'
import { useProducts, useCategories, useStoreSettings } from '../../api/hooks'
import Loading from '../../components/Loading'
import type { Product } from '../../types'

export default function Home() {
  const { data: products, isLoading } = useProducts({ page: 1 })
  const { data: categories } = useCategories()
  const { data: settings } = useStoreSettings()

  if (isLoading) return <Loading />

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl mb-10 p-10 sm:p-14 text-center" style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 10%, var(--color-bg-card)), var(--color-bg-card))` }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-text) 1px, transparent 0)`, backgroundSize: '32px 32px' }} />
        <div className="relative">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4" style={{ color: 'var(--color-text)' }}>
            {settings?.store_name || 'Mi Tienda'}
          </h1>
          <p className="text-lg sm:text-xl max-w-xl mx-auto mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            {settings?.store_description || 'Descubre nuestros productos'}
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: 'var(--color-primary)' }}>
            Ver Productos
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--color-text)' }}>Categorías</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center gap-3 p-5 rounded-xl transition-all hover:shadow-md hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                {cat.image_url ? (
                  <img src={cat.image_url} alt={cat.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ backgroundColor: `color-mix(in srgb, var(--color-primary) 10%, transparent)`, color: 'var(--color-primary)' }}>
                    {cat.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Products */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Productos Destacados</h2>
          <Link to="/products" className="text-sm font-semibold flex items-center gap-1 transition-all hover:gap-2"
            style={{ color: 'var(--color-primary)' }}>
            Ver todos
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products?.products?.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.compare_price && product.compare_price > product.price

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="rounded-xl overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]"
        style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
        <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--color-text-muted)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[11px] font-bold text-white rounded-md" style={{ backgroundColor: 'var(--color-danger)' }}>
              -{Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)}%
            </span>
          )}
        </div>
        <div className="p-4">
          {product.category_name && (
            <p className="text-xs font-medium mb-1.5 uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>{product.category_name}</p>
          )}
          <h3 className="font-semibold text-sm leading-snug mb-2 line-clamp-2" style={{ color: 'var(--color-text)' }}>{product.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>
              ${Number(product.price).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-xs line-through" style={{ color: 'var(--color-text-muted)' }}>
                ${Number(product.compare_price!).toLocaleString()}
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <span className="inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `color-mix(in srgb, var(--color-success) 12%, transparent)`, color: 'var(--color-success)' }}>
              En stock
            </span>
          ) : (
            <span className="inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `color-mix(in srgb, var(--color-danger) 12%, transparent)`, color: 'var(--color-danger)' }}>
              Sin stock
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
