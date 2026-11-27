import React, { useState } from 'react'
import { authService } from '../../services/api'

export default function RecoverPassword({ onBackToLogin }) {
  const [step, setStep] = useState('request') // 'request' | 'reset' | 'done'
  const [email, setEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [expiresIn, setExpiresIn] = useState(15)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const isNewPasswordValid =
    newPassword.length >= 8 &&
    !/\s/.test(newPassword) &&
    newPassword === confirmPassword

  const handleRequestSubmit = async (e) => {
    e.preventDefault()
    setTouched(true)
    setErrorMsg('')

    if (!isEmailValid) {
      setErrorMsg('Por favor ingresa un correo electrónico con formato válido.')
      return
    }

    setLoading(true)
    const res = await authService.recoverPassword(email.trim().toLowerCase())
    setLoading(false)

    if (!res.ok) {
      setErrorMsg(res.error || 'No fue posible procesar la solicitud de recuperación.')
      return
    }

    setResetToken(res.data?.reset_token || '')
    setExpiresIn(res.data?.expires_in_minutes || 15)
    setSuccessMsg(res.data?.message || 'Token de recuperación generado.')
    setStep('reset')
  }

  const handleResetSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!resetToken.trim()) {
      setErrorMsg('Debes ingresar el token de recuperación.')
      return
    }
    if (newPassword.length < 8 || /\s/.test(newPassword)) {
      setErrorMsg('La nueva contraseña debe tener al menos 8 caracteres y sin espacios.')
      return
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const res = await authService.resetPassword(resetToken.trim(), newPassword)
    setLoading(false)

    if (!res.ok) {
      setErrorMsg(res.error || 'No fue posible restablecer la contraseña.')
      return
    }

    setSuccessMsg(res.data?.message || 'Contraseña restablecida exitosamente.')
    setStep('done')
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-logo-pink/20 transition-all">
      <div className="text-center mb-6">
        <span className="text-3xl block mb-2">🔑</span>
        <h2 className="font-display text-2xl font-bold text-logo-brown">
          Recuperar Contraseña
        </h2>
        <p className="text-xs sm:text-sm text-logo-brownLight font-light mt-1">
          {step === 'request' &&
            'Ingresa tu correo electrónico registrado para generar un token seguro de recuperación.'}
          {step === 'reset' &&
            `Token válido por ${expiresIn} minutos. Define tu nueva contraseña para continuar.`}
          {step === 'done' &&
            'Tu contraseña ha sido actualizada y encriptada correctamente en la base de datos.'}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs animate-fadeIn">
          {errorMsg}
        </div>
      )}

      {step === 'request' && (
        <form onSubmit={handleRequestSubmit} className="space-y-4">
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
                if (errorMsg) setErrorMsg('')
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
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs sm:text-sm font-semibold shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Validando correo...' : 'Solicitar recuperación'}
          </button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetSubmit} className="space-y-4 animate-fadeIn">
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <p className="font-semibold mb-1">{successMsg}</p>
            <p className="text-[11px] break-all font-mono bg-white/80 p-2 rounded-lg border border-emerald-200 mt-1">
              {resetToken}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-logo-brown mb-1">
              Token de Recuperación *
            </label>
            <input
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-logo-pink/30 text-xs font-mono outline-none focus:border-logo-pink"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-logo-brown">
                Nueva Contraseña (mínimo 8 caracteres) *
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
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-logo-brown mb-1">
              Confirmar Nueva Contraseña *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-logo-pink/30 text-xs sm:text-sm outline-none focus:border-logo-pink"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isNewPasswordValid}
            className="w-full py-2.5 px-4 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Actualizando contraseña...' : 'Restablecer contraseña'}
          </button>
        </form>
      )}

      {step === 'done' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm leading-relaxed">
            <p className="font-semibold mb-1">¡Contraseña actualizada!</p>
            <p>{successMsg}</p>
          </div>
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full py-2.5 px-4 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer"
          >
            Ir a Iniciar Sesión
          </button>
        </div>
      )}

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
