import { Link } from 'react-router-dom'
import type { Product } from '../types'
import LazyImage from './LazyImage'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compare_price && product.compare_price > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block"
      aria-label={`Ver detalles de ${product.name}`}
    >
       <div
         className="rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:border-opacity-0"
         style={{
           backgroundColor: 'var(--color-bg-card)',
           border: '1px solid var(--color-border)',
         }}
       >
        <div
          className="aspect-square overflow-hidden relative"
          style={{ backgroundColor: 'var(--color-bg-surface)' }}
        >
          {product.images?.[0] ? (
            <LazyImage
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                />
              </svg>
            </div>
          )}
          {hasDiscount && (
            <span
              className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[11px] font-bold text-white rounded-md animate-pulse"
              style={{ backgroundColor: 'var(--color-danger)' }}
            >
              -{discountPercent}%
            </span>
          )}
        </div>
        <div className="p-4">
          {product.category_name && (
            <p
              className="text-xs font-medium mb-1.5 uppercase tracking-wide"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {product.category_name}
            </p>
          )}
          <h3
            className="font-semibold text-[15px] leading-tight mb-2.5 line-clamp-2"
            style={{ color: 'var(--color-text)' }}
          >
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span
              className="text-base font-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              ${Number(product.price).toLocaleString()}
            </span>
            {hasDiscount && (
              <span
                className="text-xs line-through"
                style={{ color: 'var(--color-text-muted)' }}
              >
                ${Number(product.compare_price!).toLocaleString()}
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <span
              className="inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-success) 12%, transparent)`,
                color: 'var(--color-success)',
              }}
            >
              En stock
            </span>
          ) : (
            <span
              className="inline-block mt-2 text-[11px] font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-danger) 12%, transparent)`,
                color: 'var(--color-danger)',
              }}
            >
              Sin stock
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
