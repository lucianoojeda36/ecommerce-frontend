interface LoadingProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
}

const sizes = {
  sm: 'h-6 w-6 border-2',
  md: 'h-10 w-10 border-[3px]',
  lg: 'h-14 w-14 border-4',
}

export default function Loading({ label, size = 'md', fullPage = false }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${fullPage ? 'min-h-[60vh]' : 'py-24'} animate-fade-in`}>
      <div
        className={`animate-spin rounded-full ${sizes[size]}`}
        style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }}
      />
      {label && (
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
          {label}
        </p>
      )}
    </div>
  )
}
