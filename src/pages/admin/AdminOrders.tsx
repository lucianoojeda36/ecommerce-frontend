import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminOrders, useUpdateOrderStatus, useUnreadByOrder } from '../../api/hooks'
import Loading from '../../components/Loading'

const statuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const { data, isLoading } = useAdminOrders(page)
  const updateStatus = useUpdateOrderStatus()
  const { data: unreadByOrder = [] } = useUnreadByOrder()

  const getUnreadCount = (orderId: string) => {
    const found = unreadByOrder.find((u: any) => u.order_id === orderId)
    return found ? parseInt(found.count) : 0
  }

  if (isLoading) return <Loading />

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Órdenes</h2>

      <div className="space-y-4">
        {data?.orders?.map((order) => {
          const unread = getUnreadCount(order.id)
          return (
            <div key={order.id}
              onClick={() => navigate(`/admin/orders/${order.id}`)}
              className={`p-5 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-lg ${
                unread > 0
                  ? 'border-2 border-amber-400 bg-amber-50/70'
                  : 'border border-gray-100 hover:border-gray-200'
              }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {unread > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                      </svg>
                      <span className="text-xs font-bold">{unread} {unread === 1 ? 'mensaje' : 'mensajes'}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">#{order.id.substring(0, 8)}</p>
                    <p className="text-sm text-gray-500">{order.user_name} · {order.user_email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                      ${Number(order.total).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                  <div onClick={e => e.stopPropagation()}>
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
              </div>
            </div>
          )
        })}
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
