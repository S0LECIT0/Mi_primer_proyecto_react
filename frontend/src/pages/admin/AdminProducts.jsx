import React, { useState, useEffect } from 'react'
import ConfirmModal from '../../components/admin/ConfirmModal'
import ToastAlert from '../../components/admin/ToastAlert'
import { productService } from '../../services/api'

// Importación de las fotos de los 10 postres para previsualización
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

const INITIAL_PRODUCTS = [
  {
    id: 1,
    nombre: 'Mousse Individual de Arequipe',
    categoria: 'Postres Individuales',
    precio: 9500,
    descripcion: 'Porción personal en domo con cremosa mousse de dulce de leche y nuez.',
    estado: 'Activo',
    imagen: arequipe
  },
  {
    id: 2,
    nombre: 'Vasitos de Postre Moka y Café',
    categoria: 'Vasitos Gourmet',
    precio: 8500,
    descripcion: 'Capas de crema suave al café con cacao puro y virutas de chocolate.',
    estado: 'Activo',
    imagen: cafe
  },
  {
    id: 3,
    nombre: 'Tarta Suprema de Chocolate',
    categoria: 'Tortas y Pasteles',
    precio: 65000,
    descripcion: 'Bizcocho húmedo de cacao con ganache oscuro y detalle dorado.',
    estado: 'Activo',
    imagen: chocolate
  },
  {
    id: 4,
    nombre: 'Cheesecake Horneado de Durazno',
    categoria: 'Cheesecakes',
    precio: 58000,
    descripcion: 'Base de queso horneado al estilo clásico sobre galleta con durazno.',
    estado: 'Activo',
    imagen: durazno
  },
  {
    id: 5,
    nombre: 'Flan Casero al Caramelo',
    categoria: 'Tradicionales',
    precio: 35000,
    descripcion: 'Receta tradicional de textura sedosa y generoso caramelo líquido.',
    estado: 'Activo',
    imagen: flan
  },
  {
    id: 6,
    nombre: 'Panna Cotta con Frutos Rojos',
    categoria: 'Postres Individuales',
    precio: 11000,
    descripcion: 'Crema cocida aromatizada con vainilla y salsa brillante de fresa.',
    estado: 'Activo',
    imagen: fresa
  },
  {
    id: 7,
    nombre: 'Pie Cítrico de Maracuyá',
    categoria: 'Tortas y Pasteles',
    precio: 52000,
    descripcion: 'Tarta artesanal con relleno de maracuyá y coulis natural con semillas.',
    estado: 'Activo',
    imagen: maracuya
  },
  {
    id: 8,
    nombre: 'Domo Cheesecake de Oreo',
    categoria: 'Postres Individuales',
    precio: 9500,
    descripcion: 'Postre individual con base de galleta Oreo y crema batida.',
    estado: 'Activo',
    imagen: oreo
  },
  {
    id: 9,
    nombre: 'Tiramisú Artesanal con Nueces',
    categoria: 'Vasitos Gourmet',
    precio: 12000,
    descripcion: 'Copas individuales con crema mascarpone, café y nueces tostadas.',
    estado: 'Activo',
    imagen: tiramisu
  },
  {
    id: 10,
    nombre: 'Pastel Clásico Tres Leches',
    categoria: 'Tortas y Pasteles',
    precio: 60000,
    descripcion: 'Bizcocho tradicional humedecido en salsa tres leches y chantilly.',
    estado: 'Activo',
    imagen: tres_leches
  }
]

// Mapa de imágenes locales
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

