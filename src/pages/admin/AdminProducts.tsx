import { useState } from 'react'
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useUploadImages, useCategories, useCreateCategory, useUploadCategoryImage } from '../../api/hooks'
import { TableSkeleton } from '../../components/Skeleton'
import FileInput from '../../components/FileInput'
import Modal from '../../components/Modal'
import { useToast } from '../../components/Toast'

export default function AdminProducts() {
  const { data, isLoading } = useProducts({ page: 1 })
  const { data: categories } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const deleteProduct = useDeleteProduct()
  const uploadImages = useUploadImages()
  const createCategory = useCreateCategory()
  const uploadCategoryImage = useUploadCategoryImage()
  const { showToast } = useToast()

  const onUploadError = (error: any) =>
    showToast(error?.response?.data?.error || 'No se pudo subir la imagen', 'error')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [form, setForm] = useState({
    name: '', description: '', price: 0, compare_price: 0,
    stock: 0, category_id: '', is_active: true, weight_kg: 0,
  })
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const [categoryImage, setCategoryImage] = useState<File | null>(null)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="ds-enter">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-semibold tracking-[-0.03em] sm:text-[26px]" style={{ color: 'var(--a-text)' }}>Productos</h1>
        </div>
        <TableSkeleton rows={6} cols={4} />
      </div>
    )
  }

  const resetForm = () => {
    setForm({ name: '', description: '', price: 0, compare_price: 0, stock: 0, category_id: '', is_active: true, weight_kg: 0 })
    setUploadFiles([])
  }

  const handleEdit = (product: any) => {
    setEditingId(product.id)
    setForm({
      name: product.name, description: product.description || '',
      price: Number(product.price), compare_price: Number(product.compare_price || 0),
      stock: product.stock, category_id: product.category_id || '', is_active: product.is_active,
      weight_kg: Number(product.weight_kg || 0),
    })
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...form,
      price: Number(form.price),
      compare_price: form.compare_price > 0 ? Number(form.compare_price) : undefined,
      category_id: form.category_id || undefined,
      weight_kg: Number(form.weight_kg) || undefined,
    }

    if (editingId) {
      updateProduct.mutate({ id: editingId, data }, {
        onSuccess: () => {
          if (uploadFiles.length === 0) { setEditingId(null); resetForm(); return }
          // Si eligió imágenes, las subimos antes de cerrar el formulario
          uploadImages.mutate({ id: editingId, files: uploadFiles }, {
            onSuccess: () => { setEditingId(null); resetForm() },
            onError: onUploadError,
          })
        },
      })
    } else {
      createProduct.mutate(data, {
        onSuccess: (res: any) => {
          const newId = res.data.id
          if (uploadFiles.length > 0) {
            uploadImages.mutate({ id: newId, files: uploadFiles }, {
              onSuccess: () => setUploadFiles([]),
              onError: onUploadError,
            })
          }
          setEditingId(newId)
        },
      })
    }
  }

  const handleUpload = (productId: string) => {
    if (uploadFiles.length === 0) return
    uploadImages.mutate({ id: productId, files: uploadFiles }, { onSuccess: () => setUploadFiles([]), onError: onUploadError })
  }

  const handleNewCategory = (e: React.FormEvent) => {
    e.preventDefault()
    createCategory.mutate({ name: newCatName }, {
      onSuccess: (res: any) => {
        if (categoryImage) {
          uploadCategoryImage.mutate({ id: res.data.id, file: categoryImage }, { onError: onUploadError })
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
        <h1 className="text-[22px] font-semibold tracking-[-0.03em] sm:text-[26px]" style={{ color: 'var(--a-text)' }}>Productos</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowNewCat(!showNewCat)}
            className="ds-btn ds-btn-outline">
            {showNewCat ? 'Cancelar' : '+ Categoría'}
          </button>
          <button onClick={() => { setShowNew(!showNew); setEditingId(null); resetForm() }}
            className="ds-btn ds-btn-primary">
            + Nuevo Producto
          </button>
        </div>
      </div>

      {showNewCat && (
        <form onSubmit={handleNewCategory} className="ds-panel space-y-3 p-4">
          <div className="flex gap-2">
            <input value={newCatName} onChange={e => setNewCatName(e.target.value)}
              placeholder="Nombre de la categoría" required
              className="h-9 flex-1 rounded-md border px-3 text-[13px] outline-none transition-colors focus:border-[var(--a-accent)]" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)', color: 'var(--a-text)' }} />
            <button type="submit" className="ds-btn ds-btn-primary">
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
        <form onSubmit={handleSave} className="ds-panel mb-6 space-y-4 p-5 sm:p-6">
          <h2 className="text-[15px] font-semibold" style={{ color: 'var(--a-text)' }}>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>

          <div className="space-y-4">
            <div>
              <label className="ds-eyebrow mb-1.5 block normal-case tracking-normal">Nombre del producto *</label>
              <input placeholder="Ej: Camiseta deportiva blanca" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="h-9 w-full rounded-md border px-3 text-[13px] outline-none transition-colors focus:border-[var(--a-accent)]" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)', color: 'var(--a-text)' }} />
            </div>

            <div>
              <label className="ds-eyebrow mb-1.5 block normal-case tracking-normal">Descripción</label>
              <textarea placeholder="Describe las características del producto..." value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-md border px-3 py-2 text-[13px] outline-none transition-colors focus:border-[var(--a-accent)]" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)', color: 'var(--a-text)' }} rows={3} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="ds-eyebrow mb-1.5 block normal-case tracking-normal">Precio de venta *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] pointer-events-none" style={{ color: 'var(--a-text-3)' }}>$</span>
                  <input type="number" placeholder="0.00" required value={form.price || ''}
                    onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    className="w-full !pl-8" />
                </div>
              </div>

              <div>
                <label className="ds-eyebrow mb-1.5 block normal-case tracking-normal">Precio comparativa (opcional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] pointer-events-none" style={{ color: 'var(--a-text-3)' }}>$</span>
                  <input type="number" placeholder="0.00" value={form.compare_price || ''}
                    onChange={e => setForm({ ...form, compare_price: parseFloat(e.target.value) || 0 })}
                    className="w-full !pl-8" />
                </div>
                <p className="mt-1 text-[11px]" style={{ color: 'var(--a-text-3)' }}>Precio anterior para mostrar descuento</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="ds-eyebrow mb-1.5 block normal-case tracking-normal">Stock (unidades) *</label>
                <input type="number" placeholder="Ej: 50" required value={form.stock}
                  onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                  className="h-9 w-full rounded-md border px-3 text-[13px] outline-none transition-colors focus:border-[var(--a-accent)]" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)', color: 'var(--a-text)' }} />
                <p className="mt-1 text-[11px]" style={{ color: 'var(--a-text-3)' }}>Cantidad disponible en inventario</p>
              </div>

              <div>
                <label className="ds-eyebrow mb-1.5 block normal-case tracking-normal">Categoría</label>
                <select value={form.category_id}
                  onChange={e => setForm({ ...form, category_id: e.target.value })}
                  className="h-9 w-full rounded-md border px-3 text-[13px] outline-none transition-colors focus:border-[var(--a-accent)]" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)', color: 'var(--a-text)' }}>
                  <option value="">Sin categoría</option>
                  {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="ds-eyebrow mb-1.5 block normal-case tracking-normal">Peso (kg)</label>
              <input type="number" step="0.001" min="0" placeholder="Ej: 0.5" value={form.weight_kg || ''}
                onChange={e => setForm({ ...form, weight_kg: parseFloat(e.target.value) || 0 })}
                className="h-9 w-full rounded-md border px-3 text-[13px] outline-none transition-colors focus:border-[var(--a-accent)]" style={{ background: 'var(--a-surface)', borderColor: 'var(--a-border)', color: 'var(--a-text)' }} />
              <p className="mt-1 text-[11px]" style={{ color: 'var(--a-text-3)' }}>Opcional: si lo dejás vacío se usa el peso promedio configurado en Ajustes de envío</p>
            </div>
          </div>

          <FileInput
            multiple
            label="Imágenes del producto"
            files={uploadFiles}
            onChange={setUploadFiles}
          />
          {editingId && uploadFiles.length > 0 && (
            <button type="button" onClick={() => handleUpload(editingId)}
              className="ds-btn ds-btn-primary">
              Subir ({uploadFiles.length})
            </button>
          )}
          {!editingId && uploadFiles.length > 0 && (
            <p className="text-[11px]" style={{ color: 'var(--a-text-2)' }}>Se subirán al crear el producto</p>
          )}

          <div className="flex gap-3">
            <button type="submit"
              className="ds-btn ds-btn-primary">
              {editingId ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
            <button type="button" onClick={() => { setShowNew(false); setEditingId(null); resetForm() }}
              className="ds-btn ds-btn-outline">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {data?.products?.map((product) => (
          <div key={product.id} className="ds-panel flex items-center gap-4 p-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md" style={{ background: 'var(--a-surface-2)' }}>
              {product.images?.[0] ? (
                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px]" style={{ color: 'var(--a-text-3)' }}>Sin img</div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{product.name}</p>
              <p className="text-[12px]" style={{ color: 'var(--a-text-2)' }}>{product.category_name} · Stock: {product.stock}</p>
            </div>
            <div className="text-right">
              <p className="num text-[14px] font-semibold" style={{ color: 'var(--a-text)' }}>${Number(product.price).toLocaleString()}</p>
            </div>
            <button onClick={() => handleEdit(product)}
              className="ds-btn ds-btn-outline">
              Editar
            </button>
            <button onClick={() => setProductToDelete(product.id)}
              className="ds-btn ds-btn-outline" style={{ color: 'var(--a-danger)', borderColor: 'color-mix(in srgb, var(--a-danger) 35%, transparent)' }}>
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <Modal
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        title="Eliminar Producto"
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct.mutate(productToDelete, {
              onSuccess: () => setProductToDelete(null),
            })
          }
        }}
        isLoading={deleteProduct.isPending}
      >
        ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
      </Modal>
    </div>
  )
}
