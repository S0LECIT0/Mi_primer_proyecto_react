import React, { useState } from 'react'
import { authService } from '../../services/api'

export default function RegisterModal({ isOpen, onClose, onSuccessRegister }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    direccion: '',
    telefono: '',
    correo: '',
    password: '',
    confirmPassword: '',
    aceptaTratamiento: false
  })

  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [registroExitoso, setRegistroExitoso] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  if (!isOpen) return null

  // 1. Validación de Nombre y Apellido:
  // - Solo letras (incluye tildes y ñ) y espacios intermedios.
  // - PROHIBIDO números, caracteres especiales y NO puede ser solo espacios en blanco.
  const regexSoloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
  const contieneNumeros = /[0-9]/

  const nombreTrim = formData.nombre.trim()
  const isNombreValid =
    nombreTrim.length >= 2 &&
    regexSoloLetras.test(formData.nombre) &&
    !contieneNumeros.test(formData.nombre)

  const apellidoTrim = formData.apellido.trim()
  const isApellidoValid =
    apellidoTrim.length >= 2 &&
    regexSoloLetras.test(formData.apellido) &&
    !contieneNumeros.test(formData.apellido)

  // 2. Validación de Documento:
  // - No puede ser solo espacios, no caracteres extraños, entre 6 y 15 dígitos/letras
  const docTrim = formData.numeroDocumento.trim()
  const isDocValid = /^[0-9a-zA-Z]{6,15}$/.test(docTrim)

  // 3. Validación de Dirección:
  // - Mínimo 5 caracteres reales tras quitar espacios extremos
  const direccionTrim = formData.direccion.trim()
  const isDireccionValid = direccionTrim.length >= 5 && /[a-zA-Z0-9]/.test(direccionTrim)

  // 4. Validación de Teléfono:
  // - Al menos 7 dígitos numéricos reales, no solo espacios ni símbolos vacíos
  const digitosTelefono = formData.telefono.replace(/[^0-9]/g, '')
  const isPhoneValid =
    digitosTelefono.length >= 7 &&
    digitosTelefono.length <= 15 &&
    /^[0-9+ -]+$/.test(formData.telefono.trim())

  // 5. Validación de Correo:
  // - RegEx estricto de correo electrónico sin espacios intermedios
  const correoTrim = formData.correo.trim()
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correoTrim)

  // 6. Validaciones de Contraseña en tiempo real:
  const hasNoSpaces = formData.password.length > 0 && !/\s/.test(formData.password)
  const hasMinLength = formData.password.length >= 10
  const hasUpperCase = /[A-Z]/.test(formData.password)
  const hasLowerCase = /[a-z]/.test(formData.password)
  const hasNumber = /[0-9]/.test(formData.password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-]/.test(formData.password)

  // No incluir el nombre ni el apellido en la contraseña
  const passwordLower = formData.password.toLowerCase()
  const notContainsName =
    (!nombreTrim || !passwordLower.includes(nombreTrim.toLowerCase())) &&
    (!apellidoTrim || !passwordLower.includes(apellidoTrim.toLowerCase()))

  const passwordsMatch =
    formData.password.length > 0 && formData.password === formData.confirmPassword

  const isPasswordValid =
    hasNoSpaces &&
    hasMinLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar &&
    notContainsName &&
    passwordsMatch

  // Validación Integral del Formulario
  const isFormValid =
    isNombreValid &&
    isApellidoValid &&
    isDocValid &&
    isDireccionValid &&
    isPhoneValid &&
    isEmailValid &&
    isPasswordValid &&
    formData.aceptaTratamiento

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!isFormValid) return

    setLoading(true)

    // Datos limpios del formulario
    const newUser = {
      ...formData,
      nombre: nombreTrim,
      apellido: apellidoTrim,
      numeroDocumento: docTrim,
      direccion: direccionTrim,
      telefono: formData.telefono.trim(),
      correo: correoTrim.toLowerCase(),
      id: Date.now(),
      rol: 'Cliente',
      fechaRegistro: new Date().toISOString()
    }

    // 1. Intentar registrar en FastAPI / Neon Tech
    const apiRes = await authService.register(newUser)

    if (apiRes.ok) {
      // Guardar también en localStorage para consistencia offline
      const existingUsers = JSON.parse(localStorage.getItem('dulce_delicia_users') || '[]')
      existingUsers.push(newUser)
      localStorage.setItem('dulce_delicia_users', JSON.stringify(existingUsers))

      setLoading(false)
      setRegistroExitoso(true)
      setTimeout(() => {
        setRegistroExitoso(false)
        onSuccessRegister?.(correoTrim.toLowerCase())
        onClose()
      }, 1600)
      return
    }

    // Si falló por error de validación del servidor (ej. email o documento duplicado)
    if (apiRes.error && !apiRes.error.includes('conexión') && !apiRes.error.includes('Failed to fetch')) {
      setLoading(false)
      setServerError(apiRes.error)
      return
    }

    // 2. Si el servidor FastAPI no está corriendo, registrar localmente
    const existingUsers = JSON.parse(localStorage.getItem('dulce_delicia_users') || '[]')
    const alreadyExists = existingUsers.some(
      (u) => (u.correo || u.email || '').toLowerCase() === correoTrim.toLowerCase()
    )

    if (alreadyExists) {
      setLoading(false)
      setServerError('Ya existe una cuenta registrada con este correo electrónico.')
      return
    }

    existingUsers.push(newUser)
    localStorage.setItem('dulce_delicia_users', JSON.stringify(existingUsers))

    setLoading(false)
    setRegistroExitoso(true)
    setTimeout(() => {
      setRegistroExitoso(false)
      onSuccessRegister?.(correoTrim.toLowerCase())
      onClose()
    }, 1600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-logo-brown/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-logo-pink/30 overflow-hidden my-6 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="relative bg-gradient-to-r from-logo-cream via-white to-logo-pinkLight/40 p-5 sm:p-6 border-b border-logo-pink/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧁</span>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-logo-brown leading-tight">
                Crear Cuenta de Cliente
              </h2>
              <p className="text-xs text-logo-brownLight font-light">
                Únete a Dulce Delicia y disfruta de pedidos rápidos y descuentos.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-logo-pink/20 text-logo-brown hover:text-logo-pinkHover flex items-center justify-center text-lg shadow-sm border border-logo-pink/20 transition-all focus:outline-none"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Notificación de error del servidor */}
        {serverError && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 animate-fadeIn">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-bold">No fue posible registrar la cuenta</h4>
              <p className="text-xs text-rose-700">{serverError}</p>
            </div>
          </div>
        )}

        {/* Notificación de éxito */}
        {registroExitoso && (
          <div className="mx-6 mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-fadeIn">
            <span className="text-2xl">🎉</span>
            <div>
              <h4 className="font-bold">¡Cuenta creada con éxito!</h4>
              <p className="text-xs text-emerald-700">Redirigiendo al inicio de sesión para que ingreses con tus datos...</p>
            </div>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Fila 1: Nombre y Apellido (Sin números ni solo espacios) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-logo-brown mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={() => handleBlur('nombre')}
                placeholder="Ej. Valentina"
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                  touched.nombre
                    ? isNombreValid
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-rose-400 bg-rose-50/30'
                    : 'border-logo-pink/30 focus:border-logo-pink'
                }`}
              />
              {touched.nombre && !isNombreValid && (
                <p className="text-[11px] text-rose-500 mt-0.5">
                  {contieneNumeros.test(formData.nombre)
                    ? '⚠️ El nombre NO puede contener números.'
                    : nombreTrim.length === 0
                    ? '⚠️ El campo no puede ser solo espacios en blanco.'
                    : '⚠️ Solo se permiten letras (mínimo 2 caracteres).'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-logo-brown mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                onBlur={() => handleBlur('apellido')}
                placeholder="Ej. Restrepo"
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                  touched.apellido
                    ? isApellidoValid
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-rose-400 bg-rose-50/30'
                    : 'border-logo-pink/30 focus:border-logo-pink'
                }`}
              />
              {touched.apellido && !isApellidoValid && (
                <p className="text-[11px] text-rose-500 mt-0.5">
                  {contieneNumeros.test(formData.apellido)
                    ? '⚠️ El apellido NO puede contener números.'
                    : apellidoTrim.length === 0
                    ? '⚠️ El campo no puede ser solo espacios en blanco.'
                    : '⚠️ Solo se permiten letras (mínimo 2 caracteres).'}
                </p>
              )}
            </div>
          </div>

          {/* Fila 2: Tipo y Número de Documento */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-logo-brown mb-1">
                Tipo de Documento *
              </label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-logo-pink/30 bg-white text-xs sm:text-sm outline-none focus:border-logo-pink"
              >
                <option value="CC">Cédula de Ciudadanía (C.C.)</option>
                <option value="CE">Cédula de Extranjería (C.E.)</option>
                <option value="TI">Tarjeta de Identidad (T.I.)</option>
                <option value="PAS">Pasaporte</option>
              </select>
            </div>

            <div className="sm:col-span-7">
              <label className="block text-xs font-semibold text-logo-brown mb-1">
                Número de Documento *
              </label>
              <input
                type="text"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                onBlur={() => handleBlur('numeroDocumento')}
                placeholder="Ej. 1020304050"
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                  touched.numeroDocumento
                    ? isDocValid
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-rose-400 bg-rose-50/30'
                    : 'border-logo-pink/30 focus:border-logo-pink'
                }`}
              />
              {touched.numeroDocumento && !isDocValid && (
                <p className="text-[11px] text-rose-500 mt-0.5">
                  {docTrim.length === 0
                    ? '⚠️ No puede estar vacío ni contener solo espacios.'
                    : '⚠️ Debe contener entre 6 y 15 dígitos alfanuméricos sin espacios.'}
                </p>
              )}
            </div>
          </div>

          {/* Fila 3: Dirección y Teléfono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-logo-brown mb-1">
                Dirección de Domicilio *
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                onBlur={() => handleBlur('direccion')}
                placeholder="Calle 10 # 43 - 20, Apto 301"
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                  touched.direccion
                    ? isDireccionValid
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-rose-400 bg-rose-50/30'
                    : 'border-logo-pink/30 focus:border-logo-pink'
                }`}
              />
              {touched.direccion && !isDireccionValid && (
                <p className="text-[11px] text-rose-500 mt-0.5">
                  {direccionTrim.length === 0
                    ? '⚠️ No puede estar vacía ni contener solo espacios.'
                    : '⚠️ Ingresa una dirección válida (mínimo 5 caracteres).'}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-logo-brown mb-1">
                Teléfono de Contacto *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                onBlur={() => handleBlur('telefono')}
                placeholder="+57 300 123 4567"
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                  touched.telefono
                    ? isPhoneValid
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-rose-400 bg-rose-50/30'
                    : 'border-logo-pink/30 focus:border-logo-pink'
                }`}
              />
              {touched.telefono && !isPhoneValid && (
                <p className="text-[11px] text-rose-500 mt-0.5">
                  {digitosTelefono.length === 0
                    ? '⚠️ El teléfono no puede contener solo espacios.'
                    : '⚠️ Ingresa un número telefónico válido (mínimo 7 dígitos).'}
                </p>
              )}
            </div>
          </div>

          {/* Fila 4: Correo Electrónico */}
          <div>
            <label className="block text-xs font-semibold text-logo-brown mb-1">
              Correo Electrónico (será tu usuario) *
            </label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              onBlur={() => handleBlur('correo')}
              placeholder="tuemail@ejemplo.com"
              required
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                touched.correo
                  ? isEmailValid
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-rose-400 bg-rose-50/30'
                  : 'border-logo-pink/30 focus:border-logo-pink'
              }`}
            />
            {touched.correo && !isEmailValid && (
              <p className="text-[11px] text-rose-500 mt-0.5">
                {correoTrim.length === 0
                  ? '⚠️ El correo no puede estar en blanco ni contener solo espacios.'
                  : '⚠️ Por favor introduce un correo electrónico válido (ej. usuario@gmail.com).'}
              </p>
            )}
          </div>

          {/* Fila 5: Contraseña y Confirmación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-logo-brown">
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                placeholder="Mínimo 10 caracteres"
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                  touched.password
                    ? isPasswordValid
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-amber-400 bg-amber-50/20'
                    : 'border-logo-pink/30 focus:border-logo-pink'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-logo-brown mb-1">
                Confirmar Contraseña *
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="Repite la contraseña"
                required
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                  formData.confirmPassword
                    ? passwordsMatch
                      ? 'border-emerald-400 bg-emerald-50/30'
                      : 'border-rose-400 bg-rose-50/30'
                    : 'border-logo-pink/30 focus:border-logo-pink'
                }`}
              />
              {formData.confirmPassword && !passwordsMatch && (
                <p className="text-[11px] text-rose-500 mt-0.5">⚠️ Las contraseñas no coinciden.</p>
              )}
            </div>
          </div>

          {/* Checklist de Requisitos de Seguridad de Contraseña */}
          <div className="p-3.5 rounded-2xl bg-logo-cream/70 border border-logo-pink/20 space-y-1.5 text-xs">
            <span className="font-semibold text-logo-brown block mb-1">
              Requisitos de seguridad de la contraseña:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              <span className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                {hasMinLength ? '✓' : '○'} Mínimo 10 caracteres
              </span>
              <span className={`flex items-center gap-1.5 ${hasNoSpaces && formData.password.length > 0 ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                {hasNoSpaces && formData.password.length > 0 ? '✓' : '○'} Sin espacios en blanco
              </span>
              <span className={`flex items-center gap-1.5 ${hasUpperCase ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                {hasUpperCase ? '✓' : '○'} Al menos 1 mayúscula
              </span>
              <span className={`flex items-center gap-1.5 ${hasLowerCase ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                {hasLowerCase ? '✓' : '○'} Al menos 1 minúscula
              </span>
              <span className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                {hasNumber ? '✓' : '○'} Al menos 1 número
              </span>
              <span className={`flex items-center gap-1.5 ${hasSpecialChar ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                {hasSpecialChar ? '✓' : '○'} Al menos 1 carácter especial (!@#$...)
              </span>
              <span className={`flex items-center gap-1.5 sm:col-span-2 ${notContainsName && formData.password.length > 0 ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                {notContainsName && formData.password.length > 0 ? '✓' : '○'} No incluye tu nombre ni apellido
              </span>
              <span className={`flex items-center gap-1.5 sm:col-span-2 ${passwordsMatch ? 'text-emerald-600 font-medium' : 'text-gray-500'}`}>
                {passwordsMatch ? '✓' : '○'} Coincide con la confirmación
              </span>
            </div>
          </div>

          {/* Casilla de Tratamiento de Datos */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-logo-brownLight">
              <input
                type="checkbox"
                name="aceptaTratamiento"
                checked={formData.aceptaTratamiento}
                onChange={handleChange}
                required
                className="mt-0.5 rounded text-logo-pink focus:ring-logo-pink"
              />
              <span>
                Acepto la política obligatoria de tratamiento de datos personales para la gestión de mis pedidos y cuenta de cliente en Dulce Delicia.
              </span>
            </label>
          </div>

          {/* Botones de Acción */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-logo-pink/20">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isFormValid || registroExitoso || loading}
              className={`w-full sm:w-auto px-7 py-2.5 rounded-full text-white text-xs sm:text-sm font-semibold shadow-md transition-all ${
                isFormValid && !loading
                  ? 'bg-logo-pink hover:bg-logo-pinkHover hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {loading ? 'Registrando en servidor...' : 'Crear cuenta'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
