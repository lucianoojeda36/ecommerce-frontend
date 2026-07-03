export default function Loading() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="relative">
        <div className="animate-spin rounded-full h-10 w-10 border-3" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
      </div>
    </div>
  )
}
