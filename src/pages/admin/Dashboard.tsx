import { useDashboard } from '../../api/hooks'
import Loading from '../../components/Loading'

export default function Dashboard() {
  const { data, isLoading } = useDashboard()

  if (isLoading) return <Loading />

  const stats = [
    { label: 'Órdenes Totales', value: data?.stats.totalOrders || 0 },
    { label: 'Ingresos', value: `$${(data?.stats.totalRevenue || 0).toLocaleString()}`, color: true },
    { label: 'Usuarios', value: data?.stats.totalUsers || 0 },
    { label: 'Productos', value: data?.stats.totalProducts || 0 },
    { label: 'Órdenes Pendientes', value: data?.stats.pendingOrders || 0 },
  ]

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="p-4 rounded-xl border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold" style={s.color ? { color: 'var(--color-primary)' } : {}}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-4">Órdenes Recientes</h2>
      <div className="space-y-3">
        {data?.recentOrders?.map((order) => (
          <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100">
            <div>
              <p className="font-medium text-sm">#{order.id.substring(0, 8)}</p>
              <p className="text-sm text-gray-500">{order.user_name}</p>
            </div>
            <div className="text-right">
              <p className="font-bold" style={{ color: 'var(--color-primary)' }}>${Number(order.total).toLocaleString()}</p>
              <p className="text-xs text-gray-400 capitalize">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
