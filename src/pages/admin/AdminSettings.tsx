import { useState, useEffect } from 'react'
import { useStoreSettings, useUpdateSettings } from '../../api/hooks'
import Loading from '../../components/Loading'
import { useTheme } from '../../context/ThemeContext'

const FONTS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Nunito', 'Raleway', 'Work Sans', 'DM Sans']

export default function AdminSettings() {
  const { data: settings, isLoading } = useStoreSettings()
  const updateSettings = useUpdateSettings()
  const { theme, toggleTheme } = useTheme()

  const [form, setForm] = useState({
    store_name: '', store_description: '', store_logo: '', store_favicon: '',
    primary_color: '#3B82F6', secondary_color: '#1E40AF',
    about_us: '', contact_email: '', contact_phone: '', address: '',
    seo_title: '', seo_description: '', currency: 'ARS',
    social_links: {} as Record<string, string>,
    font_family: 'Inter',
  })

  useEffect(() => {
    if (settings) {
      setForm({
        store_name: settings.store_name || '',
        store_description: settings.store_description || '',
        store_logo: settings.store_logo || '',
        store_favicon: settings.store_favicon || '',
        primary_color: settings.primary_color || '#3B82F6',
        secondary_color: settings.secondary_color || '#1E40AF',
        about_us: settings.about_us || '',
        contact_email: settings.contact_email || '',
        contact_phone: settings.contact_phone || '',
        address: settings.address || '',
        seo_title: settings.seo_title || '',
        seo_description: settings.seo_description || '',
        currency: settings.currency || 'ARS',
        social_links: settings.social_links || {},
        font_family: (settings as any).font_family || 'Inter',
      })
    }
  }, [settings])

  if (isLoading) return <Loading />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings.mutate(form)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-bold">Configuración Visual</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Theme toggle */}
        <div className="p-6 rounded-xl shadow-sm space-y-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
            Modo de Apariencia
          </h3>
          <div className="flex gap-3">
            <button type="button" onClick={() => theme === 'dark' && toggleTheme()}
              className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
              <span className="text-sm font-medium">Claro</span>
            </button>
            <button type="button" onClick={() => theme === 'light' && toggleTheme()}
              className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${theme === 'dark' ? 'border-blue-500 bg-blue-900/30' : 'border-gray-200 hover:border-gray-300'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
              <span className="text-sm font-medium">Oscuro</span>
            </button>
          </div>
        </div>

        {/* Colors & Font */}
        <div className="p-6 rounded-xl shadow-sm space-y-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
            </svg>
            Colores y Tipografía
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Primario</label>
              <div className="flex gap-2">
                <input type="color" value={form.primary_color}
                  onChange={e => setForm({ ...form, primary_color: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border" />
                <input value={form.primary_color}
                  onChange={e => setForm({ ...form, primary_color: e.target.value })}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Secundario</label>
              <div className="flex gap-2">
                <input type="color" value={form.secondary_color}
                  onChange={e => setForm({ ...form, secondary_color: e.target.value })}
                  className="w-12 h-10 rounded cursor-pointer border" />
                <input value={form.secondary_color}
                  onChange={e => setForm({ ...form, secondary_color: e.target.value })}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuente</label>
            <select value={form.font_family}
              onChange={e => setForm({ ...form, font_family: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }}>
              {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <p className="text-xs text-gray-400 mt-1">Vista previa: <span style={{ fontFamily: `'${form.font_family}'` }}>Texto de ejemplo — {form.font_family}</span></p>
          </div>
        </div>

        {/* General */}
        <div className="p-6 rounded-xl shadow-sm space-y-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold">Información General</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la tienda</label>
            <input value={form.store_name}
              onChange={e => setForm({ ...form, store_name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea value={form.store_description}
              onChange={e => setForm({ ...form, store_description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL del Logo</label>
              <input value={form.store_logo}
                onChange={e => setForm({ ...form, store_logo: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL del Favicon</label>
              <input value={form.store_favicon}
                onChange={e => setForm({ ...form, store_favicon: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
            <select value={form.currency}
              onChange={e => setForm({ ...form, currency: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }}>
              <option value="ARS">ARS ($)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        {/* Contact */}
        <div className="p-6 rounded-xl shadow-sm space-y-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold">Contacto</h3>

          <div className="grid grid-cols-2 gap-4">
            <input value={form.contact_email} placeholder="Email de contacto"
              onChange={e => setForm({ ...form, contact_email: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            <input value={form.contact_phone} placeholder="Teléfono"
              onChange={e => setForm({ ...form, contact_phone: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
          </div>

          <textarea value={form.address} placeholder="Dirección física"
            onChange={e => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} rows={2} />

          <textarea value={form.about_us} placeholder="Sobre nosotros"
            onChange={e => setForm({ ...form, about_us: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} rows={4} />
        </div>

        {/* SEO */}
        <div className="p-6 rounded-xl shadow-sm space-y-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="font-semibold">SEO</h3>

          <input value={form.seo_title} placeholder="Título SEO"
            onChange={e => setForm({ ...form, seo_title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />

          <textarea value={form.seo_description} placeholder="Descripción SEO"
            onChange={e => setForm({ ...form, seo_description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} rows={2} />
        </div>

        <button type="submit" disabled={updateSettings.isPending}
          className="px-8 py-3 rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)' }}>
          {updateSettings.isPending ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </form>
    </div>
  )
}
