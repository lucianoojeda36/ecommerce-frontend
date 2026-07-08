import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAdminOrder, useUpdateOrderStatus, useMarkMessagesRead } from '../../api/hooks'
import Loading from '../../components/Loading'
import OrderChat from '../../components/OrderChat'

const statusLabels: Record<string, string> = {
  pending: 'Pendiente', confirmed: 'Confirmado', preparing: 'Preparando',
  shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
}

const statuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: order, isLoading } = useAdminOrder(id!)
  const updateStatus = useUpdateOrderStatus()
  const markRead = useMarkMessagesRead(id!)

  useEffect(() => {
    if (id) markRead.mutate()
  }, [id])

  if (isLoading) return <Loading />
  if (!order) return <p className="text-center py-12 text-gray-500">Orden no encontrada</p>

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate('/admin/orders')}
        className="mb-4 text-sm font-medium flex items-center gap-1 transition hover:opacity-80"
        style={{ color: 'var(--color-primary)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Volver a órdenes
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orden #{order.id.substring(0, 8)}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {order.user_name} · {order.user_email}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(order.created_at).toLocaleDateString('es-AR', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
          ${Number(order.total).toLocaleString()}
        </p>
      </div>

      <div className="mb-6 p-4 rounded-lg flex items-center gap-3" style={{ backgroundColor: '#f0f7ff' }}>
        <span className="text-sm font-medium">Estado:</span>
        <select
          value={order.status}
          onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
          className="px-3 py-1 border rounded-lg text-sm font-semibold focus:outline-none"
          style={{ borderColor: '#d1d5db' }}
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              {statusLabels[s]}
            </option>
          ))}
        </select>
      </div>

      {order.items && order.items.length > 0 && (
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

      <div className="p-6 rounded-xl border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4">Dirección de Envío</h2>
        <p className="text-gray-600">
          {order.shipping_address?.street} {order.shipping_address?.number}
          {order.shipping_address?.city && <>, {order.shipping_address.city}</>}
          {order.shipping_address?.state && <>, {order.shipping_address.state}</>}
        </p>

        {order.notes && (
          <div className="mt-3 p-3 rounded-lg bg-gray-50">
            <p className="text-sm font-medium text-gray-700">Notas del cliente:</p>
            <p className="text-sm text-gray-600 mt-1">{order.notes}</p>
          </div>
        )}

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

      <OrderChat orderId={order.id} onSent={() => markRead.mutate()} />
    </div>
  )
}
