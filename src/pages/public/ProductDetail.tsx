import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProduct, useAddToCart, useCart } from '../../api/hooks'
import { useAuth } from '../../context/AuthContext'
import Loading from '../../components/Loading'

export default function ProductDetail() {
  const { slug } = useParams()
  const { data: product, isLoading } = useProduct(slug!)
  const { user } = useAuth()
  const addToCart = useAddToCart()
  const { data: cart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [imgIndex, setImgIndex] = useState(0)
  const [added, setAdded] = useState(false)

  if (isLoading) return <Loading />
  if (!product) return <p className="text-center py-12 text-gray-500">Producto no encontrado</p>

  const inCart = cart?.items?.find(i => i.product_id === product.id)
  const maxStock = Math.min(product.stock, 99)
  const stockMessage = product.stock <= 5 && product.stock > 0
    ? `Solo quedan ${product.stock} unidades`
    : product.stock === 0
      ? 'Producto agotado'
      : null

  const handleAdd = () => {
    if (!user) return
    addToCart.mutate({ product_id: product.id, quantity }, {
      onSuccess: () => {
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
      },
    })
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 py-8">
      <div>
        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
          {product.images?.[imgIndex] ? (
            <img src={product.images[imgIndex]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
          )}
        </div>
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIndex(i)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${i === imgIndex ? '' : 'border-transparent opacity-60'}`}
                style={i === imgIndex ? { borderColor: 'var(--color-primary)' } : {}}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-500 mb-1">{product.category_name}</p>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

        <div className="flex items-baseline gap-3 mb-6">
          <span className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
            ${Number(product.price).toLocaleString()}
          </span>
          {product.compare_price && (
            <span className="text-lg text-gray-400 line-through">
              ${Number(product.compare_price).toLocaleString()}
            </span>
          )}
        </div>

        {stockMessage && (
          <p className={`text-sm font-medium mb-4 ${product.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
            {stockMessage}
          </p>
        )}

        <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

        {user ? (
          product.stock > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={addToCart.isPending}
                className="flex-1 py-3 rounded-lg text-white font-semibold transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: added ? '#10B981' : 'var(--color-primary)' }}
              >
                {added ? '✓ Agregado' : addToCart.isPending ? 'Agregando...' : 'Agregar al Carrito'}
              </button>
            </div>
          )
        ) : (
          <div className="p-4 rounded-lg bg-blue-50 text-blue-700 text-sm">
            <Link to="/login" className="font-semibold underline">Inicia sesión</Link> para agregar al carrito
          </div>
        )}

        {inCart && (
          <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: '#f0fdf4' }}>
            <p className="text-green-700 text-sm">
              Ya tienes {inCart.quantity} unidades en tu <Link to="/cart" className="font-semibold underline">carrito</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
