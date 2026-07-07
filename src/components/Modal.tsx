import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  variant?: 'danger' | 'primary' | 'warning'
  isLoading?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  variant = 'primary',
  isLoading = false,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const variantStyles = {
    primary: { bg: 'var(--color-primary)', hover: 'var(--color-primary-hover)' },
    danger: { bg: 'var(--color-danger)', hover: '#dc2626' },
    warning: { bg: 'var(--color-warning)', hover: '#d97706' },
  }

  const icons = {
    primary: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    danger: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md mx-4 p-6 rounded-2xl shadow-2xl animate-scale-in"
        style={{ backgroundColor: 'var(--color-bg-card)' }}
      >
        <div className="flex items-start gap-4">
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full shrink-0"
            style={{ backgroundColor: `color-mix(in srgb, ${variantStyles[variant].bg} 12%, transparent)` }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke={variantStyles[variant].bg}
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={icons[variant]} />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
              {title}
            </h3>
            <div className="mt-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {children}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition hover:opacity-80 disabled:opacity-50"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: variantStyles[variant].bg }}
          >
            {isLoading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
