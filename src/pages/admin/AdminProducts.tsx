import { useState } from 'react'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useUploadImages, useCategories, useCreateCategory, useUploadCategoryImage } from '../../api/hooks'
import Loading from '../../components/Loading'
import FileInput from '../../components/FileInput'

export default function AdminProducts() {
  const { data, isLoading } = useProducts({ page: 1 })
  const { data: categories } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const uploadImages = useUploadImages()
  const createCategory = useCreateCategory()
  const uploadCategoryImage = useUploadCategoryImage()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [form, setForm] = useState({
    name: '', description: '', price: 0, compare_price: 0,
    stock: 0, category_id: '', is_active: true,
  })
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [categoryImage, setCategoryImage] = useState<File | null>(null)

  if (isLoading) return <Loading />

  const resetForm = () => {
    setForm({ name: '', description: '', price: 0, compare_price: 0, stock: 0, category_id: '', is_active: true })
    setUploadFiles([])
  }

  const handleEdit = (product: any) => {
    setEditingId(product.id)
    setForm({
      name: product.name, description: product.description || '',
      price: Number(product.price), compare_price: Number(product.compare_price || 0),
      stock: product.stock, category_id: product.category_id || '', is_active: product.is_active,
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...form,
      price: Number(form.price),
      compare_price: form.compare_price > 0 ? Number(form.compare_price) : undefined,
      category_id: form.category_id || undefined,
    }

    if (editingId) {
      updateProduct.mutate({ id: editingId, data }, {
        onSuccess: () => { setEditingId(null); resetForm() },
      })
    } else {
      createProduct.mutate(data, {
        onSuccess: (res: any) => {
          const newId = res.data.id
          if (uploadFiles.length > 0) {
            uploadImages.mutate({ id: newId, files: uploadFiles })
            setUploadFiles([])
          }
          setEditingId(newId)
        },
      })
    }
  }

  const handleUpload = (productId: string) => {
    if (uploadFiles.length === 0) return
    uploadImages.mutate({ id: productId, files: uploadFiles }, { onSuccess: () => setUploadFiles([]) })
  }

  const handleNewCategory = (e: React.FormEvent) => {
    e.preventDefault()
    createCategory.mutate({ name: newCatName }, {
      onSuccess: (res: any) => {
        if (categoryImage) {
          uploadCategoryImage.mutate({ id: res.data.id, file: categoryImage })
          setCategoryImage(null)
        }
        setShowNewCat(false)
        setNewCatName('')
      },
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Productos</h2>
        <div className="flex gap-2">
          <button onClick={() => setShowNewCat(!showNewCat)}
            className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50 transition">
            {showNewCat ? 'Cancelar' : '+ Categoría'}
          </button>
          <button onClick={() => { setShowNew(!showNew); setEditingId(null); resetForm() }}
            className="px-4 py-2 rounded-lg text-white text-sm font-medium transition hover:opacity-90"
            style={{ backgroundColor: 'var(--color-primary)' }}>
            + Nuevo Producto
          </button>
        </div>
      </div>

      {showNewCat && (
        <form onSubmit={handleNewCategory} className="p-4 rounded-xl border space-y-3 mb-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex gap-2">
            <input value={newCatName} onChange={e => setNewCatName(e.target.value)}
              placeholder="Nombre de la categoría" required
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            <button type="submit" className="px-4 py-2 rounded-lg text-white text-sm" style={{ backgroundColor: 'var(--color-primary)' }}>
              Crear
            </button>
          </div>
          <FileInput
            label="Imagen de la categoría"
            files={categoryImage ? [categoryImage] : []}
            onChange={f => setCategoryImage(f[0] || null)}
          />
        </form>
      )}

      {(showNew || editingId) && (
        <form onSubmit={handleSave} className="p-6 rounded-xl border border-gray-100 shadow-sm mb-6 space-y-4">
          <h3 className="font-semibold">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <input placeholder="Nombre" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            </div>
            <div className="col-span-2">
              <textarea placeholder="Descripción" value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} rows={3} />
            </div>
            <input type="number" placeholder="Precio" required value={form.price || ''}
              onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
              className="px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            <input type="number" placeholder="Precio comparativa" value={form.compare_price || ''}
              onChange={e => setForm({ ...form, compare_price: parseFloat(e.target.value) || 0 })}
              className="px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            <input type="number" placeholder="Stock" required value={form.stock}
              onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
              className="px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }} />
            <select value={form.category_id}
              onChange={e => setForm({ ...form, category_id: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:outline-none" style={{ borderColor: '#d1d5db' }}>
              <option value="">Sin categoría</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <FileInput
            multiple
            label="Imágenes del producto"
            files={uploadFiles}
            onChange={setUploadFiles}
          />
          {editingId && uploadFiles.length > 0 && (
            <button type="button" onClick={() => handleUpload(editingId)}
              className="px-4 py-2 rounded-lg text-sm text-white transition hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}>
              Subir ({uploadFiles.length})
            </button>
          )}
          {!editingId && uploadFiles.length > 0 && (
            <p className="text-xs text-gray-500">Se subirán al crear el producto</p>
          )}

          <div className="flex gap-3">
            <button type="submit"
              className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}>
              {editingId ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
            <button type="button" onClick={() => { setShowNew(false); setEditingId(null); resetForm() }}
              className="px-6 py-2 rounded-lg border hover:bg-gray-50 transition">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {data?.products?.map((product) => (
          <div key={product.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin img</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{product.name}</p>
              <p className="text-sm text-gray-500">{product.category_name} · Stock: {product.stock}</p>
            </div>
            <div className="text-right">
              <p className="font-bold" style={{ color: 'var(--color-primary)' }}>${Number(product.price).toLocaleString()}</p>
            </div>
            <button onClick={() => handleEdit(product)}
              className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 transition">
              Editar
            </button>
            <button onClick={() => { if (confirm('¿Eliminar producto?')) deleteProduct.mutate(product.id) }}
              className="px-3 py-1 text-sm border text-red-500 rounded-lg hover:bg-red-50 transition">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
