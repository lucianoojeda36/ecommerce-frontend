import { Link } from 'react-router-dom'
import { useDashboard } from '../../api/hooks'
import Skeleton from '../../components/Skeleton'
import type { DashboardStats } from '../../types'
import RevenueChart from './dashboard/RevenueChart'
import { formatMoney, timeAgo, STATUS_LABEL, OPEN_STATUSES } from './dashboard/format'

type IconName = 'revenue' | 'orders' | 'users' | 'box' | 'arrow' | 'check' | 'alert' | 'refresh'

function Icon({ name, size = 14 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  const paths: Record<IconName, React.ReactNode> = {
    revenue: <><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></>,
    orders: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    box: <><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    check: <><path d="m20 6-11 11-5-5" /></>,
    alert: <><path d="M12 9v4M12 17h.01" /><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /></>,
    refresh: <><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.2L3 16M3 21v-5h5" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useDashboard()

  if (isLoading) return <DashboardSkeleton />

  if (isError || !data) {
    return (
      <section className="ds-panel ds-enter flex flex-col items-center justify-center px-6 py-16 text-center">
        <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-md" style={{ background: 'var(--a-danger-soft, color-mix(in srgb, var(--a-danger) 10%, transparent))', color: 'var(--a-danger)' }}>
          <Icon name="alert" size={18} />
        </span>
        <h1 className="text-[15px] font-semibold" style={{ color: 'var(--a-text)' }}>No se pudo cargar el resumen</h1>
        <p className="mt-1 max-w-sm text-[13px]" style={{ color: 'var(--a-text-2)' }}>
          Revisá tu conexión y volvé a intentar.
        </p>
        <button type="button" onClick={() => refetch()} className="ds-btn ds-btn-outline mt-5">
          <Icon name="refresh" size={14} />
          Reintentar
        </button>
      </section>
    )
  }

  const series = data.revenueByDay
  const current = series?.reduce((s, d) => s + d.revenue, 0) ?? data.stats.totalRevenue
  const prev = data.previousPeriodRevenue ?? 0
  const delta = prev > 0 ? (current - prev) / prev : null

  return (
    <div className="ds-enter space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold leading-tight tracking-[-0.03em] sm:text-[26px]" style={{ color: 'var(--a-text)' }}>
            Resumen
          </h1>
          <p className="mt-1 text-[13px]" style={{ color: 'var(--a-text-2)' }}>
            Actividad de tu tienda en los últimos 30 días.
          </p>
        </div>
        <Link to="/admin/orders" className="ds-btn ds-btn-primary">
          Ver órdenes
          <Icon name="arrow" size={14} />
        </Link>
      </div>

      <ActionBand pending={data.stats.pendingOrders} />

      <KpiGrid data={data} current={current} delta={delta} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <RevenuePanel data={data} current={current} delta={delta} />
        <StatusPanel byStatus={data.ordersByStatus} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <RecentOrders orders={data.recentOrders} />
        {data.topProducts && <TopProducts products={data.topProducts} />}
      </div>
    </div>
  )
}

/* ─── Franja de acción ─── */
function ActionBand({ pending }: { pending: number }) {
  if (pending === 0) {
    return (
      <div className="ds-panel flex items-center gap-2.5 px-4 py-3" style={{ color: 'var(--a-text-2)' }}>
        <span className="flex h-4 w-4 items-center justify-center" style={{ color: 'var(--a-success)' }}>
          <Icon name="check" size={14} />
        </span>
        <p className="text-[13px]">Todo al día: no hay órdenes esperando confirmación.</p>
      </div>
    )
  }

  return (
    <div
      className="ds-panel flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center"
      style={{ borderLeft: '2px solid var(--a-warning)', background: 'var(--a-espera-soft)' }}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center" style={{ color: 'var(--a-warning)' }}>
        <Icon name="alert" size={14} />
      </span>
      <p className="flex-1 text-[13px] font-medium" style={{ color: 'var(--a-text)' }}>
        Tenés <span className="num font-semibold">{pending}</span>{' '}
        {pending === 1 ? 'orden esperando' : 'órdenes esperando'} confirmación
      </p>
      <Link to="/admin/orders" className="ds-btn ds-btn-outline self-start sm:self-auto">
        Revisar órdenes
      </Link>
    </div>
  )
}

/* ─── KPI grid ─── */
function KpiGrid({ data, current, delta }: { data: DashboardStats; current: number; delta: number | null }) {
  const items: { label: string; value: string; icon: IconName; detail?: string; delta?: number | null }[] = [
    { label: 'Facturación', value: formatMoney(current), icon: 'revenue', detail: 'últimos 30 días', delta },
    { label: 'Órdenes', value: data.stats.totalOrders.toLocaleString('es-AR'), icon: 'orders', detail: 'totales' },
    { label: 'Clientes', value: data.stats.totalUsers.toLocaleString('es-AR'), icon: 'users', detail: 'registrados' },
    { label: 'Productos', value: data.stats.totalProducts.toLocaleString('es-AR'), icon: 'box', detail: 'activos' },
  ]
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="ds-panel min-h-[116px] p-4 sm:p-5">
          <dt className="ds-eyebrow flex items-center gap-1.5">
            <Icon name={it.icon} size={13} />
            {it.label}
          </dt>
          <dd className="figure mt-3 text-[25px] leading-none" style={{ color: 'var(--a-text)' }}>{it.value}</dd>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {it.delta !== undefined && it.delta !== null && (
              <span
                className="num inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold"
                style={{
                  color: it.delta >= 0 ? 'var(--a-success)' : 'var(--a-danger)',
                  background: `color-mix(in srgb, ${it.delta >= 0 ? 'var(--a-success)' : 'var(--a-danger)'} 10%, transparent)`,
                }}
              >
                {it.delta >= 0 ? '+' : '−'}
                {Math.abs(it.delta * 100).toFixed(Math.abs(it.delta) < 0.1 ? 1 : 0)}%
              </span>
            )}
            <span className="text-[11px]" style={{ color: 'var(--a-text-3)' }}>
              {it.delta !== undefined && it.delta !== null ? 'vs. período anterior' : it.detail}
            </span>
          </div>
        </div>
      ))}
    </dl>
  )
}

