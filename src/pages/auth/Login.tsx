import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'No pudimos iniciar tu sesión')
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-[400px]">
        <div className="mb-7 text-center">
          <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-[14px] font-semibold text-white" style={{ background: 'var(--color-text)' }}>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>          </span>
          <p className="ds-eyebrow mt-5">Bienvenido de nuevo</p>
          <h1 className="mt-1.5 text-[26px] font-semibold tracking-[-0.04em]" style={{ color: 'var(--color-text)' }}>Ingresá a tu cuenta</h1>
          <p className="mt-2 text-[13px]" style={{ color: 'var(--color-text-secondary)' }}>Continuá donde lo dejaste.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border p-6 sm:p-7" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-card)', boxShadow: 'var(--shadow-lg)' }}>
          {error && (
            <div role="alert" className="mb-5 flex items-start gap-2 rounded-md px-3 py-2.5 text-[12px]" style={{ background: 'color-mix(in srgb, var(--color-danger) 10%, transparent)', color: 'var(--color-danger)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className="mt-px shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5h.01" /></svg>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="ds-eyebrow mb-1.5 block normal-case tracking-normal">Email</label>
              <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vos@ejemplo.com" required className="!h-10" />
            </div>
            <div>
              <label htmlFor="password" className="ds-eyebrow mb-1.5 block normal-case tracking-normal">Contraseña</label>
              <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="!h-10" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="ds-btn ds-btn-accent mt-6 h-10 w-full !text-[13px]">
            {loading ? 'Ingresando…' : 'Ingresar'}
            {!loading && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-[12px]" style={{ color: 'var(--color-text-secondary)' }}>
          ¿No tenés cuenta?{' '}
          <Link to="/register" className="font-medium" style={{ color: 'var(--color-primary)' }}>Crear una cuenta</Link>
        </p>
      </div>
    </div>
  )
}
