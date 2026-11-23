import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { isOnSale, useProducts, useCategories } from '../../api/hooks'
import type { Product } from '../../types'
import ProductCard from '../../components/ProductCard'
import QuickViewModal from '../../components/QuickViewModal'
import { CategoryListSkeleton, ProductGridSkeleton } from '../../components/Skeleton'

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) pages.push('...')
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < total - 1) pages.push('...')
  pages.push(total)
  return pages
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') || undefined
  const search = searchParams.get('search') || undefined
  const page = parseInt(searchParams.get('page') || '1')
  const promo = searchParams.get('promo') === '1'

  const [searchInput, setSearchInput] = useState(search || '')
  const [quickView, setQuickView] = useState<Product | null>(null)
  const closeQuickView = useCallback(() => setQuickView(null), [])

  const { data, isLoading, isFetching } = useProducts({ page, category, search, on_sale: promo ? 'true' : undefined })
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  const visibleProducts = (data?.products || []).filter(product => !promo || isOnSale(product))
  const visibleTotal = promo ? visibleProducts.length : data?.total || 0

  useEffect(() => {
    setSearchInput(search || '')
  }, [search])

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((searchInput || '') === (search || '')) return
      const params = new URLSearchParams(searchParams)
      if (searchInput) params.set('search', searchInput)
      else params.delete('search')
      params.set('page', '1')
      setSearchParams(params, { replace: true })
    }, 450)
    return () => clearTimeout(timer)
  }, [searchInput, search, searchParams, setSearchParams])

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
    setSearchParams(params)
  }

  const setFilter = (key: string, value: string | undefined) => {
    updateParams({ [key]: value, page: '1' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilter('search', searchInput || undefined)
  }

  const totalPages = promo || !data ? 1 : Math.max(1, Math.ceil(data.total / data.limit))

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>Productos</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Explorá todo nuestro catálogo</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Buscar productos..." aria-label="Buscar productos" className="w-full !pl-10 !pr-10" />
            {searchInput && (
              <button type="button" onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                style={{ color: 'var(--color-text-muted)' }} aria-label="Limpiar búsqueda">
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="px-6 py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 hover:shadow-md active:scale-95"
            style={{ backgroundColor: 'var(--color-primary)' }}>
            Buscar
          </button>
        </div>
      </form>

      {/* Mobile category chips */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 mb-5 -mx-1 px-1">
        <button onClick={() => setFilter('category', undefined)}
          className="shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all"
          style={!category ? { backgroundColor: 'var(--color-primary)', color: '#fff' } : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
          Todas
        </button>
        <button onClick={() => setFilter('promo', promo ? undefined : '1')}
          className="shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all"
          style={promo
            ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
            : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
          Solo ofertas
        </button>
        {categoriesLoading
          ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton shrink-0 h-8 w-20 rounded-full" />)
          : categories?.map((cat) => (
            <button key={cat.id} onClick={() => setFilter('category', cat.slug)}
              className="shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all"
              style={category === cat.slug
                ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
              {cat.name}
            </button>
          ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="hidden md:block md:w-56 shrink-0">
          <div className="sticky top-24 rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--color-text-muted)' }}>Categorías</h3>
            {categoriesLoading ? (
              <CategoryListSkeleton count={5} />
            ) : (
              <div className="space-y-1">
                <button onClick={() => setFilter('category', undefined)}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={!category ? { backgroundColor: 'var(--color-primary)', color: '#fff' } : { color: 'var(--color-text-secondary)' }}>
                  Todas
                </button>
                <button onClick={() => setFilter('promo', promo ? undefined : '1')}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-all"
                  style={promo ? { backgroundColor: 'var(--color-primary)', color: '#fff' } : { color: 'var(--color-text-secondary)' }}>
                  Solo ofertas
                  {promo && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </button>
                <div className="my-2 h-px" style={{ background: 'var(--color-border)' }} />
                {categories?.map((cat) => (
                  <button key={cat.id} onClick={() => setFilter('category', cat.slug)}
                    className="block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-[var(--color-bg-surface)]"
                    style={category === cat.slug
                      ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                      : { color: 'var(--color-text-secondary)' }}>
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 h-5">
            {!isLoading && data && (
              <p className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
                {visibleTotal} producto(s) encontrado(s)
              </p>
            )}
            {isFetching && !isLoading && (
              <span className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                <span className="animate-spin rounded-full h-3.5 w-3.5 border-2" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
                Actualizando...
              </span>
            )}
          </div>

          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : visibleProducts.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={setQuickView} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px dashed var(--color-border)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: 'var(--color-text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="font-medium" style={{ color: 'var(--color-text-secondary)' }}>No se encontraron productos</p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                {promo ? 'No hay ofertas activas con estos filtros' : 'Probá con otra búsqueda o categoría'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
              <button
                onClick={() => setFilter('page', String(page - 1))}
                disabled={page <= 1}
                className="w-9 h-9 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
                aria-label="Página anterior"
              >
                ‹
              </button>
              {getPageNumbers(page, totalPages).map((p, i) =>
                p === '...' ? (
                  <span key={`e-${i}`} className="px-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>…</span>
                ) : (
                  <button key={p} onClick={() => setFilter('page', String(p))}
                    className="w-9 h-9 rounded-lg text-sm font-medium transition-all"
                    aria-current={p === page ? 'page' : undefined}
                    style={p === page
                      ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                      : { color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}>
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setFilter('page', String(page + 1))}
                disabled={page >= totalPages}
                className="w-9 h-9 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
                style={{ color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
                aria-label="Página siguiente"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
      <QuickViewModal product={quickView} onClose={closeQuickView} />
    </div>
  )
}
