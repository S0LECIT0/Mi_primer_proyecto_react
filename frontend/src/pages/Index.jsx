import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'
import WhatsAppButton from '../components/WhatsAppButton'
import logo from '../assets/logo.jpg'

// ─── Hero Slides ─────────────────────────────────────────────────────────────
// Cada slide tiene un gradiente de fondo, un emoji decorativo, título y subtítulo.
// Para agregar más slides, solo añade un objeto al array.
const heroSlides = [
  {
    id: 1,
    gradient: 'from-[#f4a4b5]/80 via-[#fff0f4] to-[#fff9f5]',
    accent: '#532e23',
    emoji: '🎂',
    tag: 'Repostería Artesanal',
    title: 'Momentos Dulces\ncon Amor Artesanal',
    subtitle:
      'Tortas personalizadas, tartas de temporada y postres únicos elaborados con los mejores ingredientes, horneados cada día.',
    cta: { label: 'Ver Nuestros Productos', to: '/productos' },
    ctaSecondary: { label: 'Escríbenos', to: '/contacto' },
  },
  {
    id: 2,
    gradient: 'from-[#532e23]/90 via-[#7a4030] to-[#a85240]',
    accent: '#f4a4b5',
    emoji: '🍫',
    tag: 'Chocolate de Origen',
    title: 'Sabores que\nEnamoran el Paladar',
    subtitle:
      'Desde nuestro clásico Tiramisú hasta la intensa Torta de Chocolate, cada creación es una experiencia sensorial única.',
    cta: { label: 'Explorar Catálogo', to: '/productos' },
    ctaSecondary: { label: 'Conócenos', to: '/nosotros' },
  },
  {
    id: 3,
    gradient: 'from-[#fde8ef] via-[#fff4f7] to-[#fff9f5]',
    accent: '#532e23',
    emoji: '🍓',
    tag: '100% Ingredientes Frescos',
    title: 'Tradición y\nFrescura en Cada Bocado',
    subtitle:
      'Frutas de temporada, cremas naturales y recetas transmitidas de generación en generación. Así nace la magia de Dulce Delicia.',
    cta: { label: 'Nuestro Menú', to: '/productos' },
    ctaSecondary: { label: 'Pedir por WhatsApp', to: 'https://wa.me/573128904521' },
  },
  {
    id: 4,
    gradient: 'from-[#532e23]/80 via-[#f4a4b5]/30 to-[#fff9f5]',
    accent: '#532e23',
    emoji: '🧁',
    tag: 'Pedidos Personalizados',
    title: 'Tu Celebración\nMerece lo Mejor',
    subtitle:
      'Diseñamos tortas temáticas para cumpleaños, bodas, baby showers y toda ocasión especial. ¡Cuéntanos tu sueño!',
    cta: { label: 'Solicitar Pedido', to: '/contacto' },
    ctaSecondary: { label: 'Ver Galería', to: '/productos' },
  },
]

// ─── Propuestas de valor ──────────────────────────────────────────────────────
const valores = [
  {
    emoji: '🍓',
    titulo: '100% Natural',
    desc: 'Frutas frescas, chocolate de origen y mantequilla pura sin conservantes ni aditivos artificiales.',
  },
  {
    emoji: '🧁',
    titulo: 'Horneado a Mano',
    desc: 'Cada postre es elaborado con cuidado artesanal: pesamos, mezclamos y decoramos con dedicación.',
  },
  {
    emoji: '🎨',
    titulo: 'Personalización Total',
    desc: 'Colores, sabores, figuras y mensajes: adaptamos cada creación a tu celebración o antojo especial.',
  },
  {
    emoji: '🛵',
    titulo: 'Entrega Cuidadosa',
    desc: 'Empacado con protección especial para que tu postre llegue impecable y fresco hasta tu puerta.',
  },
]

