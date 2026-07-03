import { Link, useNavigate } from 'react-router-dom'
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '../../api/hooks'
import Loading from '../../components/Loading'

export default function Cart() {
  const { data, isLoading } = useCart()
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()
  const clearCart = useClearCart()
  const navigate = useNavigate()

  if (isLoading) return <Loading />

  const items = data?.items || []
  const total = data?.total || 0

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-6">Agrega productos para comenzar</p>
        <Link
          to="/products"
          className="px-6 py-3 rounded-lg text-white font-semibold transition hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Ver Productos
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Carrito ({items.length} items)</h1>
        <button
          onClick={() => clearCart.mutate()}
          className="text-sm text-red-500 hover:text-red-700 transition"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {item.images?.[0] ? (
                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin img</div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link to={`/products/${item.slug}`} className="font-semibold text-gray-900 hover:underline">
                {item.name}
              </Link>
              <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                ${Number(item.price).toLocaleString()} c/u
              </p>
            </div>

            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => item.quantity > 1 && updateItem.mutate({ id: item.id, quantity: item.quantity - 1 })}
                className="px-3 py-1 hover:bg-gray-100 transition"
              >
                -
              </button>
              <span className="px-4 py-1 font-medium">{item.quantity}</span>
              <button
                onClick={() => item.quantity < item.stock && updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                className="px-3 py-1 hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>

            <div className="text-right min-w-[100px]">
              <p className="font-bold">${(item.price * item.quantity).toLocaleString()}</p>
            </div>

            <button
              onClick={() => removeItem.mutate(item.id)}
              className="text-red-400 hover:text-red-600 transition p-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
            ${total.toLocaleString()}
          </span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3 rounded-lg text-white font-semibold transition hover:opacity-90"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Ir al Checkout
        </button>
      </div>
    </div>
  )
}
