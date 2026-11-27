import React, { useState, useEffect } from 'react'

export default function ConfirmModal({
  isOpen,
  title = '¿Confirmar eliminación?',
  message,
  itemDetails = null, // Contenido o datos detallados de lo que se va a borrar
  onConfirm,
  onCancel,
  confirmText = 'Sí, Eliminar Definitivamente',
  cancelText = 'Cancelar'
}) {
  const [countdown, setCountdown] = useState(3)

  // Cada vez que se abre el modal, reiniciar cuenta regresiva de 3 segundos
  useEffect(() => {
    if (!isOpen) return

    setCountdown(3)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-logo-brown/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-200 overflow-hidden text-left animate-scaleUp transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera de Alerta */}
        <div className="bg-gradient-to-r from-rose-50 via-white to-rose-50 p-5 sm:p-6 border-b border-rose-100 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl shrink-0">
            ⚠️
          </div>
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-rose-900 leading-tight">
              {title}
            </h3>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-600">
              Confirmación de Seguridad Requerida
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4">
          
          {/* Advertencia de Irreversibilidad */}
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs leading-relaxed flex items-start gap-3">
            <span className="text-xl shrink-0">🚨</span>
            <div>
              <h4 className="font-bold text-rose-950 uppercase text-[11px] tracking-wide mb-0.5">
                ADVERTENCIA: ACCIÓN DEFINITIVA E IRREVERSIBLE
              </h4>
              <p className="text-rose-800">
                Esta operación no tiene reversa. Una vez eliminada la información, se perderá permanentemente del sistema y no podrá ser restaurada ni recuperada.
              </p>
            </div>
          </div>

          {/* Desglose Detallado de lo que se va a borrar */}
          {itemDetails && (
            <div className="p-4 rounded-2xl bg-logo-cream/70 border border-logo-pink/20 space-y-2">
              <span className="text-xs font-semibold text-logo-brown uppercase tracking-wider block border-b border-logo-pink/20 pb-1.5">
                📋 Elemento a ser eliminado:
              </span>
              <div className="text-xs text-gray-700 space-y-1.5 pt-1">
                {itemDetails}
              </div>
            </div>
          )}

          {message && (
            <p className="text-xs text-gray-500 font-light">
              {message}
            </p>
          )}

          {/* Botones con Bloqueo de 3 Segundos */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-medium transition-colors"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={countdown > 0}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 ${
                countdown > 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200 hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer'
              }`}
            >
              {countdown > 0 ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin inline-block"></span>
                  <span>Habilitando en {countdown}s...</span>
                </>
              ) : (
                <span>🗑️ {confirmText}</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
