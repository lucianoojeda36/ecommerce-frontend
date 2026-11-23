import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct, useAddToCart, useCart } from '../../api/hooks'
import { useAuth } from '../../context/AuthContext'
import { useFavoritesContext } from '../../context/FavoritesContext'
import LazyImage from '../../components/LazyImage'
import { ProductDetailSkeleton } from '../../components/Skeleton'

export default function ProductDetail() {
  const { slug } = useParams()
  const { data: product, isLoading } = useProduct(slug!)
  const { user } = useAuth()
  const { isFavorite, toggle } = useFavoritesContext()
  const addToCart = useAddToCart()
  const { data: cart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [imgIndex, setImgIndex] = useState(0)
  const [added, setAdded] = useState(false)

  if (isLoading) return <ProductDetailSkeleton />
  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Producto no encontrado</h2>
        <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>El producto que buscás no existe o fue removido.</p>
        <Link to="/products" className="inline-block px-5 py-2.5 rounded-lg text-white font-semibold" style={{ backgroundColor: 'var(--color-primary)' }}>
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const inCart = cart?.items?.find(i => i.product_id === product.id)
  const maxStock = Math.max(1, Math.min(product.stock, 99))
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const stockMessage = product.stock <= 5 && product.stock > 0
    ? `¡Solo quedan ${product.stock} unidades!`
    : product.stock === 0
      ? 'Producto agotado'
      : null

  const handleAdd = () => {
    if (!user) return
    addToCart.mutate({ product_id: product.id, quantity }, {
      onSuccess: () => {
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
      },
    })
  }

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs mb-6 flex-wrap" style={{ color: 'var(--color-text-muted)' }}>
        <Link to="/" className="hover:underline">Inicio</Link>
        <span>/</span>
        <Link to="/products" className="hover:underline">Productos</Link>
        {product.category_name && (
          <>
            <span>/</span>
            <Link to={`/products?category=${product.category_slug || ''}`} className="hover:underline">{product.category_name}</Link>
          </>
        )}
        <span>/</span>
        <span style={{ color: 'var(--color-text-secondary)' }}>{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden relative" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            {product.images?.[imgIndex] ? (
              <LazyImage src={product.images[imgIndex]} alt={product.name} className="hover:scale-[1.02] transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--color-text-muted)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
            )}
            {hasDiscount && (
              <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white rounded-lg" style={{ backgroundColor: 'var(--color-danger)' }}>
                -{Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)}% OFF
              </span>
            )}
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIndex(i)}
                  className={`w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === imgIndex ? 'opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  style={i === imgIndex ? { borderColor: 'var(--color-primary)' } : {}}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="py-1">
          {product.category_name && (
            <Link to={`/products?category=${product.category_slug || ''}`} className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-primary)' }}>
              {product.category_name}
            </Link>
          )}
          <div className="mt-2 mb-4 flex items-start justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight" style={{ color: 'var(--color-text)' }}>{product.name}</h1>
            <button
              type="button"
              onClick={() => toggle(product)}
              aria-label={isFavorite(product.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              aria-pressed={isFavorite(product.id)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors hover:opacity-80"
              style={{ borderColor: 'var(--color-border)', color: isFavorite(product.id) ? 'var(--color-danger)' : 'var(--color-text-secondary)', backgroundColor: 'var(--color-bg-card)' }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill={isFavorite(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.4 1.1-1.1a5.5 5.5 0 0 0 0-7.9Z" />
              </svg>
            </button>
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-extrabold" style={{ color: 'var(--color-primary)' }}>
              ${Number(product.price).toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg line-through" style={{ color: 'var(--color-text-muted)' }}>
                  ${Number(product.compare_price).toLocaleString()}
                </span>
                <span className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: 'color-mix(in srgb, var(--color-success) 12%, transparent)', color: 'var(--color-success)' }}>
                  Ahorrás ${Number(product.compare_price! - product.price).toLocaleString()}
                </span>
              </>
            )}
          </div>

          {stockMessage && (
            <p className="inline-flex items-center gap-1.5 text-sm font-medium mb-5 px-3 py-1.5 rounded-lg"
              style={{
                color: product.stock === 0 ? 'var(--color-danger)' : 'var(--color-warning)',
                backgroundColor: product.stock === 0
                  ? 'color-mix(in srgb, var(--color-danger) 10%, transparent)'
                  : 'color-mix(in srgb, var(--color-warning) 10%, transparent)',
              }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: product.stock === 0 ? 'var(--color-danger)' : 'var(--color-warning)' }} />
              {stockMessage}
            </p>
          )}

          {product.description && (
            <div className="mb-8">
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>Descripción</h2>
              <p className="leading-relaxed whitespace-pre-line" style={{ color: 'var(--color-text-secondary)' }}>{product.description}</p>
            </div>
          )}

          {user ? (
            product.stock > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-card)' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="px-4 py-3 transition-colors disabled:opacity-40 hover:bg-[var(--color-bg-surface)]"
                      aria-label="Restar cantidad"
                    >
                      −
                    </button>
                    <span className="px-4 py-3 font-semibold min-w-[3rem] text-center" style={{ color: 'var(--color-text)' }}>{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                      disabled={quantity >= maxStock}
                      className="px-4 py-3 transition-colors disabled:opacity-40 hover:bg-[var(--color-bg-surface)]"
                      aria-label="Sumar cantidad"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={addToCart.isPending}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.99] disabled:opacity-60"
                    style={{ backgroundColor: added ? 'var(--color-success)' : 'var(--color-primary)' }}
                  >
                    {addToCart.isPending ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white" />
                        Agregando...
                      </>
                    ) : added ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Agregado al carrito
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.872l1.836-8.046A1.125 1.125 0 0018.054 3H5.106m2.394 11.25l-1.5-6h13.5" />
                        </svg>
                        Agregar al carrito
                      </>
                    )}
                  </button>
                </div>

                {inCart && (
                  <div className="p-3.5 rounded-xl text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--color-success) 10%, transparent)', color: 'var(--color-success)' }}>
                    Ya tenés {inCart.quantity} {inCart.quantity === 1 ? 'unidad' : 'unidades'} en tu{' '}
                    <Link to="/cart" className="font-semibold underline">carrito</Link>
                  </div>
                )}
              </div>
            ) : (
              <button disabled className="w-full py-3.5 rounded-xl font-semibold cursor-not-allowed" style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-muted)' }}>
                Sin stock
              </button>
            )
          ) : (
            <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', color: 'var(--color-text-secondary)' }}>
              <Link to="/login" className="font-semibold underline" style={{ color: 'var(--color-primary)' }}>Iniciá sesión</Link> para agregar este producto al carrito.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
