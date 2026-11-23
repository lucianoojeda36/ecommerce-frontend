interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string
  height?: string
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  }

  return (
    <div
      className={`skeleton ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
      <Skeleton className="aspect-square !rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton variant="text" height="9px" width="38%" />
        <Skeleton variant="text" height="13px" className="!w-[92%]" />
        <Skeleton variant="text" height="13px" width="58%" />
        <div className="flex items-center gap-2 pt-1">
          <Skeleton variant="text" height="20px" width="34%" />
          <Skeleton variant="text" height="12px" width="22%" />
        </div>
        <Skeleton variant="circular" height="20px" width="64px" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CategorySkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3 p-5 rounded-xl" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <Skeleton variant="circular" className="!w-12 !h-12" />
          <Skeleton variant="text" height="12px" width="70%" />
        </div>
      ))}
    </div>
  )
}

export function CategoryListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="text" height="36px" className="!rounded-lg" width={i % 2 === 0 ? '100%' : '72%'} />
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 py-4 animate-fade-in">
      <div>
        <Skeleton className="aspect-square !rounded-2xl" />
        <div className="flex gap-2 mt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="!w-20 !h-20 !rounded-lg" />
          ))}
        </div>
      </div>
      <div className="space-y-4 py-2">
        <Skeleton variant="text" height="11px" width="25%" />
        <Skeleton variant="text" height="30px" width="85%" />
        <Skeleton variant="text" height="30px" width="60%" />
        <Skeleton variant="text" height="26px" width="30%" className="mt-6" />
        <div className="space-y-2 pt-4">
          <Skeleton variant="text" height="12px" />
          <Skeleton variant="text" height="12px" />
          <Skeleton variant="text" height="12px" width="70%" />
        </div>
        <div className="flex gap-3 pt-6">
          <Skeleton height="48px" className="!w-32 !rounded-xl" />
          <Skeleton height="48px" className="flex-1 !rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ border: '1px solid var(--color-border)' }}>
          <Skeleton className="!w-12 !h-12 !rounded-lg shrink-0" />
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton key={j} variant="text" height="12px" className="flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function StatsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl" style={{ border: '1px solid var(--color-border)' }}>
          <Skeleton variant="text" height="11px" width="70%" />
          <Skeleton variant="text" height="26px" width="45%" className="mt-3" />
        </div>
      ))}
    </div>
  )
}

export function OrderListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl" style={{ border: '1px solid var(--color-border)' }}>
          <div className="space-y-2 flex-1">
            <Skeleton variant="text" height="12px" width="30%" />
            <Skeleton variant="text" height="10px" width="20%" />
          </div>
          <Skeleton variant="text" height="18px" width="18%" />
        </div>
      ))}
    </div>
  )
}
