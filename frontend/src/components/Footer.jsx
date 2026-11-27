import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpg'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-logo-brown text-logo-cream border-t-4 border-logo-pink mt-auto">
      {/* Contenido Principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Columna 1: Logo e identidad */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Logo Dulce Delicia"
                className="w-12 h-12 rounded-full object-cover border-2 border-logo-pink shadow-sm"
              />
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-white leading-none">
                  Dulce <span className="text-logo-pink">Delicia</span>
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-logo-pinkLight mt-0.5">
                  Repostería
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-logo-pinkLight/80 leading-relaxed">
              Postres artesanales, pasteles temáticos y recetas tradicionales horneadas con amor y los mejores ingredientes.
            </p>
            {/* Redes Sociales */}
            <div className="pt-1">
              <span className="text-[11px] uppercase tracking-wider text-logo-pink font-semibold block mb-2">
                Conéctate con nosotros
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-logo-pink hover:text-logo-brown flex items-center justify-center transition-all text-xs"
                  aria-label="Instagram"
                >
                  📸
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-logo-pink hover:text-logo-brown flex items-center justify-center transition-all text-xs"
                  aria-label="Facebook"
                >
                  👍
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-logo-pink hover:text-logo-brown flex items-center justify-center transition-all text-xs"
                  aria-label="TikTok"
                >
                  🎵
                </a>
                <a
                  href="https://wa.me/573128904521"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-emerald-500 flex items-center justify-center transition-all text-xs"
                  aria-label="WhatsApp"
                >
                  💬
                </a>
              </div>
            </div>
          </div>

          {/* Columna 2: Enlaces Rápidos */}
          <div>
            <h3 className="font-display text-base font-semibold text-white mb-3">
              Páginas
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-logo-pinkLight/80">
              <li>
                <Link to="/" className="hover:text-logo-pink transition-colors">
                  • Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="hover:text-logo-pink transition-colors">
                  • Catálogo de Productos
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="hover:text-logo-pink transition-colors">
                  • ¿Quiénes somos?
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-logo-pink transition-colors">
                  • Contacto y Pedidos
                </Link>
              </li>
            </ul>
            <div className="mt-4 p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-logo-pinkLight/70">
              Horario: Lun - Sáb 8:00 AM - 7:30 PM
            </div>
          </div>

          {/* Columna 3: Información de Contacto */}
          <div className="space-y-2.5 text-xs sm:text-sm text-logo-pinkLight/80">
            <h3 className="font-display text-base font-semibold text-white mb-3">
              Atención
            </h3>
            <div className="flex items-start gap-2">
              <span className="text-logo-pink">📍</span>
              <p>Avenida Primavera #124, Barrio El Rosedal, Medellín</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-logo-pink">📞</span>
              <p>+57 312 890 4521</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-logo-pink">📧</span>
              <a href="mailto:pedidos@dulcedelicia.com" className="hover:text-white underline">
                pedidos@dulcedelicia.com
              </a>
            </div>
          </div>

          {/* Columna 4: Mapa de Ubicación Google Maps */}
          <div>
            <h3 className="font-display text-base font-semibold text-white mb-2">
              Ubicación
            </h3>
            <div className="w-full h-28 rounded-lg overflow-hidden border border-white/20 shadow-sm">
              <iframe
                title="Ubicación de Dulce Delicia"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0526715699477!2d-75.57864832512684!3d6.256790926207137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428fa3f80c6c7%3A0x6b63d1264c8c7348!2sMedell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </div>

      {/* Franja de Derechos y Propiedad Intelectual */}
      <div className="bg-[#3e2017] py-3.5 border-t border-white/10 text-center text-xs text-logo-pinkLight/60 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px]">
          <p>
            &copy; {currentYear} <strong>Dulce Delicia Repostería</strong>. Todos los derechos reservados.
          </p>
          <p>
            Propiedad intelectual y recetas artesanales protegidas.
          </p>
        </div>
      </div>
    </footer>
  )
}
