import { useState } from 'react'
import { useStoreSettings, useSendContactMessage } from '../../api/hooks'

export default function Contact() {
  const { data: settings } = useStoreSettings()
  const sendMessage = useSendContactMessage()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage.mutate(form, {
      onSuccess: () => {
        setSent(true)
        setForm({ name: '', email: '', subject: '', message: '' })
      },
    })
  }

  const socialLinks = settings?.social_links || {}
  const socialEntries = Object.entries(socialLinks).filter(([, url]) => url)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>Contacto</h1>
        <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          ¿Tenés una consulta? Escribinos y te respondemos a la brevedad.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario */}
        <div className="lg:col-span-2">
          <div className="rounded-xl p-6 sm:p-8" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            {sent ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `color-mix(in srgb, var(--color-success) 12%, transparent)` }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" style={{ color: 'var(--color-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>¡Mensaje enviado!</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Te responderemos lo antes posible.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}>
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Nombre</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                      style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                      style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Asunto</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                    style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                    placeholder="¿Sobre qué consultás?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>Mensaje</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all resize-none"
                    style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                    placeholder="Escribí tu mensaje acá..."
                  />
                </div>
                {sendMessage.isError && (
                  <p className="text-sm" style={{ color: 'var(--color-danger)' }}>
                    {(sendMessage.error as any)?.response?.data?.error || 'Error al enviar el mensaje. Intentá de nuevo.'}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sendMessage.isPending}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-primary)' }}>
                  {sendMessage.isPending ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Info de contacto */}
        <div className="space-y-5">
          <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>Información de contacto</h2>
            <div className="space-y-4">
              {settings?.contact_email && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `color-mix(in srgb, var(--color-primary) 10%, transparent)` }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Email</p>
                    <a href={`mailto:${settings.contact_email}`} className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                      {settings.contact_email}
                    </a>
                  </div>
                </div>
              )}

              {settings?.contact_phone && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `color-mix(in srgb, var(--color-primary) 10%, transparent)` }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Teléfono</p>
                    <a href={`tel:${settings.contact_phone}`} className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
                      {settings.contact_phone}
                    </a>
                  </div>
                </div>
              )}

              {settings?.address && (
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `color-mix(in srgb, var(--color-primary) 10%, transparent)` }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: 'var(--color-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide mb-0.5" style={{ color: 'var(--color-text-muted)' }}>Dirección</p>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{settings.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {socialEntries.length > 0 && (
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>Redes sociales</h2>
              <div className="flex flex-wrap gap-3">
                {socialEntries.map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                    style={{ backgroundColor: `color-mix(in srgb, var(--color-primary) 10%, transparent)`, color: 'var(--color-primary)' }}>
                    {platform}
                  </a>
                ))}
              </div>
            </div>
          )}

          {settings?.about_us && (
            <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-text)' }}>Sobre nosotros</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{settings.about_us}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
