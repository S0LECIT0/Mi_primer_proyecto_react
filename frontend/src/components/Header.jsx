import React, { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import LogoutModal from './auth/LogoutModal'
import logo from '../assets/logo.jpg'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userSession, setUserSession] = useState(null)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Comprobar si hay sesión activa
    const session =
      localStorage.getItem('dulce_delicia_session') ||
      sessionStorage.getItem('dulce_delicia_session')
    if (session) {
      try {
        setUserSession(JSON.parse(session))
      } catch (e) {
        setUserSession(null)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('dulce_delicia_session')
    sessionStorage.removeItem('dulce_delicia_session')
    setUserSession(null)
    navigate('/')
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'px-4 py-2 rounded-full text-sm font-semibold text-logo-brown bg-logo-pink/20 transition-all duration-200'
      : 'px-4 py-2 rounded-full text-sm font-medium text-logo-brownLight hover:text-logo-brown hover:bg-logo-pinkLight/60 transition-all duration-200'

  const mobileNavLinkClass = ({ isActive }) =>
    isActive
      ? 'block px-4 py-2.5 rounded-xl text-base font-semibold text-logo-brown bg-logo-pink/20'
      : 'block px-4 py-2.5 rounded-xl text-base font-medium text-logo-brownLight hover:text-logo-brown hover:bg-logo-pinkLight/60'

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-logo-pink/20 shadow-sm transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logotipo con imagen oficial */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src={logo}
                alt="Logo Dulce Delicia Repostería"
                className="w-12 h-12 rounded-full object-cover border-2 border-logo-pink/40 shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-2xl font-bold tracking-tight text-logo-brown leading-none">
                Dulce <span className="text-logo-pinkHover">Delicia</span>
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-logo-brownLight mt-0.5">
                Repostería
              </span>
            </div>
          </Link>

          {/* Menú de escritorio limpio y despejado */}
          <nav className="hidden md:flex items-center gap-1.5" aria-label="Navegación principal">
            <NavLink to="/" className={navLinkClass} end>
              Inicio
            </NavLink>
            <NavLink to="/nosotros" className={navLinkClass}>
              ¿Quiénes somos?
            </NavLink>
            <NavLink to="/contacto" className={navLinkClass}>
              Contacto
            </NavLink>

            {/* Botón de Autenticación / Mi Cuenta */}
            {userSession ? (
              <div className="flex items-center gap-2 ml-3 pl-3 border-l border-logo-pink/30">
                <span className="text-xs font-semibold text-logo-brown">
                  Hola, {userSession.nombre.split(' ')[0]}
                </span>
                {userSession.rol !== 'Cliente' && (
                  <Link
                    to="/admin"
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-logo-brown text-white hover:bg-logo-brownLight transition-colors"
                  >
                    Panel
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setIsLogoutModalOpen(true)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-3 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-logo-pink hover:bg-logo-pinkHover text-white shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1.5"
              >
                <span>👤</span>
                <span>Ingresar</span>
              </Link>
            )}
          </nav>

          {/* Botón menú móvil */}
          <div className="flex md:hidden items-center gap-2">
            {!userSession && (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-logo-pink text-white"
              >
                Ingresar
              </Link>
            )}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 rounded-xl text-logo-brown hover:bg-logo-pinkLight/60 focus:outline-none"
              aria-label="Abrir menú"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-logo-pink/20 bg-white px-4 pt-3 pb-4 space-y-1 shadow-lg">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
            end
          >
            Inicio
          </NavLink>
          <NavLink
            to="/nosotros"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            ¿Quiénes somos?
          </NavLink>
          <NavLink
            to="/contacto"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Contacto
          </NavLink>
          {userSession ? (
            <div className="pt-2 border-t border-logo-pink/20 flex items-center justify-between px-2">
              <span className="text-xs font-medium text-logo-brown">
                Sesión: {userSession.nombre} ({userSession.rol})
              </span>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setIsLogoutModalOpen(true)
                }}
                className="text-xs text-rose-600 font-semibold cursor-pointer"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass}
            >
              Iniciar Sesión / Registrarse
            </NavLink>
          )}
        </div>
      )}

      {/* Modal de Confirmación de Cierre de Sesión */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </header>
  )
}