/* ─── Ingresos ─── */
function RevenuePanel({ data, current, delta }: { data: DashboardStats; current: number; delta: number | null }) {
  const series = data.revenueByDay
  const hasSeries = !!series && series.length > 1
  const orders = series?.reduce((s, d) => s + d.orders, 0) ?? 0
  const ticket = orders > 0 ? current / orders : 0

  return (
    <section className="ds-panel p-5 sm:p-6" aria-labelledby="rev-title">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="rev-title" className="text-[14px] font-semibold" style={{ color: 'var(--a-text)' }}>
          Ingresos
        </h2>
        <span className="ds-eyebrow">Últimos 30 días</span>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-x-3 gap-y-1">
        <p className="figure text-[30px] leading-none sm:text-[34px]" style={{ color: 'var(--a-text)' }}>
          {formatMoney(current)}
        </p>
        {delta !== null && (
          <span
            className="num mb-0.5 rounded px-1.5 py-0.5 text-[11px] font-semibold"
            style={{
              color: delta >= 0 ? 'var(--a-success)' : 'var(--a-danger)',
              background: `color-mix(in srgb, ${delta >= 0 ? 'var(--a-success)' : 'var(--a-danger)'} 10%, transparent)`,
            }}
          >
            {delta >= 0 ? '+' : '−'}{Math.abs(delta * 100).toFixed(Math.abs(delta) < 0.1 ? 1 : 0)}%
          </span>
        )}
      </div>

      {hasSeries && (
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[12px]" style={{ color: 'var(--a-text-2)' }}>
          <span><span className="num font-semibold" style={{ color: 'var(--a-text)' }}>{orders}</span> órdenes</span>
          <span>Ticket promedio <span className="num font-semibold" style={{ color: 'var(--a-text)' }}>{formatMoney(ticket)}</span></span>
        </div>
      )}

      {hasSeries ? (
        <div className="mt-6">
          <RevenueChart data={series} />
        </div>
      ) : (
        <p className="mt-6 rounded-md px-3 py-2.5 text-[12px]" style={{ background: 'var(--a-surface-2)', color: 'var(--a-text-2)' }}>
          Actualizá el servidor para ver la evolución diaria de los últimos 30 días.
        </p>
      )}
    </section>
  )
}

