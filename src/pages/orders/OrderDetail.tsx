import { useParams } from 'react-router-dom'
import { useOrder, useRetryPayment } from '../../api/hooks'
import Loading from '../../components/Loading'

const statusLabels: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmado', preparing: 'Preparando',
  shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
}

export default function OrderDetail() {
  const { id } = useParams()
  const { data: order, isLoading } = useOrder(id!)
  const retryPayment = useRetryPayment()

  const canRetryPayment = order?.status === 'pending' || order?.status === 'cancelled'

  const handleRetryPayment = async () => {
    if (!order) return
    try {
      const { data: payment } = await retryPayment.mutateAsync(order.id)
      const redirectUrl = import.meta.env.DEV ? payment.sandbox_init_point : payment.init_point
      window.location.href = redirectUrl
    } catch {
      alert('No se pudo generar el link de pago. Intentá de nuevo.')
    }
  }

  if (isLoading) return <Loading />
  if (!order) return <p className="text-center py-12 text-gray-500">Orden no encontrada</p>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Orden #{order.id.substring(0, 8)}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {new Date(order.created_at).toLocaleDateString('es-AR', {
          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })}
      </p>

      <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#f0f7ff' }}>
        <span className="text-sm font-medium">Estado: </span>
        <span className="font-semibold">{statusLabels[order.status] || order.status}</span>
      </div>

      {canRetryPayment && (
        <button
          onClick={handleRetryPayment}
          disabled={retryPayment.isPending}
          className="mb-6 w-full py-3 rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          {retryPayment.isPending ? 'Redirigiendo a Mercado Pago...' : 'Volver a pagar'}
        </button>
      )}

      {order.items && (
        <div className="space-y-3 mb-6">
          <h2 className="text-lg font-semibold">Productos</h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin img</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{item.product_name}</p>
                <p className="text-sm text-gray-500">Cant: {item.quantity} x ${Number(item.unit_price).toLocaleString()}</p>
              </div>
              <p className="font-bold">${Number(item.subtotal).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      <div className="p-6 rounded-xl border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Dirección de Envío</h2>
        <p className="text-gray-600">
          {order.shipping_address?.street} {order.shipping_address?.number}
          {order.shipping_address?.city && <>, {order.shipping_address.city}</>}
          {order.shipping_address?.state && <>, {order.shipping_address.state}</>}
        </p>

        <div className="border-t mt-4 pt-4 space-y-2">
          {order.shipping_cost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Envío</span>
              <span className="font-medium">${Number(order.shipping_cost).toLocaleString()}</span>
            </div>
          )}
          {order.shipping_cost === 0 && order.total > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Envío</span>
              <span className="font-medium text-green-600">Gratis</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg">Total</span>
            <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              ${Number(order.total).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
