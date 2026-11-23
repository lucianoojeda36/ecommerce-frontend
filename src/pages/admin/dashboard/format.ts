export const formatMoney = (n: number) =>
  `$${Math.round(n).toLocaleString('es-AR')}`

const compact = new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 })
export const formatCompact = (n: number) => `$${compact.format(n)}`

/** "2026-11-23" → "23 nov" (o "domingo 23 de noviembre" con long) sin desfasaje por zona horaria. */
export function formatDay(iso: string, long = false) {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return long
    ? date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
    : date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }).replace('.', '')
}

const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })
export function timeAgo(iso: string) {
  const diff = (new Date(iso).getTime() - Date.now()) / 1000
  const abs = Math.abs(diff)
  if (abs < 60) return 'recién'
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
  if (abs < 86400 * 7) return rtf.format(Math.round(diff / 86400), 'day')
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

export const OPEN_STATUSES = ['pending', 'confirmed', 'preparing', 'shipped'] as const

export const STATUS_LABEL: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}
