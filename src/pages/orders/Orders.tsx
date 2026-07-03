import { Link } from 'react-router-dom'
import { useOrders } from '../../api/hooks'
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
        {data.orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString('es-AR', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                {statusLabels[order.status] || order.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">#{order.id.substring(0, 8)}</span>
              <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                ${Number(order.total).toLocaleString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