// ─── Testimonios ─────────────────────────────────────────────────────────────
const testimonios = [
  {
    nombre: 'Laura M.',
    texto: '¡La torta de mi cumpleaños fue un éxito total! Todos preguntaron dónde la había pedido. Absolutamente deliciosa.',
    estrellas: 5,
  },
  {
    nombre: 'Carlos R.',
    texto: 'El tiramisú que pedí para mi reunión de empresa fue el mejor que he probado. Volvería a pedir sin dudarlo.',
    estrellas: 5,
  },
  {
    nombre: 'Sofía T.',
    texto: 'Atención personalizada, entrega puntual y un sabor increíble. Dulce Delicia superó todas mis expectativas.',
    estrellas: 5,
  },
]

// ─── Productos destacados (mini preview) ─────────────────────────────────────
import arequipe from '../assets/images/arequipe.jpg'
import fresa from '../assets/images/fresa.jpg'
import tiramisu from '../assets/images/tiramisu.png'
import chocolate from '../assets/images/chocolate.jpg'

const destacados = [
  { nombre: 'Torta de Arequipe', categoria: 'Tortas Artesanales', precio: '$55.000', img: arequipe },
  { nombre: 'Tarta de Fresa', categoria: 'Tartas & Cheesecakes', precio: '$48.000', img: fresa },
  { nombre: 'Tiramisú Clásico', categoria: 'Postres Tradicionales', precio: '$35.000', img: tiramisu },
  { nombre: 'Torta de Chocolate', categoria: 'Café & Chocolate', precio: '$52.000', img: chocolate },
]

