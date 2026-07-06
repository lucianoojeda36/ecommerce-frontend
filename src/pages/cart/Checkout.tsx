import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart, useCreateOrder, useCreatePreference, useAddresses } from '../../api/hooks'
import Loading from '../../components/Loading'
import type { Order } from '../../types'

export default function Checkout() {
  const { data: cart, isLoading: cartLoading } = useCart()
  const { data: addresses } = useAddresses()
  const createOrder = useCreateOrder()
  const createPreference = useCreatePreference()
  const navigate = useNavigate()

  const [selectedAddress, setSelectedAddress] = useState<string>('new')
  const [form, setForm] = useState({
    label: '', street: '', number: '', complement: '',
    neighborhood: '', city: '', state: '', zip_code: '', country: 'Argentina',
  })
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)

  if (cartLoading) return <Loading />

  const items = cart?.items || []
  const total = cart?.total || 0

  if (items.length === 0 && !isCheckingOut) {
    navigate('/cart')
    return null
  }

  const getAddressData = () => {
    if (selectedAddress !== 'new' && addresses) {
      const addr = addresses.find(a => a.id === selectedAddress)
      if (addr) return addr
    }
    return form
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsCheckingOut(true)

    let orderWasCreated = false
    try {
      const shipping_address = getAddressData()
      const { data: order } = await createOrder.mutateAsync({ shipping_address, notes })
      orderWasCreated = true
      setCreatedOrder(order)

      const { data: payment } = await createPreference.mutateAsync(order.id)

      const redirectUrl = import.meta.env.DEV ? payment.sandbox_init_point : payment.init_point
      if (redirectUrl) {
        window.location.href = redirectUrl
      }
    } catch (err: any) {
      console.error('Checkout error details:', err)
      const errorMsg = err.response?.data?.error ||
        err.message ||
        'Error al procesar el pedido. Por favor, inténtalo de nuevo.'
      setError(errorMsg)
      // If the order was already created, the cart is already empty on the
      // backend — leave isCheckingOut true so we don't bounce to /cart and
      // let the user resubmit (which would create a duplicate order).
      if (!orderWasCreated) {
        setIsCheckingOut(false)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-4">
          {error}
          {createdOrder && (
            <>
              {' '}Tu pedido fue creado. Podés verlo en{' '}
              <Link to={`/orders/${createdOrder.id}`} className="underline font-medium">
                tus pedidos
              </Link>.
            </>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Dirección de Envío</h2>

              {addresses && addresses.length > 0 && (
                <div className="mb-4 space-y-2">
                  {addresses.map((addr) => (
                    <label key={addr.id} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id!)}
                      />
                      <div>
                        <p className="font-medium">{addr.label || 'Dirección'}</p>
                        <p className="text-sm text-gray-500">
                          {addr.street} {addr.number}, {addr.city}, {addr.state}
                        </p>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="address"
                      value="new"
                      checked={selectedAddress === 'new'}
                      onChange={() => setSelectedAddress('new')}
                    />
                    <span className="text-sm font-medium">Nueva dirección</span>
                  </label>
                </div>
              )}

              {selectedAddress === 'new' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <input placeholder="Etiqueta (ej: Casa, Trabajo)" value={form.label}
                      onChange={e => setForm({ ...form, label: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
                  </div>
                  <div className="col-span-2">
                    <input placeholder="Calle" required value={form.street}
                      onChange={e => setForm({ ...form, street: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
                  </div>
                  <input placeholder="Número" value={form.number}
                    onChange={e => setForm({ ...form, number: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
                  <input placeholder="Complemento" value={form.complement}
                    onChange={e => setForm({ ...form, complement: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
                  <input placeholder="Barrio" value={form.neighborhood}
                    onChange={e => setForm({ ...form, neighborhood: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
                  <input placeholder="Ciudad" required value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
                  <input placeholder="Provincia" required value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
                  <input placeholder="Código Postal" value={form.zip_code}
                    onChange={e => setForm({ ...form, zip_code: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
                  <input placeholder="País" value={form.country}
                    onChange={e => setForm({ ...form, country: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
                </div>
              )}
            </div>

            <div className="p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Notas</h2>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Alguna nota para tu pedido..."
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }}
              />
            </div>
          </div>

          <div>
            <div className="p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Resumen</h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate mr-2">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  ${total.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={createOrder.isPending || createPreference.isPending || !!createdOrder}
                className="w-full mt-6 py-3 rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {createOrder.isPending ? 'Creando pedido...' : createPreference.isPending ? 'Redirigiendo a Mercado Pago...' : 'Ir a Pagar'}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Pagá con Mercado Pago (tarjeta, transferencia, efectivo)
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
