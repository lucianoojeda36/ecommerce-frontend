import { useSearchParams, Link } from 'react-router-dom'
import { useOrder, useRetryPayment } from '../../api/hooks'

const statusConfig: Record<string, { title: string; message: string; bg: string; color: string }> = {
  approved: {
    title: '¡Pago aprobado!',
    message: 'Tu pedido fue confirmado y ya lo estamos preparando.',
    bg: '#f0fdf4',
    color: '#15803d',
  },
  pending: {
    title: 'Pago pendiente',
    message: 'Estamos esperando la confirmación de tu pago. Te avisaremos cuando se acredite.',
    bg: '#fffbeb',
    color: '#b45309',
  },
  in_process: {
    title: 'Pago en proceso',
    message: 'Tu pago está siendo procesado. Esto puede tardar unos minutos.',
    bg: '#fffbeb',
    color: '#b45309',
  },
  rejected: {
    title: 'Pago rechazado',
    message: 'No pudimos procesar tu pago. Podés intentar nuevamente desde tus pedidos.',
    bg: '#fef2f2',
    color: '#b91c1c',
  },
  failure: {
    title: 'Pago rechazado',
    message: 'No pudimos procesar tu pago. Podés intentar nuevamente desde tus pedidos.',
    bg: '#fef2f2',
    color: '#b91c1c',
  },
}

export default function PaymentResult() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('collection_status') || searchParams.get('status') || 'pending'
  const orderId = searchParams.get('external_reference')
  const { data: order } = useOrder(orderId!)
  const retryPayment = useRetryPayment()

  const config = statusConfig[status] || statusConfig.pending
  const canRetryPayment = (status === 'rejected' || status === 'failure') && orderId

  const handleRetryPayment = async () => {
    if (!orderId) return
    try {
      const { data: payment } = await retryPayment.mutateAsync(orderId)
      const redirectUrl = import.meta.env.DEV ? payment.sandbox_init_point : payment.init_point
      window.location.href = redirectUrl
    } catch {
      alert('No se pudo generar el link de pago. Intentá de nuevo.')
    }
  }

  return (
    <div className="max-w-lg mx-auto text-center">
      <div className="p-8 rounded-xl border border-gray-100 shadow-sm" style={{ backgroundColor: config.bg }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: config.color }}>{config.title}</h1>
        <p className="text-gray-600 mb-6">{config.message}</p>

        {order && (
          <p className="text-sm text-gray-500 mb-6">
            Pedido #{order.id.substring(0, 8)} · Total ${Number(order.total).toLocaleString()}
          </p>
        )}

        <div className="flex justify-center gap-4 flex-wrap">
          {canRetryPayment && (
            <button
              onClick={handleRetryPayment}
              disabled={retryPayment.isPending}
              className="px-5 py-2 rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {retryPayment.isPending ? 'Redirigiendo...' : 'Volver a pagar'}
            </button>
          )}
          {orderId && (
            <Link
              to={`/orders/${orderId}`}
              className="px-5 py-2 rounded-lg text-white font-semibold transition hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Ver mi pedido
            </Link>
          )}
          <Link to="/products" className="px-5 py-2 rounded-lg border border-gray-200 font-semibold hover:bg-gray-50">
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
