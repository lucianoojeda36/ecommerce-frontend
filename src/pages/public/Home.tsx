import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { isOnSale, useProducts, useCategories, useStoreSettings } from '../../api/hooks'
import type { Product } from '../../types'
import ProductCard from '../../components/ProductCard'
import QuickViewModal from '../../components/QuickViewModal'
import { CategorySkeleton, ProductGridSkeleton } from '../../components/Skeleton'

const benefits = [
  {
    title: 'Envío rápido',
    text: 'Recibí tu pedido en 24–72 hs',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v8H3zM14 10h4l3 3v2h-7zM7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  },
  {
    title: 'Pago seguro',
    text: 'Cada compra está protegida',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 5 6v5c0 4.4 2.9 8.3 7 9.5 4.1-1.2 7-5.1 7-9.5V6l-7-3ZM9 12l2 2 4-4" />,
  },
  {
    title: 'Atención real',
    text: 'Te acompañamos siempre',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2V8a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v7Z" />,
  },
]

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function SectionHeader({ eyebrow, title, link, linkLabel }: { eyebrow: string; title: string; link: string; linkLabel: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="ds-eyebrow">{eyebrow}</p>
        <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.03em] sm:text-[24px]" style={{ color: 'var(--color-text)' }}>{title}</h2>
      </div>
      <Link to={link} className="group flex shrink-0 items-center gap-1.5 text-[12px] font-medium transition-colors hover:opacity-70" style={{ color: 'var(--color-text-secondary)' }}>
        {linkLabel}
        <span className="transition-transform group-hover:translate-x-0.5"><ArrowIcon /></span>
      </Link>
    </div>
  )
}

export default function Home() {
  const { data: products, isLoading: productsLoading } = useProducts({ page: 1 })
  const { data: categories, isLoading: categoriesLoading } = useCategories()
  const { data: settings } = useStoreSettings()

  const [quickView, setQuickView] = useState<Product | null>(null)
  const closeQuickView = useCallback(() => setQuickView(null), [])

  const featured = products?.products?.slice(0, 8) ?? []
  const deals = products?.products?.filter(isOnSale).slice(0, 8) ?? []
  const storeName = settings?.store_name || 'Mi Tienda'

  return (
    <div className="page-container space-y-12 sm:space-y-16">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}>
        <div className="pointer-events-none absolute inset-0 opacity-[0.55]" style={{ backgroundImage: 'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(ellipse at 50% 0%, black 20%, transparent 75%)' }} />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[680px] -translate-x-1/2 rounded-full opacity-[0.13] blur-3xl" style={{ background: 'var(--color-primary)' }} />

        <div className="relative px-6 py-16 text-center sm:px-12 sm:py-24">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium" style={{ borderColor: 'color-mix(in srgb, var(--color-primary) 25%, transparent)', background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', color: 'var(--color-primary)' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
            Nueva colección disponible
          </span>

          <h1 className="animate-fade-up mx-auto mt-6 max-w-3xl text-[38px] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-[58px]" style={{ color: 'var(--color-text)', animationDelay: '60ms' }}>
            {storeName}
          </h1>
          <p className="animate-fade-up mx-auto mt-5 max-w-xl text-[15px] leading-relaxed sm:text-[17px]" style={{ color: 'var(--color-text-secondary)', animationDelay: '120ms' }}>
            {settings?.store_description || 'Productos seleccionados con la mejor calidad y atención. Descubrí lo nuevo y hacé tu pedido en minutos.'}
          </p>

          <div className="animate-fade-up mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row" style={{ animationDelay: '180ms' }}>
            <Link to="/products" className="ds-btn ds-btn-accent !h-11 !px-5 !text-[13px]">
              Explorar productos
              <ArrowIcon />
            </Link>
            <Link to="/contacto" className="ds-btn ds-btn-outline !h-11 !px-5 !text-[13px]">
              Contactanos
            </Link>
          </div>
        </div>

        <div className="relative grid grid-cols-1 border-t sm:grid-cols-3" style={{ borderColor: 'var(--color-border)' }}>
          {benefits.map((b, i) => (
            <div key={b.title} className="animate-fade-up flex items-center gap-3 border-b px-5 py-4 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0" style={{ borderColor: 'var(--color-border)', animationDelay: `${220 + i * 60}ms` }}>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md" style={{ background: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>{b.icon}</svg>
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-medium" style={{ color: 'var(--color-text)' }}>{b.title}</p>
                <p className="truncate text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {(categoriesLoading || (categories && categories.length > 0)) && (
        <section>
          <SectionHeader eyebrow="Explorá" title="Categorías" link="/products" linkLabel="Ver todas" />
          {categoriesLoading ? (
            <CategorySkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories!.map((cat) => (
                <Link key={cat.id} to={`/products?category=${cat.slug}`} className="group flex items-center gap-3 rounded-lg border p-4 transition-colors duration-150 hover:border-[var(--color-border-hover)] hover:bg-[var(--color-bg-surface)]" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}>
                  {cat.image_url ? (
                    <img src={cat.image_url} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-[14px] font-semibold" style={{ background: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)' }}>
                      {cat.name.charAt(0)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>{cat.name}</span>
                  <span className="opacity-0 transition-opacity group-hover:opacity-100" style={{ color: 'var(--color-text-muted)' }}><ArrowIcon /></span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {!productsLoading && deals.length > 0 && (
        <section>
          <SectionHeader eyebrow="Precios que bajan" title="Ofertas de la semana" link="/products?promo=1" linkLabel="Ver todas" />
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
            {deals.map((product) => (
              <div key={product.id} className="w-[258px] shrink-0 snap-start sm:w-[280px]">
                <ProductCard product={product} onQuickView={setQuickView} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader eyebrow="Selección" title="Productos destacados" link="/products" linkLabel="Ver catálogo" />
        {productsLoading ? (
          <ProductGridSkeleton count={4} />
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => <ProductCard key={product.id} product={product} onQuickView={setQuickView} />)}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed px-6 py-16 text-center" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}>
            <p className="text-[13px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>Todavía no hay productos publicados</p>
            <Link to="/products" className="mt-3 inline-block text-[12px] font-medium" style={{ color: 'var(--color-primary)' }}>Ver catálogo</Link>
          </div>
        )}
      </section>

      <QuickViewModal product={quickView} onClose={closeQuickView} />
    </div>
  )
}
