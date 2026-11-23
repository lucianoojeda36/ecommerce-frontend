import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminOrders, useUpdateOrderStatus, useUnreadByOrder } from '../../api/hooks'
import { OrderListSkeleton } from '../../components/Skeleton'
import { STATUS_LABEL } from './dashboard/format'

const statuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'] as const

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

  if (isLoading) {
    return (
      <div className="ds-enter">
        <h1 className="text-[22px] font-semibold tracking-[-0.03em] sm:text-[26px]" style={{ color: 'var(--a-text)' }}>Órdenes</h1>
        <div className="mt-6"><OrderListSkeleton count={5} /></div>
      </div>
    )
  }

  return (
    <div className="ds-enter space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.03em] sm:text-[26px]" style={{ color: 'var(--a-text)' }}>Órdenes</h1>
        <p className="mt-1 text-[13px]" style={{ color: 'var(--a-text-2)' }}>
          Gestioná el estado y la comunicación con tus clientes.
        </p>
      </div>

      <div className="space-y-2.5">
        {data?.orders?.map((order) => {
          const unread = getUnreadCount(order.id)
          return (
            <div
              key={order.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/admin/orders/${order.id}`)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/admin/orders/${order.id}`) } }}
              className="ds-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
              style={unread > 0 ? { borderLeft: '2px solid var(--a-warning)' } : undefined}
            >
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="num mt-0.5 text-[12px] font-medium" style={{ color: 'var(--a-accent)' }}>
                  #{order.id.substring(0, 8)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium" style={{ color: 'var(--a-text)' }}>
                    {order.user_name || 'Cliente'}
                  </p>
                  <p className="truncate text-[12px]" style={{ color: 'var(--a-text-3)' }}>{order.user_email}</p>
                  {unread > 0 && (
                    <span className="ds-badge mt-2" style={{ background: 'var(--a-espera-soft)', color: 'var(--a-warning)' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
                      </svg>
                      {unread} {unread === 1 ? 'mensaje' : 'mensajes'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-right">
                  <p className="num text-[15px] font-semibold" style={{ color: 'var(--a-text)' }}>
                    ${Number(order.total).toLocaleString('es-AR')}
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--a-text-3)' }}>
                    {new Date(order.created_at).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                    aria-label={`Estado de la orden #${order.id.substring(0, 8)}`}
                    className="h-8 rounded-md border px-2 text-[12px] outline-none transition-colors focus:border-[var(--a-accent)]"
                    style={{ background: 'var(--a-surface-2)', borderColor: 'var(--a-border)', color: 'var(--a-text)' }}
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{STATUS_LABEL[s] ?? s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {data && data.total > data.limit && (
        <nav aria-label="Paginación" className="flex justify-center gap-1.5 pt-2">
          {Array.from({ length: Math.ceil(data.total / data.limit) }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              aria-current={p === page ? 'page' : undefined}
              className="ds-btn h-8 min-w-8 px-2"
              style={p === page
                ? { background: 'var(--a-text)', color: 'var(--a-surface)', border: '1px solid var(--a-text)' }
                : { background: 'var(--a-surface)', color: 'var(--a-text-2)', border: '1px solid var(--a-border)' }}
            >
              {p}
            </button>
          ))}
        </nav>
      )}
    </div>
  )
}
