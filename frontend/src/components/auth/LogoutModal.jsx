import React from 'react'

export default function LogoutModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-logo-brown/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-logo-pink/30 overflow-hidden p-6 text-center animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mb-4 border border-amber-200">
          🚪
        </div>

        <h3 className="font-display text-xl font-bold text-logo-brown mb-2">
          ¿Deseas cerrar tu sesión?
        </h3>

        <p className="text-xs sm:text-sm text-logo-brownLight font-light mb-6 leading-relaxed">
          Tu sesión actual se cerrará de forma segura. Para acceder nuevamente a las funciones de tu cuenta o al panel administrativo deberás ingresar tus credenciales.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            Sí, Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}
