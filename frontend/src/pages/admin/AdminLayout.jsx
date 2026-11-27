import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import LogoutModal from '../../components/auth/LogoutModal'
import logo from '../../assets/logo.jpg'

export default function AdminLayout() {
  const [currentUser, setCurrentUser] = useState(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Verificar sesión administrativa
    const session =
      localStorage.getItem('dulce_delicia_session') ||
      sessionStorage.getItem('dulce_delicia_session')

    if (session) {
      try {
        const parsed = JSON.parse(session)
        setCurrentUser(parsed)
      } catch (e) {
        setCurrentUser(null)
      }
    } else {
      // Iniciar sesión temporal como Administrador para facilidad de pruebas
      const defaultAdmin = {
        correo: 'admin@dulcedelicia.com',
        nombre: 'Administrador',
        apellido: 'Dulce Delicia',
        rol: 'Administrador'
      }
      localStorage.setItem('dulce_delicia_session', JSON.stringify(defaultAdmin))
      setCurrentUser(defaultAdmin)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('dulce_delicia_session')
    sessionStorage.removeItem('dulce_delicia_session')
    navigate('/login')
  }

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-3 px-4 py-3 rounded-2xl bg-logo-pink text-white font-semibold text-sm shadow-sm transition-all'
      : 'flex items-center gap-3 px-4 py-3 rounded-2xl text-logo-brownLight hover:bg-logo-pinkLight/60 hover:text-logo-brown font-medium text-sm transition-all'

  const isAdmin = currentUser?.rol === 'Administrador'

  return (
    <div className="min-h-screen bg-[#faf5f0] text-logo-brown flex">
      
      {/* 1. SIDEBAR FIJO LATERAL (Desktop) */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-logo-pink/20 fixed inset-y-0 left-0 z-30 shadow-sm">
        {/* Encabezado del Sidebar con Logo */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-logo-pink/15">
          <img
            src={logo}
            alt="Logo Dulce Delicia"
            className="w-10 h-10 rounded-full object-cover border border-logo-pink/40"
          />
          <div>
            <h1 className="font-display font-bold text-base text-logo-brown leading-tight">
              Dulce Delicia
            </h1>
            <span className="text-[10px] tracking-wider uppercase font-semibold text-logo-pinkHover">
              Panel de Control
            </span>
          </div>
        </div>

        {/* Tarjeta del Usuario Autenticado y Rol */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-logo-cream/80 border border-logo-pink/20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-logo-pink/20 text-logo-brown font-bold flex items-center justify-center text-sm shrink-0">
            {currentUser?.nombre?.[0] || 'A'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-logo-brown truncate">
              {currentUser?.nombre} {currentUser?.apellido}
            </h4>
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mt-0.5 ${
              isAdmin
                ? 'bg-purple-100 text-purple-700'
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              {currentUser?.rol || 'Administrador'}
            </span>
          </div>
        </div>

        {/* Menú de Navegación por Módulos */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto" aria-label="Módulos administrativos">
          <NavLink to="/admin" end className={navLinkClass}>
            <span className="text-lg">📊</span>
            <span>Dashboard</span>
          </NavLink>

          {/* Gestión de Usuarios y Roles (Permiso de Administrador) */}
          <NavLink to="/admin/usuarios" className={navLinkClass}>
            <span className="text-lg">👥</span>
            <span>Usuarios y Roles</span>
          </NavLink>

          {/* Gestión de Productos / Catálogo de Postres */}
          <NavLink to="/admin/productos" className={navLinkClass}>
            <span className="text-lg">🧁</span>
            <span>Catálogo de Postres</span>
          </NavLink>
        </nav>

        {/* Pie del Sidebar: Ver Tienda y Cerrar Sesión */}
        <div className="p-4 border-t border-logo-pink/15 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-logo-brown hover:bg-logo-pinkLight/50 transition-colors"
          >
            <span>🛍️</span>
            <span>Ir a la Tienda Pública</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
          >
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* 2. SIDEBAR MÓVIL DESPLEGABLE */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="relative w-64 max-w-[80vw] bg-white h-full flex flex-col p-4 shadow-2xl z-10 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-logo-pink/20 mb-4">
              <span className="font-display font-bold text-base text-logo-brown">Menú Admin</span>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1 font-bold"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              <NavLink to="/admin" end onClick={() => setMobileSidebarOpen(false)} className={navLinkClass}>
                <span>📊</span> <span>Dashboard</span>
              </NavLink>
              <NavLink to="/admin/usuarios" onClick={() => setMobileSidebarOpen(false)} className={navLinkClass}>
                <span>👥</span> <span>Usuarios y Roles</span>
              </NavLink>
              <NavLink to="/admin/productos" onClick={() => setMobileSidebarOpen(false)} className={navLinkClass}>
                <span>🧁</span> <span>Catálogo de Postres</span>
              </NavLink>
              <Link to="/" onClick={() => setMobileSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-logo-brown">
                <span>🛍️</span> <span>Tienda Pública</span>
              </Link>
            </nav>
            <button
              onClick={() => {
                setMobileSidebarOpen(false)
                setIsLogoutModalOpen(true)
              }}
              className="mt-auto py-2.5 px-4 rounded-xl text-rose-600 font-semibold text-xs bg-rose-50 hover:bg-rose-100 flex items-center gap-2 cursor-pointer"
            >
              <span>🚪</span> <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. CONTENEDOR PRINCIPAL */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* NAVBAR SUPERIOR FIJO */}
        <header className="sticky top-0 z-20 h-20 bg-white/95 backdrop-blur-md border-b border-logo-pink/20 px-4 sm:px-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {/* Botón menú móvil */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-logo-brown hover:bg-logo-pinkLight/60 focus:outline-none"
              aria-label="Abrir menú lateral"
            >
              <svg className="w-6 h-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-logo-brown leading-tight">
                {location.pathname === '/admin' && 'Panel de Administración'}
                {location.pathname === '/admin/usuarios' && 'Gestión de Usuarios y Roles'}
                {location.pathname === '/admin/productos' && 'Gestión del Catálogo de Postres'}
              </h2>
              <span className="text-[11px] text-logo-brownLight font-light hidden sm:inline">
                Dulce Delicia Repostería &bull; Operaciones CRUD activas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistema Operativo
            </span>

            <div className="w-9 h-9 rounded-full bg-logo-pink/20 text-logo-brown font-bold flex items-center justify-center text-xs border border-logo-pink/30">
              {currentUser?.nombre?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* ÁREA DE CONTENIDO DINÁMICO */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Modal de Confirmación de Cierre de Sesión */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutModalOpen(false)}
      />

    </div>
  )
}
