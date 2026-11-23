import { useEffect, useState } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { useStoreSettings, useUnreadCount } from '../../api/hooks'

type IconName = 'grid' | 'box' | 'orders' | 'settings' | 'menu' | 'close' | 'external'

const links: { to: string; label: string; icon: IconName; end?: boolean; badge?: boolean }[] = [
  { to: '/admin', label: 'Resumen', icon: 'grid', end: true },
  { to: '/admin/products', label: 'Productos', icon: 'box' },
  { to: '/admin/orders', label: 'Órdenes', icon: 'orders', badge: true },
  { to: '/admin/settings', label: 'Configuración', icon: 'settings' },
]

function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    box: <><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5M12 22V12" /></>,
    orders: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M9 13h6M9 17h6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.14.62.7 1.08 1.51 1.09H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51.91Z" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="M18 6 6 18M6 6l12 12" /></>,
    external: <><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

export default function AdminLayout() {
  const { data: settings } = useStoreSettings()
  const { data: unreadCount = 0 } = useUnreadCount()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setSidebarOpen(false), [location.pathname])

  const activeLabel =
    links.find((l) => (l.end ? location.pathname === l.to : location.pathname.startsWith(l.to)))?.label ??
    'Detalle'

  return (
    <div className="admin min-h-screen" style={{ background: 'var(--a-canvas)' }}>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
        />
      )}

      <aside
        aria-label="Navegación de administración"
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)' }}
      >
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b px-4" style={{ borderColor: 'var(--a-border)' }}>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[13px] font-semibold"
            style={{ background: 'var(--a-text)', color: 'var(--a-surface)' }}
            aria-hidden
          >
            {(settings?.store_name || 'T').trim().charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0 flex-1 truncate text-[13px] font-semibold" style={{ color: 'var(--a-text)' }}>
            {settings?.store_name || 'Mi Tienda'}
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
            className="ds-btn ds-btn-ghost !h-7 !w-7 !p-0 lg:hidden"
          >
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="px-3 pt-5 pb-2">
          <p className="ds-eyebrow px-2">Espacio de trabajo</p>
        </div>
        <nav className="admin-nav flex-1 space-y-0.5 overflow-y-auto px-3 pb-4" aria-label="Secciones de administración">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors duration-150"
              style={({ isActive }) => ({
                background: isActive ? 'var(--a-surface-2)' : 'transparent',
                color: isActive ? 'var(--a-text)' : 'var(--a-text-2)',
                boxShadow: isActive ? 'inset 0 0 0 1px var(--a-border)' : 'none',
                fontWeight: isActive ? 500 : 400,
              })}
            >
              <span style={{ color: location.pathname === l.to ? 'var(--a-accent)' : 'var(--a-text-3)' }}>
                <Icon name={l.icon} size={16} />
              </span>
              <span className="flex-1">{l.label}</span>
              {l.badge && unreadCount > 0 && (
                <span
                  className="num flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold"
                  style={{ background: 'var(--a-danger)', color: '#fff' }}
                  aria-label={`${unreadCount} mensajes sin leer`}
                >
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-3" style={{ borderColor: 'var(--a-border)' }}>
          <Link
            to="/"
            className="flex h-9 items-center gap-2.5 rounded-md px-2.5 text-[13px] transition-colors duration-150"
            style={{ color: 'var(--a-text-2)' }}
          >
            <Icon name="external" size={16} />
            <span className="flex-1">Ver tienda</span>
          </Link>
          <p className="ds-eyebrow mt-3 px-2.5">Panel v1.0</p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-[248px]">
        <header
          className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b px-4 backdrop-blur-xl sm:px-6"
          style={{ borderColor: 'var(--a-border)', background: 'color-mix(in srgb, var(--a-canvas) 88%, transparent)' }}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
            className="ds-btn ds-btn-ghost !h-8 !w-8 !p-0 lg:hidden"
          >
            <Icon name="menu" size={18} />
          </button>
          <nav aria-label="Ruta de navegación" className="flex min-w-0 items-center gap-2 text-[13px]">
            <span style={{ color: 'var(--a-text-3)' }}>Admin</span>
            <span style={{ color: 'var(--a-border-strong)' }} aria-hidden>/</span>
            <span className="truncate font-medium" style={{ color: 'var(--a-text)' }} aria-current="page">
              {activeLabel}
            </span>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden h-1.5 w-1.5 rounded-full sm:block" style={{ background: 'var(--a-success)' }} aria-hidden />
            <span className="hidden text-[11px] sm:block" style={{ color: 'var(--a-text-3)' }}>Sistema operativo</span>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
