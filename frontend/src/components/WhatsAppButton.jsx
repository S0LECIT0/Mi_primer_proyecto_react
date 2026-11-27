import React from 'react'

export default function WhatsAppButton() {
  const phoneNumber = '573173608064'
  const message = encodeURIComponent('¡Hola Dulce Delicia! Me gustaría consultar sobre sus postres y realizar un pedido.')
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

  return (
    <aside aria-label="Contacto directo por WhatsApp">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
        aria-label="Chatear por WhatsApp"
      >
        {/* Ícono de WhatsApp SVG */}
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <svg
            className="w-6 h-6 fill-current relative"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.04 7.42C8.84 7.42 8.52 7.49 8.25 7.78C7.98 8.08 7.21 8.8 7.21 10.27C7.21 11.74 8.28 13.15 8.43 13.35C8.58 13.55 10.54 16.57 13.55 17.87C14.27 18.18 14.83 18.37 15.26 18.51C15.99 18.74 16.65 18.7 17.18 18.63C17.77 18.54 18.99 17.89 19.24 17.18C19.5 16.48 19.5 15.88 19.42 15.75C19.34 15.62 19.14 15.54 18.84 15.39C18.54 15.24 17.07 14.52 16.8 14.42C16.52 14.32 16.32 14.27 16.12 14.57C15.93 14.87 15.36 15.54 15.19 15.74C15.01 15.94 14.84 15.96 14.54 15.81C14.24 15.66 12.98 15.25 11.48 13.91C10.31 12.87 9.52 11.58 9.29 11.19C9.07 10.79 9.26 10.58 9.42 10.42C9.55 10.29 9.71 10.07 9.86 9.89C10.01 9.71 10.06 9.59 10.16 9.39C10.26 9.19 10.21 9.02 10.14 8.87C10.06 8.72 9.49 7.33 9.26 6.77C9.03 6.22 8.8 6.3 8.63 6.29C8.47 6.29 8.27 6.29 8.07 6.29L9.04 7.42Z" />
          </svg>
        </span>
        <span className="hidden sm:inline text-sm font-semibold tracking-wide">
          ¡Haz tu pedido!
        </span>
      </a>
    </aside>
  )
}
