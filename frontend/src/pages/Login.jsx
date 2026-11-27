import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import RegisterModal from '../components/auth/RegisterModal'
import RecoverPassword from '../components/auth/RecoverPassword'
import WhatsAppButton from '../components/WhatsAppButton'
import logo from '../assets/logo.jpg'
import { authService } from '../services/api'

export default function Login() {
  const navigate = useNavigate()

  // Estados del Login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({})
  const [errorMsg, setErrorMsg] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)

  // Estados de Vistas Secundarias (Modal de Registro y Recuperación de contraseña)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [viewMode, setViewMode] = useState('login') // 'login' | 'recover'

  // Validaciones en tiempo real
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = password.length >= 6 // Longitud básica para login
  const isFormValid = isEmailValid && isPasswordValid

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    setErrorMsg('')

    if (!isEmailValid) {
      setErrorMsg('El formato del correo electrónico no es válido.')
      return
    }

    if (!password) {
      setErrorMsg('Debes ingresar tu contraseña.')
      return
    }

    setLoading(true)

    // 1. Intentar autenticar contra el backend FastAPI (Neon Tech)
    const apiRes = await authService.login(email.trim().toLowerCase(), password)

    if (apiRes.ok && apiRes.data?.access_token) {
      const u = apiRes.data.user
      const sessionData = {
        correo: u.email,
        nombre: u.nombre,
        apellido: u.apellido,
        rol: u.rol?.nombre || (u.rol_id === 1 ? 'Administrador' : u.rol_id === 2 ? 'Empleado' : 'Cliente'),
        token: apiRes.data.access_token,
        access_token: apiRes.data.access_token
      }

      authService.setSession(sessionData, rememberMe)
      setCurrentUser(sessionData)
      setLoginSuccess(true)
      setLoading(false)

      setTimeout(() => {
        if (sessionData.rol === 'Administrador' || sessionData.rol === 'Empleado') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      }, 1200)
      return
    }

    // 2. Si el backend FastAPI no está respondiendo, usar usuarios locales de contingencia
    const storedUsers = JSON.parse(localStorage.getItem('dulce_delicia_users') || '[]')
    const demoUsers = [
      {
        correo: 'admin@dulcedelicia.com',
        password: 'Password@2026',
        nombre: 'Administrador',
        apellido: 'Dulce Delicia',
        rol: 'Administrador'
      },
      {
        correo: 'admin@dulcedelicia.com',
        password: 'Dulce2026*!',
        nombre: 'Administrador',
        apellido: 'Dulce Delicia',
        rol: 'Administrador'
      },
      {
        correo: 'empleado@dulcedelicia.com',
        password: 'Dulce2026*!',
        nombre: 'Carlos',
        apellido: 'Mendoza',
        rol: 'Empleado'
      },
      {
        correo: 'cliente@dulcedelicia.com',
        password: 'Dulce2026*!',
        nombre: 'Sofía',
        apellido: 'Gómez',
        rol: 'Cliente'
      },
      ...storedUsers
    ]

    const userFound = demoUsers.find(
      (u) => (u.correo || u.email || '').toLowerCase() === email.trim().toLowerCase()
    )

    if (!userFound) {
      setLoading(false)
      setErrorMsg(apiRes.error || 'No existe ninguna cuenta registrada con este correo electrónico.')
      return
    }

    if (userFound.password !== password) {
      setLoading(false)
      setErrorMsg('Contraseña incorrecta. Por favor verifica e intenta nuevamente.')
      return
    }

    const sessionData = {
      correo: userFound.correo || userFound.email,
      nombre: userFound.nombre,
      apellido: userFound.apellido,
      rol: userFound.rol || 'Cliente',
      token: 'jwt_local_' + Date.now()
    }

    authService.setSession(sessionData, rememberMe)
    setCurrentUser(sessionData)
    setLoginSuccess(true)
    setLoading(false)

    setTimeout(() => {
      if (sessionData.rol === 'Administrador' || sessionData.rol === 'Empleado') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    }, 1200)
  }

  const handleRegisteredSuccess = (newEmail) => {
    setEmail(newEmail)
    setErrorMsg('')
  }

  return (
    <div className="min-h-screen flex flex-col bg-logo-vanilla text-logo-brown">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">

          {/* Alternar entre Login y Recuperación de Contraseña */}
          {viewMode === 'recover' ? (
            <RecoverPassword onBackToLogin={() => setViewMode('login')} />
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-logo-pink/20 overflow-hidden transition-all">
              
              {/* Cabecera con Logotipo */}
              <div className="bg-gradient-to-b from-white via-logo-cream to-logo-pinkLight/30 p-6 text-center border-b border-logo-pink/15">
                <div className="inline-block p-1 bg-white rounded-full shadow-sm border border-logo-pink/30 mb-2">
                  <img
                    src={logo}
                    alt="Logo Dulce Delicia"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
                <h1 className="font-display text-2xl font-bold text-logo-brown">
                  Iniciar Sesión
                </h1>
                <p className="text-xs text-logo-brownLight font-light mt-0.5">
                  Ingresa a tu cuenta para gestionar pedidos y beneficios.
                </p>
              </div>

              {/* Mensajes de Alerta y Estado */}
              <div className="px-6 sm:px-8 pt-5">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn mb-4">
                    <span>⚠️</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {loginSuccess && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn mb-4">
                    <span>✅</span>
                    <span>
                      ¡Bienvenido, <strong>{currentUser?.nombre}</strong>! Accediendo como {currentUser?.rol}...
                    </span>
                  </div>
                )}
              </div>

              {/* Formulario de Login */}
              <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 pt-2 space-y-4">
                
                {/* Campo de Correo Electrónico */}
                <div>
                  <label htmlFor="login-email" className="block text-xs font-semibold text-logo-brown mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errorMsg) setErrorMsg('')
                    }}
                    onBlur={() => handleBlur('email')}
                    placeholder="usuario@ejemplo.com"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                      touched.email
                        ? isEmailValid
                          ? 'border-emerald-400 bg-emerald-50/20'
                          : 'border-rose-400 bg-rose-50/20'
                        : 'border-logo-pink/30 focus:border-logo-pink focus:ring-1 focus:ring-logo-pink'
                    }`}
                  />
                  {touched.email && !isEmailValid && (
                    <p className="text-[11px] text-rose-500 mt-1">Formato de correo inválido.</p>
                  )}
                </div>

                {/* Campo de Contraseña */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="login-password" className="block text-xs font-semibold text-logo-brown">
                      Contraseña *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[11px] text-logo-pinkHover hover:underline font-medium"
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errorMsg) setErrorMsg('')
                    }}
                    onBlur={() => handleBlur('password')}
                    placeholder="••••••••"
                    required
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                      touched.password && !password
                        ? 'border-rose-400 bg-rose-50/20'
                        : 'border-logo-pink/30 focus:border-logo-pink'
                    }`}
                  />
                </div>

                {/* Recordarme y ¿Olvidaste tu contraseña? */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-logo-brownLight">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded text-logo-pink focus:ring-logo-pink"
                    />
                    <span>Recordarme</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setViewMode('recover')}
                    className="text-logo-pinkHover hover:underline font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {/* Botón Iniciar Sesión */}
                <button
                  type="submit"
                  disabled={loginSuccess || loading}
                  className="w-full py-2.5 px-4 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  {loginSuccess ? '¡Ingreso Exitoso!' : loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>

                {/* Enlace o botón para Crear Cuenta (Modal) */}
                <div className="pt-4 border-t border-logo-pink/20 text-center">
                  <p className="text-xs text-logo-brownLight mb-2 font-light">
                    ¿Aún no tienes una cuenta de cliente?
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsRegisterOpen(true)}
                    className="w-full py-2 px-4 rounded-full border border-logo-pink text-logo-brown hover:bg-logo-pinkLight/60 text-xs sm:text-sm font-semibold transition-colors"
                  >
                    Crear una cuenta nueva
                  </button>
                </div>

              </form>
            </div>
          )}

        </div>
      </main>

      {/* Ventana Modal de Registro Reutilizable */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccessRegister={handleRegisteredSuccess}
      />

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