/* ─── Órdenes por estado ─── */
function StatusPanel({ byStatus }: { byStatus?: DashboardStats['ordersByStatus'] }) {
  if (!byStatus) {
    return (
      <section className="ds-panel p-5 sm:p-6">
        <h2 className="text-[14px] font-semibold" style={{ color: 'var(--a-text)' }}>Órdenes por estado</h2>
        <p className="mt-4 text-[12px]" style={{ color: 'var(--a-text-3)' }}>
          Actualizá el servidor para ver cómo se reparten tus órdenes.
        </p>
      </section>
    )
  }

  const open = OPEN_STATUSES.map((s) => ({ status: s, count: byStatus[s] ?? 0 }))
  const max = Math.max(1, ...open.map((r) => r.count))
  const delivered = byStatus.delivered ?? 0
  const cancelled = byStatus.cancelled ?? 0
  const all = [...open, { status: 'delivered', count: delivered }, { status: 'cancelled', count: cancelled }]
  const grandTotal = all.reduce((s, r) => s + r.count, 0)

  return (
    <section className="ds-panel flex flex-col p-5 sm:p-6" aria-labelledby="status-title">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="status-title" className="text-[14px] font-semibold" style={{ color: 'var(--a-text)' }}>
          Órdenes por estado
        </h2>
        <span className="figure text-[20px]" style={{ color: 'var(--a-text)' }}>{grandTotal}</span>
      </div>

      <ol className="mt-5 flex-1 space-y-3.5">
        {all.map((r) => {
          const pct = grandTotal > 0 ? Math.round((r.count / grandTotal) * 100) : 0
          return (
            <li key={r.status} className="grid grid-cols-[86px_1fr_52px] items-center gap-2.5">
              <span className="truncate text-[12px]" style={{ color: r.count ? 'var(--a-text-2)' : 'var(--a-text-3)' }}>
                {STATUS_LABEL[r.status] ?? r.status}
              </span>
              <span className="h-1.5 overflow-hidden rounded-full" style={{ background: 'var(--a-surface-2)' }}>
                <span
                  className="block h-full rounded-full transition-[width] duration-300"
                  style={{ width: `${(r.count / max) * 100}%`, background: `var(--s-${r.status})` }}
                />
              </span>
              <span className="num text-right text-[12px] font-medium" style={{ color: r.count ? 'var(--a-text)' : 'var(--a-text-3)' }}>
                {r.count} <span className="font-normal" style={{ color: 'var(--a-text-3)' }}>{pct}%</span>
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/* ─── Órdenes recientes ─── */
function RecentOrders({ orders }: { orders: DashboardStats['recentOrders'] }) {
  return (
    <section className="ds-panel overflow-hidden" aria-labelledby="recent-title">
      <div className="flex items-center justify-between px-5 pb-3 pt-5 sm:px-6">
        <h2 id="recent-title" className="text-[14px] font-semibold" style={{ color: 'var(--a-text)' }}>
          Órdenes recientes
        </h2>
        <Link to="/admin/orders" className="flex items-center gap-1 text-[12px] font-medium transition-opacity hover:opacity-70" style={{ color: 'var(--a-accent)' }}>
          Ver todas
          <Icon name="arrow" size={12} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="px-5 pb-6 text-[12px]" style={{ color: 'var(--a-text-3)' }}>
          Todavía no recibiste órdenes. Cuando entre la primera, la vas a ver acá.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] border-collapse text-left">
            <thead>
              <tr className="border-y text-[10px] font-medium uppercase tracking-[.06em]" style={{ borderColor: 'var(--a-border)', color: 'var(--a-text-3)' }}>
                <th scope="col" className="px-5 py-2 font-medium sm:px-6">Orden</th>
                <th scope="col" className="px-3 py-2 font-medium">Cliente</th>
                <th scope="col" className="px-3 py-2 font-medium">Estado</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">Total</th>
                <th scope="col" className="px-5 py-2 text-right font-medium sm:px-6">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b transition-colors last:border-0 hover:bg-[var(--a-surface-2)]" style={{ borderColor: 'var(--a-border)' }}>
                  <td className="px-5 py-3 sm:px-6">
                    <Link to={`/admin/orders/${o.id}`} className="num text-[12px] font-medium hover:underline" style={{ color: 'var(--a-accent)' }}>
                      #{o.id.slice(0, 6)}
                    </Link>
                  </td>
                  <td className="max-w-[160px] truncate px-3 py-3 text-[13px]" style={{ color: 'var(--a-text)' }}>
                    {o.user_name || 'Cliente'}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="num px-3 py-3 text-right text-[13px] font-medium" style={{ color: 'var(--a-text)' }}>
                    {formatMoney(Number(o.total))}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right text-[12px] sm:px-6" style={{ color: 'var(--a-text-3)' }}>
                    {timeAgo(o.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="ds-badge">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: `var(--s-${status})` }} aria-hidden />
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

/* ─── Más vendidos ─── */
function TopProducts({ products }: { products: NonNullable<DashboardStats['topProducts']> }) {
  const max = Math.max(1, ...products.map((p) => p.units))
  return (
    <section className="ds-panel p-5 sm:p-6" aria-labelledby="top-title">
      <h2 id="top-title" className="text-[14px] font-semibold" style={{ color: 'var(--a-text)' }}>
        Más vendidos
      </h2>
      <p className="ds-eyebrow mt-0.5">Últimos 30 días</p>
      {products.length === 0 ? (
        <p className="mt-4 text-[12px]" style={{ color: 'var(--a-text-3)' }}>
          Sin ventas en este período. Los productos más pedidos van a aparecer acá.
        </p>
      ) : (
        <ol className="mt-5 space-y-4">
          {products.map((p, i) => (
            <li key={p.name} className="grid grid-cols-[18px_1fr_auto] items-center gap-x-3">
              <span className="num text-[12px]" style={{ color: 'var(--a-text-3)' }}>{i + 1}</span>
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium" style={{ color: 'var(--a-text)' }}>{p.name}</span>
                <span className="mt-2 block h-1 rounded-full" style={{ background: 'var(--a-surface-2)' }}>
                  <span
                    className="block h-full rounded-full transition-[width] duration-300"
                    style={{ width: `${(p.units / max) * 100}%`, background: 'var(--a-accent)', opacity: 1 - i * 0.13 }}
                  />
                </span>
              </span>
              <span className="text-right">
                <span className="num block text-[12px] font-medium" style={{ color: 'var(--a-text)' }}>{p.units} u.</span>
                <span className="num block text-[11px]" style={{ color: 'var(--a-text-3)' }}>{formatMoney(p.revenue)}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

/* ─── Carga ─── */
function DashboardSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Cargando resumen">
      <div className="space-y-2">
        <Skeleton variant="text" height="26px" width="180px" />
        <Skeleton variant="text" height="14px" width="260px" />
      </div>
      <Skeleton height="46px" className="!rounded-[10px]" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="ds-panel space-y-3 p-5">
            <Skeleton variant="text" height="11px" width="45%" />
            <Skeleton variant="text" height="26px" width="60%" />
            <Skeleton variant="text" height="11px" width="35%" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="ds-panel space-y-4 p-6">
          <Skeleton variant="text" height="14px" width="30%" />
          <Skeleton variant="text" height="34px" width="45%" />
          <Skeleton height="190px" className="mt-4" />
        </div>
        <div className="ds-panel space-y-4 p-6">
          <Skeleton variant="text" height="14px" width="50%" />
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} variant="text" height="12px" />)}
        </div>
      </div>
    </div>
  )
}
