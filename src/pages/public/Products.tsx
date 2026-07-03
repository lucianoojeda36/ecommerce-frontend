import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useProducts, useCategories } from '../../api/hooks'
import Loading from '../../components/Loading'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || undefined
  const search = searchParams.get('search') || undefined
  const page = parseInt(searchParams.get('page') || '1')

  const [searchInput, setSearchInput] = useState(search || '')

  const { data, isLoading } = useProducts({ page, category, search })
  const { data: categories } = useCategories()

  if (isLoading) return <Loading />

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchInput) params.set('search', searchInput)
    if (category) params.set('category', category)
    params.set('page', '1')
    setSearchParams(params)
  }

  const setFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    params.set('page', '1')
    setSearchParams(params)
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1

  return (
    <div>
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Buscar productos..." className="pl-10" />
          </div>
          <button type="submit" className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md"
            style={{ backgroundColor: 'var(--color-primary)' }}>
            Buscar
          </button>
        </div>
      </form>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="md:w-52 shrink-0">
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Categorías</h3>
          <div className="space-y-1">
            <button onClick={() => setFilter('category', undefined)}
              className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={!category ? { backgroundColor: 'var(--color-primary)', color: '#fff' } : { color: 'var(--color-text-secondary)' }}>
              Todas
            </button>
            {categories?.map((cat) => (
              <button key={cat.id} onClick={() => setFilter('category', cat.slug)}
                className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={category === cat.slug
                  ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                  : { color: 'var(--color-text-secondary)' }}>
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {data?.products && data.products.length > 0 && (
            <p className="text-xs font-medium mb-4" style={{ color: 'var(--color-text-muted)' }}>{data.total} producto(s) encontrado(s)</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data?.products?.map((product) => {
              const hasDiscount = product.compare_price && product.compare_price > product.price
              return (
                <Link key={product.id} to={`/products/${product.slug}`} className="group block">
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
            })}
          </div>

          {data?.products?.length === 0 && (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p style={{ color: 'var(--color-text-muted)' }}>No se encontraron productos</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setFilter('page', String(p))}
                  className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
                  style={p === page
                    ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                    : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