// ─── Componente HeroCarousel ──────────────────────────────────────────────────
function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % heroSlides.length)
        setAnimating(false)
      }, 400)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (idx) => {
    if (idx === current || animating) return
    setAnimating(true)
    setTimeout(() => {
      setCurrent(idx)
      setAnimating(false)
    }, 400)
  }

  const slide = heroSlides[current]
  const isDark = slide.gradient.includes('532e23') && !slide.gradient.includes('fde8ef')

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br ${slide.gradient} transition-all duration-700 min-h-[520px] sm:min-h-[600px] flex items-center`}
    >
      {/* Patrón decorativo de fondo */}
      <div className="absolute inset-0 opacity-5 pointer-events-none select-none">
        <div className="absolute top-6 right-10 text-[120px]">{slide.emoji}</div>
        <div className="absolute bottom-10 left-6 text-[80px] rotate-[-15deg]">✦</div>
        <div className="absolute top-1/2 left-1/3 text-[60px] rotate-12">❋</div>
      </div>

      {/* Contenido */}
      <div
        className={`relative z-10 max-w-5xl mx-auto px-6 sm:px-10 lg:px-8 py-16 sm:py-20 transition-all duration-400 ${
          animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        {/* Badge de categoría */}
        <span
          className="inline-block px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-5 shadow-sm"
          style={{
            background: isDark ? 'rgba(244,164,181,0.25)' : 'rgba(83,46,35,0.1)',
            color: isDark ? '#f4a4b5' : '#532e23',
            border: `1px solid ${isDark ? 'rgba(244,164,181,0.3)' : 'rgba(83,46,35,0.15)'}`,
          }}
        >
          ✦ {slide.tag}
        </span>

        {/* Título */}
        <h1
          className="font-display text-4xl sm:text-6xl font-bold leading-tight mb-5 whitespace-pre-line"
          style={{ color: isDark ? '#fff9f5' : '#532e23' }}
        >
          {slide.title}
        </h1>

        {/* Subtítulo */}
        <p
          className="text-base sm:text-lg max-w-2xl mb-8 leading-relaxed font-light"
          style={{ color: isDark ? 'rgba(255,249,245,0.85)' : 'rgba(83,46,35,0.75)' }}
        >
          {slide.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 items-center">
          <Link
            to={slide.cta.to}
            className="px-6 py-3 rounded-full font-semibold text-sm shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: isDark ? '#f4a4b5' : '#532e23',
              color: isDark ? '#532e23' : '#fff9f5',
            }}
          >
            {slide.cta.label} →
          </Link>
          <Link
            to={slide.ctaSecondary.to}
            className="px-6 py-3 rounded-full font-medium text-sm border transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              borderColor: isDark ? 'rgba(255,249,245,0.3)' : 'rgba(83,46,35,0.25)',
              color: isDark ? '#fff9f5' : '#532e23',
            }}
          >
            {slide.ctaSecondary.label}
          </Link>
        </div>
      </div>

      {/* Indicadores de slide */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Ir al slide ${idx + 1}`}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              idx === current
                ? 'w-8 h-2.5 bg-logo-pink shadow-sm'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Flecha izquierda */}
      <button
        onClick={() => goTo((current - 1 + heroSlides.length) % heroSlides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer z-20"
        aria-label="Slide anterior"
      >
        <svg className="w-4 h-4 text-white fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Flecha derecha */}
      <button
        onClick={() => goTo((current + 1) % heroSlides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center transition-all cursor-pointer z-20"
        aria-label="Slide siguiente"
      >
        <svg className="w-4 h-4 text-white fill-none stroke-current stroke-2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>
  )
}

// ─── Componente principal Index ───────────────────────────────────────────────
export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-logo-vanilla text-logo-brown">
      <Header />

      <main className="flex-1">

        {/* ── 1. Hero Carrusel de Fondo ───────────────────────────────────── */}
        <HeroCarousel />

        {/* ── 2. Banda de confianza ──────────────────────────────────────── */}
        <div className="bg-logo-brown text-white py-3 overflow-hidden">
          <div className="flex gap-10 animate-marquee whitespace-nowrap">
            {['🎂 Tortas Personalizadas', '🍰 Tartas de Temporada', '☕ Postres de Café', '🍓 Frutas Frescas', '🎁 Pedidos Especiales', '🛵 Entregas a Domicilio', '🌿 Sin Conservantes', '💝 Hecho con Amor'].map((item, i) => (
              <span key={i} className="text-xs sm:text-sm font-medium tracking-wide text-logo-pink/90 flex-shrink-0">
                {item}
              </span>
            ))}
            {/* Duplicar para efecto infinito */}
            {['🎂 Tortas Personalizadas', '🍰 Tartas de Temporada', '☕ Postres de Café', '🍓 Frutas Frescas', '🎁 Pedidos Especiales', '🛵 Entregas a Domicilio', '🌿 Sin Conservantes', '💝 Hecho con Amor'].map((item, i) => (
              <span key={`b${i}`} className="text-xs sm:text-sm font-medium tracking-wide text-logo-pink/90 flex-shrink-0">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── 3. Propuestas de Valor ─────────────────────────────────────── */}
        <section className="bg-white/80 border-b border-logo-pink/20 py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-logo-brown">
                ¿Por Qué Elegirnos?
              </h2>
              <div className="w-12 h-1 bg-logo-pink mx-auto my-3 rounded-full" />
              <p className="text-sm text-logo-brownLight max-w-lg mx-auto">
                En Dulce Delicia cada detalle importa, desde la selección de ingredientes hasta la entrega final.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {valores.map((v, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-logo-cream/70 border border-logo-pink/20 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <span className="text-4xl block mb-3">{v.emoji}</span>
                  <h3 className="font-display text-base font-bold text-logo-brown mb-2">{v.titulo}</h3>
                  <p className="text-xs text-logo-brownLight font-light leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. Carrusel de Postres ─────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-logo-brown">
              Especialidades de la Casa
            </h2>
            <div className="w-12 h-1 bg-logo-pink mx-auto my-3 rounded-full" />
            <p className="text-sm text-logo-brownLight font-light">
              Nuestra selección de creaciones artesanales, renovadas cada temporada con los mejores sabores.
            </p>
          </div>
          <Carousel />
          <div className="text-center mt-8">
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-logo-brown text-white text-sm font-semibold hover:bg-logo-pinkHover transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Ver Catálogo Completo →
            </Link>
          </div>
        </section>

        {/* ── 5. Destacados del Menú ─────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-logo-cream to-white py-14 px-4 sm:px-6 lg:px-8 border-t border-logo-pink/15">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-logo-brown">
                Favoritos del Momento
              </h2>
              <div className="w-12 h-1 bg-logo-pink mx-auto my-3 rounded-full" />
              <p className="text-sm text-logo-brownLight">Los más pedidos por nuestra comunidad de dulce-amantes.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {destacados.map((p, i) => (
                <Link
                  key={i}
                  to="/productos"
                  className="group rounded-2xl overflow-hidden border border-logo-pink/20 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="relative h-36 sm:h-44 overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                  <div className="p-3 sm:p-4">
                    <span className="text-[10px] text-logo-pink font-semibold uppercase tracking-wider">{p.categoria}</span>
                    <p className="font-display font-bold text-sm text-logo-brown mt-0.5 line-clamp-2">{p.nombre}</p>
                    <p className="text-logo-pinkHover font-bold text-sm mt-1">{p.precio}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-logo-brown text-logo-brown text-sm font-semibold hover:bg-logo-brown hover:text-white transition-all duration-200"
              >
                Ver todos los productos →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 6. Proceso / Cómo Funciona ─────────────────────────────────── */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-logo-brown text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">
              ¿Cómo Hacer tu Pedido?
            </h2>
            <div className="w-12 h-1 bg-logo-pink mx-auto my-3 rounded-full" />
            <p className="text-sm text-logo-pinkLight/80 mb-10">En solo 3 pasos tienes tus postres favoritos</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { paso: '01', emoji: '📋', titulo: 'Elige tu Postre', desc: 'Explora nuestro catálogo y selecciona los productos que deseas.' },
                { paso: '02', emoji: '💬', titulo: 'Escríbenos', desc: 'Contáctanos por WhatsApp o el formulario con tu pedido y datos.' },
                { paso: '03', emoji: '🎁', titulo: 'Recibe en Casa', desc: 'Coordina el pago y la entrega. ¡Tu postre llegará fresco y listo!' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/8 border border-white/10">
                  <span className="text-logo-pink text-xs font-bold tracking-widest">PASO {s.paso}</span>
                  <span className="text-4xl">{s.emoji}</span>
                  <h3 className="font-display text-base font-bold text-white">{s.titulo}</h3>
                  <p className="text-xs text-logo-pinkLight/75 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/contacto"
                className="px-7 py-3 rounded-full bg-logo-pink text-logo-brown font-semibold text-sm hover:bg-logo-pinkHover hover:text-white transition-all duration-200 shadow-md"
              >
                Hacer mi Pedido 🧁
              </Link>
              <a
                href="https://wa.me/573128904521"
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3 rounded-full border border-white/30 text-white font-medium text-sm hover:bg-white/10 transition-all duration-200"
              >
                WhatsApp Directo 💬
              </a>
            </div>
          </div>
        </section>

        {/* ── 7. Testimonios ─────────────────────────────────────────────── */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-logo-vanilla border-t border-logo-pink/15">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-logo-brown">
                Lo que Dicen Nuestros Clientes
              </h2>
              <div className="w-12 h-1 bg-logo-pink mx-auto my-3 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {testimonios.map((t, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-logo-pink/20 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.estrellas }).map((_, j) => (
                      <span key={j} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-logo-brownLight leading-relaxed italic mb-4">"{t.texto}"</p>
                  <span className="text-xs font-bold text-logo-brown">— {t.nombre}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. CTA Final ───────────────────────────────────────────────── */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-logo-pink/30 via-white to-logo-pink/20 border-t border-logo-pink/20 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center justify-center p-1.5 bg-white rounded-full shadow border border-logo-pink/40 mb-2">
              <img src={logo} alt="Dulce Delicia" className="w-16 h-16 rounded-full object-cover" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-logo-brown">
              ¿Lista para Endulzar tu Día?
            </h2>
            <p className="text-sm text-logo-brownLight max-w-lg mx-auto">
              Visita nuestro catálogo completo y descubre todas las opciones. También puedes escribirnos para pedidos personalizados.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                to="/productos"
                className="px-7 py-3 rounded-full bg-logo-brown text-white font-semibold text-sm hover:bg-logo-pinkHover transition-all duration-200 shadow-md"
              >
                Ver Catálogo
              </Link>
              <Link
                to="/nosotros"
                className="px-7 py-3 rounded-full border-2 border-logo-brown text-logo-brown font-medium text-sm hover:bg-logo-brown hover:text-white transition-all duration-200"
              >
                Nuestra Historia
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
