import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    tipoPostre: '',
    mensaje: ''
  })

  const [touched, setTouched] = useState({})
  const [enviado, setEnviado] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Validaciones
  const nombreTrim = formData.nombre.trim()
  const contieneNumeros = /[0-9]/.test(formData.nombre)
  const isNombreValid =
    nombreTrim.length >= 2 &&
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(formData.nombre) &&
    !contieneNumeros

  const correoTrim = formData.correo.trim()
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(correoTrim)

  const mensajeTrim = formData.mensaje.trim()
  const isMensajeValid = mensajeTrim.length >= 5

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errorMsg) setErrorMsg('')
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ nombre: true, correo: true, mensaje: true })

    if (!isNombreValid) {
      if (contieneNumeros) {
        setErrorMsg('El nombre no puede contener números.')
      } else if (nombreTrim.length === 0) {
        setErrorMsg('El nombre no puede estar vacío ni contener solo espacios.')
      } else {
        setErrorMsg('Por favor ingresa un nombre válido (solo letras, mínimo 2 caracteres).')
      }
      return
    }

    if (!isEmailValid) {
      setErrorMsg('Por favor ingresa un correo electrónico con formato válido.')
      return
    }

    if (!isMensajeValid) {
      setErrorMsg('El mensaje no puede estar vacío ni contener solo espacios en blanco.')
      return
    }

    setEnviado(true)
    setErrorMsg('')
    setFormData({
      nombre: '',
      correo: '',
      telefono: '',
      tipoPostre: '',
      mensaje: ''
    })
    setTouched({})
  }

  return (
    <div className="min-h-screen flex flex-col bg-logo-vanilla text-logo-brown">
      <Header />

      <main className="flex-1">
        {/* Banner Superior Limpio */}
        <section className="bg-gradient-to-b from-white via-logo-cream to-logo-vanilla py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-logo-pink/20">
          <div className="max-w-2xl mx-auto space-y-2.5">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-logo-pinkHover">
              Atención Personalizada
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-logo-brown">
              Contacto y Encargos
            </h1>
            <p className="text-xs sm:text-sm text-logo-brownLight font-light max-w-md mx-auto">
              Escríbenos para pedidos especiales, cotizaciones de tortas para eventos o cualquier duda.
            </p>
          </div>
        </section>

        {/* Sección de Canales y Formulario */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Panel de Canales (5 columnas) */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-display text-xl font-bold text-logo-brown mb-1">
                Información de Contacto
              </h2>
              <p className="text-xs text-logo-brownLight font-light mb-4">
                Puedes comunicarte por nuestros canales directos o visitarnos en nuestra sede:
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-logo-pink/20 shadow-sm">
                  <span className="w-9 h-9 rounded-lg bg-logo-pinkLight text-logo-pinkHover flex items-center justify-center text-lg shrink-0">
                    📍
                  </span>
                  <div>
                    <h4 className="font-semibold text-xs text-logo-brown">Dirección</h4>
                    <p className="text-[11px] sm:text-xs text-logo-brownLight mt-0.5">Avenida Primavera #124, Barrio El Rosedal, Medellín</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-logo-pink/20 shadow-sm">
                  <span className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                    💬
                  </span>
                  <div>
                    <h4 className="font-semibold text-xs text-logo-brown">WhatsApp Directo</h4>
                    <p className="text-[11px] sm:text-xs text-logo-brownLight mt-0.5">+57 3127954956</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-logo-pink/20 shadow-sm">
                  <span className="w-9 h-9 rounded-lg bg-logo-pinkLight text-logo-pinkHover flex items-center justify-center text-lg shrink-0">
                    📧
                  </span>
                  <div>
                    <h4 className="font-semibold text-xs text-logo-brown">Correo Electrónico</h4>
                    <a href="mailto:pedidos@dulcedelicia.com" className="text-[11px] sm:text-xs text-logo-pinkHover hover:underline mt-0.5 block">
                      pedidos@dulcedelicia.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-logo-pink/20 shadow-sm">
                  <span className="w-9 h-9 rounded-lg bg-logo-pinkLight text-logo-pinkHover flex items-center justify-center text-lg shrink-0">
                    ⏰
                  </span>
                  <div>
                    <h4 className="font-semibold text-xs text-logo-brown">Horarios</h4>
                    <p className="text-[11px] text-logo-brownLight mt-0.5">Lun - Sáb: 8:00 AM - 7:30 PM</p>
                    <p className="text-[11px] text-logo-brownLight">Dom y Festivos: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario Limpio (7 columnas) */}
            <div className="lg:col-span-7">
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-logo-pink/20 shadow-sm">
                <h3 className="font-display text-xl font-bold text-logo-brown mb-1">
                  Envíanos un Mensaje
                </h3>
                <p className="text-xs text-logo-brownLight font-light mb-5">
                  Déjanos tus datos y nos pondremos en contacto contigo a la brevedad.
                </p>

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-fadeIn">
                    <span>⚠️</span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {enviado && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                    <span>🧁</span>
                    <span>¡Mensaje recibido! Nos comunicaremos contigo pronto para atender tu solicitud.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="nombre" className="block text-xs font-medium text-logo-brown mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        onBlur={() => handleBlur('nombre')}
                        placeholder="Ej. Laura Gómez"
                        required
                        className={`w-full px-3 py-2 rounded-lg border text-xs sm:text-sm bg-logo-vanilla/40 outline-none transition-all ${
                          touched.nombre
                            ? isNombreValid
                              ? 'border-emerald-400 bg-emerald-50/20'
                              : 'border-rose-400 bg-rose-50/20'
                            : 'border-logo-pink/30 focus:border-logo-pink'
                        }`}
                      />
                      {touched.nombre && !isNombreValid && (
                        <p className="text-[11px] text-rose-500 mt-0.5">
                          {contieneNumeros
                            ? 'El nombre no puede tener números.'
                            : nombreTrim.length === 0
                            ? 'No puede contener solo espacios.'
                            : 'Solo se permiten letras.'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="correo" className="block text-xs font-medium text-logo-brown mb-1">
                        Correo *
                      </label>
                      <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        onBlur={() => handleBlur('correo')}
                        placeholder="laura@ejemplo.com"
                        required
                        className={`w-full px-3 py-2 rounded-lg border text-xs sm:text-sm bg-logo-vanilla/40 outline-none transition-all ${
                          touched.correo
                            ? isEmailValid
                              ? 'border-emerald-400 bg-emerald-50/20'
                              : 'border-rose-400 bg-rose-50/20'
                            : 'border-logo-pink/30 focus:border-logo-pink'
                        }`}
                      />
                      {touched.correo && !isEmailValid && (
                        <p className="text-[11px] text-rose-500 mt-0.5">
                          {correoTrim.length === 0 ? 'No puede contener solo espacios.' : 'Correo inválido.'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label htmlFor="telefono" className="block text-xs font-medium text-logo-brown mb-1">
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="+57 300 000 0000"
                        className="w-full px-3 py-2 rounded-lg border border-logo-pink/30 focus:border-logo-pink focus:ring-1 focus:ring-logo-pink outline-none text-xs sm:text-sm bg-logo-vanilla/40 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="tipoPostre" className="block text-xs font-medium text-logo-brown mb-1">
                        Tipo de Postre o Evento
                      </label>
                      <input
                        type="text"
                        id="tipoPostre"
                        name="tipoPostre"
                        value={formData.tipoPostre}
                        onChange={handleChange}
                        placeholder="Ej. Torta de cumpleaños"
                        className="w-full px-3 py-2 rounded-lg border border-logo-pink/30 focus:border-logo-pink focus:ring-1 focus:ring-logo-pink outline-none text-xs sm:text-sm bg-logo-vanilla/40 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block text-xs font-medium text-logo-brown mb-1">
                      Detalles o Mensaje *
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows={3}
                      value={formData.mensaje}
                      onChange={handleChange}
                      onBlur={() => handleBlur('mensaje')}
                      placeholder="Cuéntanos fecha requerida, cantidad de porciones o requerimientos especiales..."
                      required
                      className={`w-full px-3 py-2 rounded-lg border text-xs sm:text-sm bg-logo-vanilla/40 outline-none transition-all resize-none ${
                        touched.mensaje
                          ? isMensajeValid
                            ? 'border-emerald-400 bg-emerald-50/20'
                            : 'border-rose-400 bg-rose-50/20'
                          : 'border-logo-pink/30 focus:border-logo-pink'
                      }`}
                    ></textarea>
                    {touched.mensaje && !isMensajeValid && (
                      <p className="text-[11px] text-rose-500 mt-0.5">
                        El mensaje no puede contener solo espacios (mínimo 5 caracteres).
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-logo-pink hover:bg-logo-pinkHover text-white font-semibold text-xs sm:text-sm shadow-sm transition-all duration-200"
                  >
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