function resolveProductImage(url) {
  if (!url) return chocolate
  for (const key of Object.keys(productImagesMap)) {
    if (url.includes(key)) return productImagesMap[key]
  }
  return chocolate
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('Todas')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [isConnectedToApi, setIsConnectedToApi] = useState(false)

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
    categoria: 'Tortas y Pasteles',
    precio: '',
    descripcion: '',
    estado: 'Activo'
  })

  // Cargar productos desde FastAPI / Neon o localStorage
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await productService.getAll({ solo_activos: false })
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
          const apiProducts = res.data.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            categoria: p.categoria?.nombre || 'Tortas y Pasteles',
            precio: Number(p.precio),
            descripcion: p.descripcion,
            estado: p.activo ? 'Activo' : 'Inactivo',
            imagen: resolveProductImage(p.imagen_url)
          }))
          setProducts(apiProducts)
          setIsConnectedToApi(true)
          return
        }
      } catch (e) {
        // Fallback
      }

      const stored = localStorage.getItem('dulce_delicia_products_crud')
      if (stored) {
        try {
          setProducts(JSON.parse(stored))
        } catch (e) {
          setProducts(INITIAL_PRODUCTS)
        }
      } else {
        setProducts(INITIAL_PRODUCTS)
        localStorage.setItem('dulce_delicia_products_crud', JSON.stringify(INITIAL_PRODUCTS))
      }
    }
    loadProducts()
  }, [])

  const saveProducts = (newList) => {
    setProducts(newList)
    localStorage.setItem('dulce_delicia_products_crud', JSON.stringify(newList))
  }

  // Filtrado
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCat = categoryFilter === 'Todas' || p.categoria === categoryFilter
    const matchesStatus = statusFilter === 'Todos' || p.estado === statusFilter
    return matchesSearch && matchesCat && matchesStatus
  })

  // Abrir Modal Crear
  const handleOpenCreate = () => {
    setIsEditing(false)
    setSelectedProduct(null)
    setFormData({
      nombre: '',
      categoria: 'Tortas y Pasteles',
      precio: '',
      descripcion: '',
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
      categoria: product.categoria,
      precio: product.precio,
      descripcion: product.descripcion,
      estado: product.estado
    })
    setIsModalOpen(true)
  }

  // Guardar Producto
  const handleSaveProduct = (e) => {
    e.preventDefault()

    const nombreTrim = formData.nombre.trim()
    const descTrim = formData.descripcion.trim()
    const numPrecio = Number(formData.precio)

    if (!nombreTrim || !descTrim || !formData.precio) {
      setToast({ message: 'Todos los campos son obligatorios y no pueden ser solo espacios.', type: 'error' })
      return
    }

    if (isNaN(numPrecio) || numPrecio <= 0) {
      setToast({ message: 'El precio debe ser un número mayor a cero.', type: 'error' })
      return
    }

    if (isEditing && selectedProduct) {
      const updated = products.map((p) =>
        p.id === selectedProduct.id
          ? { ...p, ...formData, nombre: nombreTrim, descripcion: descTrim, precio: numPrecio }
          : p
      )
      saveProducts(updated)
      setToast({ message: `Postre "${nombreTrim}" actualizado correctamente.`, type: 'success' })
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        nombre: nombreTrim,
        descripcion: descTrim,
        precio: numPrecio,
        imagen: chocolate // Imagen por defecto
      }
      saveProducts([newProduct, ...products])
      setToast({ message: `Postre "${nombreTrim}" agregado al catálogo.`, type: 'success' })
    }

    setIsModalOpen(false)
  }

  // Alternar Estado
  const handleToggleStatus = async (productId) => {
    const target = products.find((p) => p.id === productId)
    const nuevoEstado = target?.estado === 'Activo' ? 'Inactivo' : 'Activo'

    if (isConnectedToApi && target) {
      await productService.update(productId, { activo: nuevoEstado === 'Activo' })
    }

    const updated = products.map((p) => {
      if (p.id === productId) {
        setToast({ message: `Disponibilidad de "${p.nombre}" cambiada a ${nuevoEstado}.`, type: 'success' })
        return { ...p, estado: nuevoEstado }
      }
      return p
    })
    saveProducts(updated)
  }

  // Confirmación de Borrado
  const handleRequestDelete = (product) => {
    setProductToDelete(product)
    setIsConfirmDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    if (isConnectedToApi) {
      await productService.delete(productToDelete.id)
    }
    const updated = products.filter((p) => p.id !== productToDelete.id)
    saveProducts(updated)
    setIsConfirmDeleteOpen(false)
    setToast({ message: `El postre "${productToDelete.nombre}" ha sido eliminado del catálogo.`, type: 'success' })
    setProductToDelete(null)
  }

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Toast Alert */}
      <ToastAlert
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-display text-2xl font-bold text-logo-brown">
              Catálogo de Postres y Especialidades
            </h2>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              isConnectedToApi 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isConnectedToApi ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
              {isConnectedToApi ? 'Neon Tech API' : 'Modo Local'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-logo-brownLight font-light">
            Administra los postres, ajusta precios, controla la disponibilidad en tienda y agrega nuevas creaciones.
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
            <option value="Tortas y Pasteles">Tortas y Pasteles</option>
            <option value="Cheesecakes">Cheesecakes</option>
            <option value="Vasitos Gourmet">Vasitos Gourmet</option>
            <option value="Postres Individuales">Postres Individuales</option>
            <option value="Tradicionales">Tradicionales</option>
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

      {/* Tabla CRUD de Productos (Read) */}
      <div className="bg-white rounded-3xl border border-logo-pink/20 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-logo-cream via-white to-logo-pinkLight/30 border-b border-logo-pink/20 text-logo-brown font-semibold">
                <th className="py-3.5 px-4 sm:px-6">Postre</th>
                <th className="py-3.5 px-4">Categoría</th>
                <th className="py-3.5 px-4">Precio COP</th>
                <th className="py-3.5 px-4">Disponibilidad</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-logo-pink/10">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-logo-vanilla/40 transition-colors">
                    
                    {/* Postre con Imagen Miniatura */}
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

                    {/* Categoría */}
                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="px-2 py-0.5 rounded-md bg-logo-cream border border-logo-pink/20 text-[11px]">
                        {p.categoria}
                      </span>
                    </td>

                    {/* Precio Formateado */}
                    <td className="py-3.5 px-4 font-semibold text-logo-brown">
                      ${Number(p.precio).toLocaleString('es-CO')}
                    </td>

                    {/* Estado Activo / Inactivo */}
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

                    {/* Acciones */}
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
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No se encontraron postres en esta categoría.
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Categoría *</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-logo-pink/30 text-xs bg-white outline-none focus:border-logo-pink"
                  >
                    <option value="Tortas y Pasteles">Tortas y Pasteles</option>
                    <option value="Cheesecakes">Cheesecakes</option>
                    <option value="Vasitos Gourmet">Vasitos Gourmet</option>
                    <option value="Postres Individuales">Postres Individuales</option>
                    <option value="Tradicionales">Tradicionales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-logo-brown mb-1">Precio (COP) *</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    required
                    placeholder="Ej. 45000"
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
                  className="px-6 py-2 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs font-semibold shadow-md transition-all"
                >
                  {isEditing ? 'Guardar Cambios' : 'Agregar Postre'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Confirmación de Eliminación con Bloqueo de 3s y Desglose */}
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
