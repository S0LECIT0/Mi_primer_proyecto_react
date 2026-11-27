import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import { productService } from '../services/api'

// ─── Imágenes locales (fallback) ──────────────────────────────────────────────
import arequipe from '../assets/images/arequipe.jpg'
import cafe from '../assets/images/cafe.jpg'
import chocolate from '../assets/images/chocolate.jpg'
import durazno from '../assets/images/durazno.png'
import flan from '../assets/images/flan.jpg'
import fresa from '../assets/images/fresa.jpg'
import maracuya from '../assets/images/maracuya.jpg'
import oreo from '../assets/images/oreo.jpg'
import tiramisu from '../assets/images/tiramisu.png'
import treLeches from '../assets/images/tres_leches.jpg'

const imagenesLocales = { arequipe, cafe, chocolate, durazno, flan, fresa, maracuya, oreo, tiramisu, tres_leches: treLeches }

function resolverImagen(url) {
  if (!url) return chocolate
  for (const key of Object.keys(imagenesLocales)) {
    if (url.includes(key)) return imagenesLocales[key]
  }
  if (url.startsWith('http')) return url
  return chocolate
}

// ─────────────────────────────────────────────────────────────────────────────
const TODOS = 'Todos'

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrecio = (n) =>
  '$' + Number(n).toLocaleString('es-CO') + ' COP'

