import React, { useState } from 'react'

export default function RecoverPassword({ onBackToLogin }) {
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState(null) // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('')

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched(true)

    if (!isEmailValid) {
      setStatus('error')
      setMessage('Por favor ingresa un correo electrónico con formato válido.')
      return
    }

    setStatus('loading')
    setMessage('')

    // Simulación de envío de enlace de recuperación (preparado para backend FastAPI)
    setTimeout(() => {
      setStatus('success')
      setMessage(
        `Hemos enviado un enlace de recuperación al correo ${email}. Por favor revisa tu bandeja de entrada o spam.`
      )
    }, 1200)
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-logo-pink/20 transition-all">
      <div className="text-center mb-6">
        <span className="text-3xl block mb-2">🔑</span>
        <h2 className="font-display text-2xl font-bold text-logo-brown">
          Recuperar Contraseña
        </h2>
        <p className="text-xs sm:text-sm text-logo-brownLight font-light mt-1">
          Ingresa tu correo electrónico registrado y te enviaremos las instrucciones para restablecer tu clave.
        </p>
      </div>

      {status === 'success' && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm leading-relaxed animate-fadeIn">
          <p className="font-semibold mb-1">¡Correo enviado con éxito!</p>
          <p>{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-fadeIn">
          {message}
        </div>
      )}

      {status !== 'success' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recover-email" className="block text-xs font-semibold text-logo-brown mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              id="recover-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') setStatus(null)
              }}
              onBlur={() => setTouched(true)}
              placeholder="nombre@ejemplo.com"
              required
              className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm outline-none transition-all ${
                touched
                  ? isEmailValid
                    ? 'border-emerald-400 bg-emerald-50/20'
                    : 'border-rose-400 bg-rose-50/30'
                  : 'border-logo-pink/30 focus:border-logo-pink'
              }`}
            />
            {touched && !isEmailValid && (
              <p className="text-[11px] text-rose-500 mt-1">
                El formato del correo electrónico no es válido.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full py-2.5 px-4 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            {status === 'loading' ? 'Enviando solicitud...' : 'Recuperar contraseña'}
          </button>
        </form>
      ) : null}

      <div className="mt-6 pt-4 border-t border-logo-pink/20 text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="text-xs text-logo-brownLight hover:text-logo-pinkHover font-medium hover:underline inline-flex items-center gap-1.5 transition-colors"
        >
          <span>←</span> Regresar al inicio de sesión
        </button>
      </div>
    </div>
  )
}
