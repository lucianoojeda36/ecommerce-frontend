import { Outlet, NavLink } from 'react-router-dom'
import { useStoreSettings } from '../../api/hooks'

export default function AdminLayout() {
  const { data: settings } = useStoreSettings()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded-lg text-sm transition ${isActive ? 'text-white' : 'text-gray-600 hover:bg-gray-100'}`

  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive ? { backgroundColor: 'var(--color-primary)' } : {}

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <p className="text-sm text-gray-500">{settings?.store_name || 'Mi Tienda'}</p>
      </div>

      <div className="flex gap-8">
        <nav className="w-48 shrink-0 space-y-2">
          <NavLink to="/admin" end className={linkClass} style={linkStyle}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={linkClass} style={linkStyle}>Productos</NavLink>
          <NavLink to="/admin/orders" className={linkClass} style={linkStyle}>Órdenes</NavLink>
          <NavLink to="/admin/settings" className={linkClass} style={linkStyle}>Configuración</NavLink>
        </nav>

        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
