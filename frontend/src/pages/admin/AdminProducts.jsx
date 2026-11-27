import React, { useState, useEffect, useCallback } from 'react'
import ConfirmModal from '../../components/admin/ConfirmModal'
import ToastAlert from '../../components/admin/ToastAlert'
import { productService, categoryService } from '../../services/api'

import arequipe from '../../assets/images/arequipe.jpg'
import cafe from '../../assets/images/cafe.jpg'
import chocolate from '../../assets/images/chocolate.jpg'
import durazno from '../../assets/images/durazno.png'
import flan from '../../assets/images/flan.jpg'
import fresa from '../../assets/images/fresa.jpg'
import maracuya from '../../assets/images/maracuya.jpg'
import oreo from '../../assets/images/oreo.jpg'
import tiramisu from '../../assets/images/tiramisu.png'
import tres_leches from '../../assets/images/tres_leches.jpg'

const productImagesMap = {
  arequipe,
  cafe,
  chocolate,
  durazno,
  flan,
  fresa,
  maracuya,
  oreo,
  tiramisu,
  tres_leches
}

const IMAGE_PRESETS = [
  { label: 'Torta de Chocolate', value: '/src/assets/images/chocolate.jpg' },
  { label: 'Torta de Arequipe', value: '/src/assets/images/arequipe.jpg' },
  { label: 'Café Moka', value: '/src/assets/images/cafe.jpg' },
  { label: 'Cheesecake Durazno', value: '/src/assets/images/durazno.png' },
  { label: 'Flan Tradicional', value: '/src/assets/images/flan.jpg' },
  { label: 'Fresas', value: '/src/assets/images/fresa.jpg' },
  { label: 'Maracuyá', value: '/src/assets/images/maracuya.jpg' },
  { label: 'Galletas Oreo', value: '/src/assets/images/oreo.jpg' },
  { label: 'Tiramisú', value: '/src/assets/images/tiramisu.png' },
  { label: 'Tres Leches', value: '/src/assets/images/tres_leches.jpg' }
]

function resolveProductImage(url) {
  if (!url) return chocolate
  // Si la URL corresponde a una imagen conocida, usar el import
  for (const key of Object.keys(productImagesMap)) {
    if (url.includes(key)) return productImagesMap[key]
  }
  // Si es una URL HTTP externa, usarla directamente
  if (url.startsWith('http')) return url
  // Si es una ruta local de assets, usarla directamente
  if (url.startsWith('/src/assets/images/')) return url
  // Fallback a chocolate
  return chocolate
}

