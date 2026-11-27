import React, { useEffect } from 'react'

export default function ToastAlert({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => {
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!message) return null

  const isSuccess = type === 'success'

  return (
    <div className="fixed top-6 right-6 z-50 animate-fadeIn">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium ${
        isSuccess
          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
          : 'bg-rose-50 text-rose-800 border-rose-200'
      }`}>
        <span className="text-lg">{isSuccess ? '✅' : '⚠️'}</span>
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 font-bold focus:outline-none"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
