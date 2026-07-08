import { Link } from 'react-router-dom'
import { useOrders, useUnreadByOrder } from '../../api/hooks'
import Loading from '../../components/Loading'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
}

export default function Orders() {
  const { data, isLoading } = useOrders()
  const { data: unreadByOrder = [] } = useUnreadByOrder()

  const getUnreadCount = (orderId: string) => {
    const found = unreadByOrder.find((u: any) => u.order_id === orderId)
    return found ? parseInt(found.count) : 0
  }

  if (isLoading) return <Loading />

  if (!data?.orders?.length) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">No tienes órdenes aún</h2>
        <Link
          to="/products"
          className="px-6 py-3 rounded-lg text-white font-semibold transition hover:opacity-90 inline-block"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Comprar ahora
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Órdenes</h1>

      <div className="space-y-4">
        {data.orders.map((order) => {
          const unread = getUnreadCount(order.id)
          return (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className={`block p-5 rounded-xl shadow-sm hover:shadow-lg transition-all ${
                unread > 0
                  ? 'border-2 border-amber-400 bg-amber-50/70'
                  : 'border border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {unread > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                      <span className="text-xs font-bold">{unread} {unread === 1 ? 'respuesta' : 'respuestas'}</span>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('es-AR', {
                        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <p className="text-sm font-semibold text-gray-700">#{order.id.substring(0, 8)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                    ${Number(order.total).toLocaleString()}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
