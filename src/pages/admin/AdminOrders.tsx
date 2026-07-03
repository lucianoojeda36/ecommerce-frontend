import { useState } from 'react'
import { useAdminOrders, useUpdateOrderStatus } from '../../api/hooks'
import Loading from '../../components/Loading'

const statuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminOrders(page)
  const updateStatus = useUpdateOrderStatus()

  if (isLoading) return <Loading />

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Órdenes</h2>

      <div className="space-y-4">
        {data?.orders?.map((order) => (
          <div key={order.id} className="p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-semibold">#{order.id.substring(0, 8)}</p>
                <p className="text-sm text-gray-500">
                  {order.user_name} · {order.user_email}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(order.created_at).toLocaleDateString('es-AR')}
                </p>
              </div>
              <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                ${Number(order.total).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Estado:</span>
              <select
                value={order.status}
                onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                className="px-3 py-1 border rounded-lg text-sm focus:outline-none"
                style={{ borderColor: '#d1d5db' }}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s === 'pending' ? 'Pendiente' : s === 'confirmed' ? 'Confirmado' : s === 'preparing' ? 'Preparando' : s === 'shipped' ? 'Enviado' : s === 'delivered' ? 'Entregado' : 'Cancelado'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {data && data.total > data.limit && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: Math.ceil(data.total / data.limit) }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`px-4 py-2 rounded-lg text-sm ${p === page ? 'text-white' : 'text-gray-600 border'}`}
              style={p === page ? { backgroundColor: 'var(--color-primary)' } : {}}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