// ── Colores por categoría ─────────────────────────────────────────────────────
const badgeColor = {
  'Tortas Artesanales': 'bg-logo-pink/20 text-logo-brown',
  'Tartas & Cheesecakes': 'bg-yellow-100 text-yellow-800',
  'Postres Tradicionales': 'bg-green-100 text-green-800',
  'Postres de Café & Chocolate': 'bg-amber-100 text-amber-900',
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Productos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoriaActiva, setCategoriaActiva] = useState(TODOS)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    productService.getAll({ solo_activos: true }).then((res) => {
      if (res.ok && Array.isArray(res.data)) {
        setProductos(res.data)
      }
      setLoading(false)
    })
  }, [])

  // Categorías únicas desde la API
  const categorias = [TODOS, ...Array.from(new Set(productos.map((p) => p.categoria?.nombre).filter(Boolean)))]

  const filtrados = productos.filter((p) => {
    const coincideCategoria =
      categoriaActiva === TODOS || p.categoria?.nombre === categoriaActiva
    const coincideBusqueda =
      busqueda.trim() === '' ||
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  // Agrupar por categoría para la vista "Todos"
  const grupos =
    categoriaActiva === TODOS
      ? categorias.slice(1)
      : [categoriaActiva]

  return (
    <div className="min-h-screen flex flex-col bg-logo-vanilla text-logo-brown">
      <Header />

      <main className="flex-1">

        {/* ── Banner de cabecera ──────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-logo-brown via-[#7a3528] to-logo-brown text-white py-14 px-4 sm:px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 select-none pointer-events-none text-[200px] flex items-center justify-center">
            🧁
          </div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="inline-block px-4 py-1 rounded-full bg-logo-pink/20 border border-logo-pink/30 text-logo-pink text-xs font-bold tracking-widest uppercase">
              Nuestro Menú
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold leading-tight">
              Catálogo de <span className="text-logo-pink">Productos</span>
            </h1>
            <p className="text-sm sm:text-base text-white/75 max-w-lg mx-auto font-light">
              Descubre nuestras creaciones artesanales, organizadas por categoría para que encuentres fácilmente lo que más te apetece.
            </p>
          </div>
        </section>

        {/* ── Filtros y búsqueda ──────────────────────────────────────────── */}
        <section className="bg-white border-b border-logo-pink/20 sticky top-[80px] z-30 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Tabs de categoría */}
            <div className="flex flex-wrap gap-2">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border ${
                    categoriaActiva === cat
                      ? 'bg-logo-brown text-white border-logo-brown shadow-sm'
                      : 'bg-white text-logo-brownLight border-logo-pink/30 hover:border-logo-brown hover:text-logo-brown'
                  }`}
                >
                  {cat === TODOS ? '🍰 Todos' : cat}
                </button>
              ))}
            </div>

            {/* Búsqueda */}
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-full text-xs border border-logo-pink/30 bg-logo-cream/60 focus:outline-none focus:border-logo-brown placeholder-logo-brownLight/60 text-logo-brown"
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-logo-brownLight/60 text-xs">🔍</span>
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-logo-brownLight/60 hover:text-logo-brown text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ── Contenido del catálogo ──────────────────────────────────────── */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

          {loading ? (
            <div className="text-center py-24 text-logo-brownLight">
              <span className="text-5xl block mb-4 animate-bounce">🧁</span>
              <p className="text-sm">Cargando productos...</p>
            </div>
          ) : filtrados.length === 0 ? (
            <div className="text-center py-24 text-logo-brownLight">
              <span className="text-5xl block mb-4">🔍</span>
              <p className="font-display text-lg font-semibold text-logo-brown">No encontramos "{busqueda}"</p>
              <p className="text-sm mt-1">Intenta con otro término o explora todas las categorías.</p>
              <button
                onClick={() => { setBusqueda(''); setCategoriaActiva(TODOS) }}
                className="mt-5 px-6 py-2 rounded-full bg-logo-brown text-white text-sm font-medium hover:bg-logo-pinkHover transition-colors cursor-pointer"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            grupos.map((grupo) => {
              const items = filtrados.filter(
                (p) => categoriaActiva !== TODOS || p.categoria?.nombre === grupo
              )
              if (items.length === 0) return null
              return (
                <div key={grupo} className="mb-14">
                  {/* Encabezado de categoría */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex-1 h-px bg-logo-pink/25" />
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${
                        badgeColor[grupo] || 'bg-logo-pink/15 text-logo-brown'
                      }`}
                    >
                      {grupo}
                    </span>
                    <div className="flex-1 h-px bg-logo-pink/25" />
                  </div>

                  {/* Grid de cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {items.map((producto) => (
                      <article
                        key={producto.id}
                        className="group bg-white rounded-2xl overflow-hidden border border-logo-pink/20 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                      >
                        {/* Imagen */}
                        <div className="relative h-48 sm:h-56 overflow-hidden">
                          <img
                            src={resolverImagen(producto.imagen_url)}
                            alt={producto.nombre}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {/* Overlay suave */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

                          {/* Badge de categoría */}
                          <span
                            className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                              badgeColor[producto.categoria?.nombre] || 'bg-logo-pink/20 text-logo-brown'
                            }`}
                          >
                            {producto.categoria?.nombre}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="p-4 sm:p-5 space-y-2">
                          <h3 className="font-display text-base sm:text-lg font-bold text-logo-brown leading-snug">
                            {producto.nombre}
                          </h3>
                          <p className="text-xs text-logo-brownLight leading-relaxed line-clamp-3">
                            {producto.descripcion}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-logo-pink/15">
                            <div>
                              <p className="text-logo-pinkHover font-bold text-base">
                                {formatPrecio(producto.precio)}
                              </p>
                            </div>
                            <a
                              href={`https://wa.me/573128904521?text=Hola,%20quiero%20pedir%20${encodeURIComponent(producto.nombre)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-logo-brown text-white text-xs font-semibold hover:bg-logo-pinkHover transition-colors duration-200 shadow-sm"
                            >
                              Pedir 🧁
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )
            })
          )}

          {/* Resumen de resultados */}
          {!loading && filtrados.length > 0 && (
            <p className="text-center text-xs text-logo-brownLight/70 mt-4">
              Mostrando {filtrados.length} de {productos.length} productos
            </p>
          )}
        </section>

        {/* ── CTA Final ───────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-r from-logo-pink/25 via-white to-logo-pink/20 border-t border-logo-pink/20 py-12 px-4 text-center">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-4xl block">🎂</span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-logo-brown">
              ¿No encuentras lo que buscas?
            </h2>
            <p className="text-sm text-logo-brownLight">
              Creamos postres completamente personalizados para tu evento especial. ¡Cuéntanos tu idea!
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                to="/contacto"
                className="px-6 py-2.5 rounded-full bg-logo-brown text-white text-sm font-semibold hover:bg-logo-pinkHover transition-all"
              >
                Solicitar Pedido Personalizado
              </Link>
              <a
                href="https://wa.me/573128904521"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full border-2 border-logo-brown text-logo-brown text-sm font-medium hover:bg-logo-brown hover:text-white transition-all"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
