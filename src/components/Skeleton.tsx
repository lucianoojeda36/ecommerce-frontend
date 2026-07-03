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
  const baseClasses = 'animate-pulse'
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  const style = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
    backgroundColor: 'var(--color-bg-surface)',
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

export function ProductCardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
      }}
    >
      <Skeleton className="aspect-square" />
      <div className="p-4 space-y-3.5">
        <Skeleton variant="text" height="10px" width="40%" className="rounded-lg" />
        <Skeleton variant="text" height="14px" className="rounded-lg" />
        <Skeleton variant="text" height="14px" width="60%" className="rounded-lg" />
        <Skeleton variant="text" height="20px" width="30%" className="rounded-lg" />
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

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              variant="text"
              height="40px"
              className="flex-1 rounded-lg"
            />
          ))}
        </div>
      ))}
    </div>
  )
}
