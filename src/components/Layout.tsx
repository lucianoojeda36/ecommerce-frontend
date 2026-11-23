import { useState, useEffect } from 'react'
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useFavoritesContext } from '../context/FavoritesContext'
import { useStoreSettings, useCart, useUnreadCount } from '../api/hooks'

type IconName = 'sun' | 'moon' | 'bell' | 'cart' | 'heart' | 'menu' | 'close' | 'arrow' | 'logout' | 'user' | 'box'

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></>,
    moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></>,
    cart: <><path d="M2.25 3h1.4l.4 1.4M5 7h13l-1.3 8.4a2 2 0 0 1-2 1.6H7.3a2 2 0 0 1-2-1.6L4 4" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.4 1.1-1.1a5.5 5.5 0 0 0 0-7.9Z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="M18 6 6 18M6 6l12 12" />,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    box: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 8 9 5 9-5v8l-9 5-9-5V8Z" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {paths[name]}
    </svg>
  )
}

const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
  color: isActive ? 'var(--color-text)' : 'var(--color-text-secondary)',
  background: isActive ? 'var(--color-bg-surface)' : 'transparent',
  boxShadow: isActive ? 'inset 0 0 0 1px var(--color-border)' : 'none',
})

function IconButton({ label, onClick, children, active }: { label: string; onClick: () => void; children: React.ReactNode; active?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150 hover:bg-[var(--color-bg-surface)]"
      style={{ color: active ? 'var(--color-primary)' : 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
    >
      {children}
    </button>
  )
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { data: settings } = useStoreSettings()
  const { data: cart } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { data: unreadCount = 0 } = useUnreadCount()
  const { count: favoritesCount } = useFavoritesContext()
  const [menuOpen, setMenuOpen] = useState(false)

  const cartCount = cart?.items?.reduce((a, b) => a + b.quantity, 0) || 0
  const brand = settings?.primary_color || 'var(--color-primary)'
  const storeName = settings?.store_name || 'Mi Tienda'
  const initials = storeName.trim().charAt(0).toUpperCase()

  useEffect(() => setMenuOpen(false), [location.pathname])

  const navItems = [
    { to: '/products', label: 'Productos' },
    { to: '/favoritos', label: 'Favoritos' },
    { to: '/contacto', label: 'Contacto' },
  ]

  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--color-bg)' }}>
      <header className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ borderColor: 'var(--color-border)', background: 'color-mix(in srgb, var(--color-bg) 86%, transparent)' }}>
        <div className="mx-auto flex h-[60px] max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            {settings?.store_logo ? (
              <img src={settings.store_logo} alt={storeName} className="h-7 w-auto object-contain" />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-semibold text-white" style={{ background: 'var(--color-text)' }}>
                {initials}
              </span>
            )}
            <span className="text-[14px] font-semibold tracking-[-0.02em]" style={{ color: 'var(--color-text)' }}>{storeName}</span>
          </Link>

          <nav aria-label="Navegación principal" className="ml-4 hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-150" style={navLinkStyle}>
                {item.label}
              </NavLink>
            ))}
            {user?.role === 'admin' && (
              <NavLink to="/admin" className="rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors duration-150" style={navLinkStyle}>
                Admin
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <IconButton label="Favoritos" onClick={() => navigate('/favoritos')}>
              <span className="relative flex items-center">
                <Icon name="heart" />
                {favoritesCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold text-white" style={{ background: brand }}>
                    {favoritesCount}
                  </span>
                )}
              </span>
            </IconButton>
            <IconButton label="Carrito" onClick={() => navigate('/cart')}>
              <span className="relative flex items-center">
                <Icon name="cart" />
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold text-white" style={{ background: brand }}>
                    {cartCount}
                  </span>
                )}
              </span>
            </IconButton>
            <IconButton label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'} onClick={toggleTheme}>
              <Icon name={theme === 'light' ? 'moon' : 'sun'} />
            </IconButton>
            {user && (
              <IconButton label="Mensajes" onClick={() => navigate(user.role === 'admin' ? '/admin/orders' : '/orders')} active={unreadCount > 0}>
                <span className="relative flex items-center">
                  <Icon name="bell" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-semibold text-white" style={{ background: 'var(--color-danger)' }}>
                      {unreadCount}
                    </span>
                  )}
                </span>
              </IconButton>
            )}

            <div className="mx-1 hidden h-5 w-px md:block" style={{ background: 'var(--color-border)' }} />

            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/profile" className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[12px] font-medium transition-colors hover:bg-[var(--color-bg-surface)]" style={{ color: 'var(--color-text-secondary)' }}>
                  <Icon name="user" size={16} />
                  <span className="max-w-[110px] truncate">{user.name}</span>
                </Link>
                <button type="button" onClick={() => { logout(); navigate('/') }} className="ds-btn ds-btn-ghost !h-9 !px-2.5" style={{ color: 'var(--color-text-muted)' }} title="Cerrar sesión" aria-label="Cerrar sesión">
                  <Icon name="logout" size={16} />
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/login" className="ds-btn ds-btn-ghost">Ingresar</Link>
                <Link to="/register" className="ds-btn ds-btn-accent">Crear cuenta</Link>
              </div>
            )}

            <IconButton label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} onClick={() => setMenuOpen(v => !v)}>
              <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
            </IconButton>
          </div>
        </div>

        {menuOpen && (
          <div className="animate-fade-in border-t md:hidden" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}>
            <nav aria-label="Navegación móvil" className="mx-auto max-w-7xl space-y-1 px-4 py-3">
              {[{ to: '/', label: 'Inicio' }, ...navItems].map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className="block rounded-md px-3 py-2.5 text-[13px] font-medium transition-colors" style={navLinkStyle}>
                  {item.label}
                </NavLink>
              ))}
              <div className="my-2 h-px" style={{ background: 'var(--color-border)' }} />
              {user ? (
                <>
                  <NavLink to="/profile" className="block rounded-md px-3 py-2.5 text-[13px]" style={navLinkStyle}>Mi perfil</NavLink>
                  {user.role !== 'admin' && <NavLink to="/orders" className="block rounded-md px-3 py-2.5 text-[13px]" style={navLinkStyle}>Mis órdenes</NavLink>}
                  {user.role === 'admin' && <NavLink to="/admin" className="block rounded-md px-3 py-2.5 text-[13px]" style={navLinkStyle}>Panel admin</NavLink>}
                  <button type="button" onClick={() => { logout(); navigate('/'); setMenuOpen(false) }} className="block w-full rounded-md px-3 py-2.5 text-left text-[13px]" style={{ color: 'var(--color-danger)' }}>
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link to="/login" className="ds-btn ds-btn-outline">Ingresar</Link>
                  <Link to="/register" className="ds-btn ds-btn-accent">Crear cuenta</Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="mt-auto border-t" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)' }}>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md text-[12px] font-semibold text-white" style={{ background: 'var(--color-text)' }}>{initials}</span>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text)' }}>{storeName}</span>
            </div>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              {settings?.store_description || 'Productos seleccionados, envío rápido y atención personalizada.'}
            </p>
          </div>
          <div>
            <p className="ds-eyebrow">Tienda</p>
            <ul className="mt-3 space-y-2 text-[13px]">
              <li><Link to="/products" className="transition-colors hover:text-[var(--color-text)]" style={{ color: 'var(--color-text-secondary)' }}>Catálogo</Link></li>
              <li><Link to="/products?promo=1" className="transition-colors hover:text-[var(--color-text)]" style={{ color: 'var(--color-text-secondary)' }}>Ofertas</Link></li>
              <li><Link to="/favoritos" className="transition-colors hover:text-[var(--color-text)]" style={{ color: 'var(--color-text-secondary)' }}>Favoritos</Link></li>
              <li><Link to="/contacto" className="transition-colors hover:text-[var(--color-text)]" style={{ color: 'var(--color-text-secondary)' }}>Contacto</Link></li>
              <li><Link to="/cart" className="transition-colors hover:text-[var(--color-text)]" style={{ color: 'var(--color-text-secondary)' }}>Carrito</Link></li>
            </ul>
          </div>
          <div>
            <p className="ds-eyebrow">Contacto</p>
            <ul className="mt-3 space-y-2 text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>
              {settings?.contact_email && <li>{settings.contact_email}</li>}
              {settings?.contact_phone && <li>{settings.contact_phone}</li>}
              {settings?.address && <li>{settings.address}</li>}
              {!settings?.contact_email && !settings?.contact_phone && !settings?.address && <li>Escribinos desde contacto</li>}
            </ul>
          </div>
        </div>
        <div className="border-t py-4 text-center text-[11px]" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
          © {new Date().getFullYear()} {storeName} — Todos los derechos reservados
        </div>
      </footer>
    </div>
  )
}
