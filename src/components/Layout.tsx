import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useStoreSettings, useCart } from '../api/hooks'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { data: settings } = useStoreSettings()
  const { data: cart } = useCart()
  const { theme, toggleTheme, settings: themeSettings } = useTheme()

  const cartCount = cart?.items?.reduce((a, b) => a + b.quantity, 0) || 0

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <nav className="sticky top-0 z-50 backdrop-blur-lg" style={{ backgroundColor: `color-mix(in srgb, var(--color-bg-card) 85%, transparent)`, borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight" style={{ color: themeSettings.primary_color }}>
            {settings?.store_logo ? (
              <img src={settings.store_logo} alt={settings.store_name} className="h-8" />
            ) : (
              <>{settings?.store_name || 'Mi Tienda'}</>
            )}
          </Link>

          <div className="flex items-center gap-1">
            <Link to="/products" className="px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
              Productos
            </Link>

            <Link to="/cart" className="relative px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121 0 2.09-.773 2.34-1.872l1.836-8.046A1.125 1.125 0 0018.054 3H5.106m2.394 11.25l-1.5-6h13.5" />
                </svg>
                Carrito
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 right-0 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1" style={{ backgroundColor: themeSettings.primary_color }}>
                    {cartCount}
                  </span>
                )}
              </span>
            </Link>

            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
              title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}>
              {theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" style={{ color: 'var(--color-text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              )}
            </button>

            <div className="w-px h-6 mx-1" style={{ backgroundColor: 'var(--color-border)' }} />

            {user ? (
              <div className="flex items-center gap-1">
                {user.role === 'admin' && (
                  <Link to="/admin" className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ color: themeSettings.primary_color, backgroundColor: `color-mix(in srgb, ${themeSettings.primary_color} 8%, transparent)` }}>
                    Admin
                  </Link>
                )}
                <Link to="/orders" className="px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
                  Mis Órdenes
                </Link>
                <button onClick={() => { logout(); navigate('/') }}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{ color: 'var(--color-danger)' }}>
                  Salir
                </button>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-secondary)' }}>
                  {user.name}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-2 rounded-lg text-sm font-medium transition-colors" style={{ color: 'var(--color-text-secondary)' }}>
                  Ingresar
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md"
                  style={{ backgroundColor: themeSettings.primary_color }}>
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      <footer className="py-8 text-center text-sm" style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} {settings?.store_name || 'Mi Tienda'} — Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  )
}