function mapApiProduct(p) {
  return {
    id: p.id,
    nombre: p.nombre,
    categoria_id: p.categoria_id,
    categoria: p.categoria?.nombre || 'Sin categoría',
    precio: Number(p.precio),
    stock: Number(p.stock ?? 0),
    descripcion: p.descripcion,
    imagen_url: p.imagen_url || '/src/assets/images/chocolate.jpg',
    imagen: resolveProductImage(p.imagen_url),
    activo: Boolean(p.activo),
    estado: p.activo ? 'Activo' : 'Inactivo'
  }
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [apiError, setApiError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [statusFilter, setStatusFilter] = useState('Todos')

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  // Confirmación de Borrado
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)

  // Alerta Toast
  const [toast, setToast] = useState({ message: '', type: 'success' })

  // Formulario
  const [formData, setFormData] = useState({
    nombre: '',
    categoria_id: '',
    precio: '',
    stock: '10',
    descripcion: '',
    imagen_url: '/src/assets/images/chocolate.jpg',
    estado: 'Activo'
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    setApiError('')

    const [pRes, cRes] = await Promise.all([
      productService.getAll({ solo_activos: false }),
      categoryService.getAll()
    ])

    if (cRes.ok && Array.isArray(cRes.data)) {
      setCategories(cRes.data)
    }

    if (pRes.ok && Array.isArray(pRes.data)) {
      setProducts(pRes.data.map(mapApiProduct))
    } else {
      setApiError(pRes.error || 'No fue posible cargar el catálogo de productos desde la API.')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Filtrado
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCat = categoryFilter === 'Todas' || String(p.categoria_id) === String(categoryFilter)
    const matchesStatus = statusFilter === 'Todos' || p.estado === statusFilter
    return matchesSearch && matchesCat && matchesStatus
  })

  // Abrir Modal Crear
  const handleOpenCreate = () => {
    setIsEditing(false)
    setSelectedProduct(null)
    // Tomamos siempre el id de la primera categoría disponible (ya cargada)
    const primeraCatId = categories.length > 0 ? String(categories[0].id) : ''
    setFormData({
      nombre: '',
      categoria_id: primeraCatId,
      precio: '',
      stock: '10',
      descripcion: '',
      imagen_url: '/src/assets/images/chocolate.jpg',
      estado: 'Activo'
    })
    setIsModalOpen(true)
  }

  // Abrir Modal Editar
  const handleOpenEdit = (product) => {
    setIsEditing(true)
    setSelectedProduct(product)
    setFormData({
      nombre: product.nombre,
      categoria_id: String(product.categoria_id),
      precio: String(product.precio),
      stock: String(product.stock ?? 0),
      descripcion: product.descripcion,
      imagen_url: product.imagen_url || '/src/assets/images/chocolate.jpg',
      estado: product.estado
    })
    setIsModalOpen(true)
  }

  // Guardar Producto vía FastAPI
  const handleSaveProduct = async (e) => {
    e.preventDefault()

    const nombreTrim = formData.nombre.trim()
    const descTrim = formData.descripcion.trim()
    const numPrecio = Number(formData.precio)
    const numStock = Number(formData.stock)
    const catId = Number(formData.categoria_id)

    if (!nombreTrim) {
      setToast({ message: 'El nombre del postre es obligatorio.', type: 'error' })
      return
    }
    if (!catId) {
      setToast({ message: 'Debes seleccionar una categoría.', type: 'error' })
      return
    }
    if (!formData.precio) {
      setToast({ message: 'El precio es obligatorio.', type: 'error' })
      return
    }
    if (!descTrim) {
      setToast({ message: 'La descripción es obligatoria.', type: 'error' })
      return
    }

    if (isNaN(numPrecio) || numPrecio <= 0) {
      setToast({ message: 'El precio debe ser un número mayor a cero.', type: 'error' })
      return
    }

    if (isNaN(numStock) || numStock < 0) {
      setToast({ message: 'El stock no puede ser negativo.', type: 'error' })
      return
    }

    setSaving(true)
    const payload = {
      nombre: nombreTrim,
      descripcion: descTrim,
      precio: numPrecio,
      stock: numStock,
      categoria_id: catId,
      imagen_url: formData.imagen_url.trim() || '/src/assets/images/chocolate.jpg',
      activo: formData.estado === 'Activo'
    }

    if (isEditing && selectedProduct) {
      const res = await productService.update(selectedProduct.id, payload)
      setSaving(false)

      if (!res.ok) {
        setToast({ message: res.error || 'No fue posible actualizar el postre.', type: 'error' })
        return
      }

      const mapped = mapApiProduct(res.data)
      setProducts((prev) => prev.map((p) => (p.id === selectedProduct.id ? mapped : p)))
      setToast({ message: `Postre "${mapped.nombre}" actualizado en base de datos.`, type: 'success' })
    } else {
      const res = await productService.create(payload)
      setSaving(false)

      if (!res.ok) {
        setToast({ message: res.error || 'No fue posible crear el postre.', type: 'error' })
        return
      }

      const mapped = mapApiProduct(res.data)
      setProducts((prev) => [mapped, ...prev])
      setToast({ message: `Postre "${mapped.nombre}" guardado en el catálogo.`, type: 'success' })
    }

    setIsModalOpen(false)
  }

  // Alternar Estado en FastAPI
  const handleToggleStatus = async (productId) => {
    const target = products.find((p) => p.id === productId)
    if (!target) return

    const nuevoActivo = !target.activo
    const res = await productService.update(productId, { activo: nuevoActivo })

    if (!res.ok) {
      setToast({ message: res.error || 'No fue posible cambiar la disponibilidad.', type: 'error' })
      return
    }

    const mapped = mapApiProduct(res.data)
    setProducts((prev) => prev.map((p) => (p.id === productId ? mapped : p)))
    setToast({ message: `Disponibilidad de "${mapped.nombre}" cambiada a ${mapped.estado}.`, type: 'success' })
  }

  // Confirmación de Borrado
  const handleRequestDelete = (product) => {
    setProductToDelete(product)
    setIsConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    const res = await productService.delete(productToDelete.id)
    setIsConfirmDeleteOpen(false)

    if (!res.ok) {
      setToast({ message: res.error || 'No fue posible eliminar el postre.', type: 'error' })
      setProductToDelete(null)
      return
    }

    if (res.data?.desactivado) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productToDelete.id ? { ...p, activo: false, estado: 'Inactivo' } : p))
      )
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id))
    }

    setToast({ message: res.data?.message || 'Operación completada.', type: 'success' })
    setProductToDelete(null)
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">

      <ToastAlert
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-logo-brown">
            Catálogo de Postres y Especialidades
          </h2>
          <p className="text-xs sm:text-sm text-logo-brownLight font-light mt-1">
            Administra los postres, ajusta precios, stock y disponibilidad de las creaciones artesanales.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
        >
          <span>🧁</span>
          <span>Agregar Nuevo Postre</span>
        </button>
      </div>

      {apiError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-3">
          <span>{apiError}</span>
          <button
            type="button"
            onClick={loadData}
            className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-semibold"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-logo-pink/20 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar postre o descripción..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink bg-logo-vanilla/30"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-logo-pink/30 text-xs text-logo-brown bg-white outline-none focus:border-logo-pink"
          >
            <option value="Todas">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.nombre}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-logo-pink/30 text-xs text-logo-brown bg-white outline-none focus:border-logo-pink"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Activo">Disponibles (Activos)</option>
            <option value="Inactivo">Agotados (Inactivos)</option>
          </select>
        </div>
      </div>

      {/* Tabla CRUD de Productos */}
      <div className="bg-white rounded-3xl border border-logo-pink/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-logo-cream via-white to-logo-pinkLight/30 border-b border-logo-pink/20 text-logo-brown font-semibold">
                <th className="py-3.5 px-4 sm:px-6">Postre</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Precio COP</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4">Disponibilidad</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-logo-pink/10">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Cargando productos desde FastAPI...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-logo-vanilla/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imagen || chocolate}
                          alt={p.nombre}
                          className="w-11 h-11 rounded-xl object-cover border border-logo-pink/30 shadow-xs shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-logo-brown">{p.nombre}</div>
                          <div className="text-[11px] text-gray-500 max-w-xs truncate">{p.descripcion}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="px-2 py-0.5 rounded-md bg-logo-cream border border-logo-pink/20 text-[11px]">
                        {p.categoria}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-logo-brown">
                      ${Number(p.precio).toLocaleString('es-CO')}
                    </td>

                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      {p.stock} uds
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(p.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                          p.estado === 'Activo'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Haz clic para alternar disponibilidad"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.estado === 'Activo' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        <span>{p.estado === 'Activo' ? 'Disponible' : 'Agotado'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 sm:px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Editar postre"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(p)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Eliminar postre"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No se encontraron postres con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Crear / Editar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-logo-brown/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-logo-pink/30 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-logo-cream to-white p-5 border-b border-logo-pink/20 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-logo-brown">
                {isEditing ? 'Editar Postre' : 'Agregar Nuevo Postre al Catálogo'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-logo-pink/20 text-gray-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 sm:p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-logo-brown mb-1">Nombre del Postre *</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                  placeholder="Ej. Tarta de Frutas del Bosque"
                  className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Categoría *</label>
                  <select
                    value={formData.categoria_id}
                    onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs bg-white outline-none focus:border-logo-pink"
                  >
                    {formData.categoria_id === '' && (
                      <option value="" disabled>— Selecciona una categoría —</option>
                    )}
                    {categories.map((c) => (
                      <option key={c.id} value={String(c.id)}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Precio (COP) *</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                    placeholder="45000"
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-logo-brown mb-1">Descripción del Postre *</label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  required
                  placeholder="Describe los ingredientes, texturas y sabores..."
                  className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink resize-none"
                ></textarea>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Imagen del Catálogo</label>
                  <select
                    value={IMAGE_PRESETS.some(img => img.value === formData.imagen_url) ? formData.imagen_url : '__custom__'}
                    onChange={(e) => {
                      if (e.target.value !== '__custom__') {
                        setFormData({ ...formData, imagen_url: e.target.value })
                      } else {
                        setFormData({ ...formData, imagen_url: '' })
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs bg-white outline-none focus:border-logo-pink"
                  >
                    {IMAGE_PRESETS.map((img) => (
                      <option key={img.value} value={img.value}>{img.label}</option>
                    ))}
                    <option value="__custom__">🌐 URL personalizada…</option>
                  </select>
                </div>

                {/* Campo de URL externa — aparece solo si se eligió "personalizada" o ya viene una URL externa */}
                {(!IMAGE_PRESETS.some(img => img.value === formData.imagen_url)) && (
                  <div>
                    <label className="block text-xs font-semibold text-logo-brown mb-1">URL de la imagen <span className="text-gray-400 font-normal">(https://...)</span></label>
                    <input
                      type="url"
                      value={formData.imagen_url}
                      onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                      placeholder="https://ejemplo.com/mi-postre.jpg"
                      className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
                    />
                  </div>
                )}

                {/* Previsualización de imagen */}
                <div className="flex items-center gap-3">
                  <img
                    src={resolveProductImage(formData.imagen_url)}
                    alt="Vista previa"
                    onError={(e) => { e.target.src = '' }}
                    className="w-14 h-14 rounded-xl object-cover border border-logo-pink/30 shadow-sm shrink-0 bg-logo-cream"
                  />
                  <span className="text-[11px] text-gray-400 italic">Vista previa de la imagen seleccionada</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-logo-brown mb-1">Disponibilidad en Carta</label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs bg-white outline-none focus:border-logo-pink font-semibold"
                >
                  <option value="Activo">Disponible (Activo)</option>
                  <option value="Inactivo">Agotado (Inactivo)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-logo-pink/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs font-semibold shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Agregar Postre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title="¿Eliminar definitivamente este postre del catálogo?"
        itemDetails={
          productToDelete && (
            <div className="flex items-start gap-3.5 bg-white p-3 rounded-xl border border-logo-pink/20">
              <img
                src={productToDelete.imagen || chocolate}
                alt={productToDelete.nombre}
                className="w-16 h-16 rounded-xl object-cover border border-logo-pink/30 shrink-0"
              />
              <div className="text-xs space-y-1">
                <div className="font-bold text-sm text-logo-brown">{productToDelete.nombre}</div>
                <div className="text-gray-600"><span className="font-semibold text-logo-brown">Categoría:</span> {productToDelete.categoria}</div>
                <div className="text-gray-600"><span className="font-semibold text-logo-brown">Precio:</span> ${Number(productToDelete.precio).toLocaleString('es-CO')}</div>
                <div className="text-gray-500 text-[11px] line-clamp-2">{productToDelete.descripcion}</div>
              </div>
            </div>
          )
        }
        confirmText="Sí, Eliminar Definitivamente"
        cancelText="Cancelar y Mantener"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmDeleteOpen(false)
          setProductToDelete(null)
        }}
      />

    </div>
  )
}
