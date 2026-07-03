import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAddresses, useCreateAddress, useDeleteAddress } from '../../api/hooks'
import Loading from '../../components/Loading'

export default function Profile() {
  const { user } = useAuth()
  const { data: addresses, isLoading } = useAddresses()
  const createAddress = useCreateAddress()
  const deleteAddress = useDeleteAddress()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    label: '', street: '', number: '', complement: '',
    neighborhood: '', city: '', state: '', zip_code: '', country: 'Argentina',
  })

  if (isLoading) return <Loading />

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createAddress.mutate(form, {
      onSuccess: () => {
        setShowForm(false)
        setForm({ label: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zip_code: '', country: 'Argentina' })
      },
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      <div className="p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4">Datos Personales</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500">Nombre</label>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Email</label>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Rol</label>
            <p className="font-medium capitalize">{user?.role === 'admin' ? 'Administrador' : 'Cliente'}</p>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Mis Direcciones</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium transition hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {showForm ? 'Cancelar' : 'Agregar Dirección'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-lg bg-gray-50">
            <div className="col-span-2">
              <input placeholder="Etiqueta (Casa, Trabajo)" value={form.label}
                onChange={e => setForm({ ...form, label: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            </div>
            <div className="col-span-2">
              <input placeholder="Calle" required value={form.street}
                onChange={e => setForm({ ...form, street: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            </div>
            <input placeholder="Número" value={form.number}
              onChange={e => setForm({ ...form, number: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            <input placeholder="Ciudad" required value={form.city}
              onChange={e => setForm({ ...form, city: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            <input placeholder="Provincia" required value={form.state}
              onChange={e => setForm({ ...form, state: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            <input placeholder="Código Postal" value={form.zip_code}
              onChange={e => setForm({ ...form, zip_code: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            <button type="submit" disabled={createAddress.isPending}
              className="col-span-2 py-3 rounded-lg text-white font-semibold hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary)' }}>
              {createAddress.isPending ? 'Guardando...' : 'Guardar Dirección'}
            </button>
          </form>
        )}

        <div className="space-y-3">
          {addresses?.map((addr) => (
            <div key={addr.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
              <div>
                {addr.label && <p className="font-medium text-sm">{addr.label}</p>}
                <p className="text-sm text-gray-600">
                  {addr.street} {addr.number}, {addr.city}, {addr.state}
                </p>
              </div>
              <button
                onClick={() => deleteAddress.mutate(addr.id!)}
                className="text-red-400 hover:text-red-600 transition text-sm"
              >
                Eliminar
              </button>
            </div>
          ))}
          {(!addresses || addresses.length === 0) && (
            <p className="text-gray-500 text-sm">No tienes direcciones guardadas</p>
          )}
        </div>
      </div>
    </div>
  )
}
