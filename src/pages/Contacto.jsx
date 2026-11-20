import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    tipoPostre: '',
    mensaje: ''
  })

  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.nombre || !formData.correo || !formData.mensaje) {
      alert('Por favor completa los campos requeridos.')
      return
    }
    setEnviado(true)
    setFormData({
      nombre: '',
      correo: '',
      telefono: '',
      tipoPostre: '',
      mensaje: ''
    })
  }

  return (
    <div className="page-wrapper">
      <Header />

      <main className="main-content">
        <section className="page-banner">
          <div className="container">
            <h1 className="page-title">Contacto y Cotizaciones</h1>
            <p className="page-description">
              ¿Tienes un evento especial o antojo de algo dulce? Escríbenos y con gusto te atenderemos.
            </p>
          </div>
        </section>

        <section className="container py-5">
          <div className="contact-grid">
            {/* Información de la Repostería */}
            <div className="contact-info-panel">
              <h2>Visítanos o Escríbenos</h2>
              <p className="contact-intro">
                Estamos listos para endulzar tus momentos. Puedes comunicarte directamente por nuestros canales:
              </p>

              <div className="info-cards">
                <div className="info-card">
                  <div className="info-icon">📍</div>
                  <div>
                    <h4>Nuestra Pastelería</h4>
                    <p>Avenida Primavera #124, Barrio El Rosedal</p>
                    <small>Medellín, Colombia</small>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">💬</div>
                  <div>
                    <h4>WhatsApp de Pedidos</h4>
                    <p>+57 312 890 4521</p>
                    <small>Respuesta rápida para cotizaciones</small>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">📧</div>
                  <div>
                    <h4>Correo Electrónico</h4>
                    <p><a href="mailto:pedidos@dulcedelicia.com">pedidos@dulcedelicia.com</a></p>
                  </div>
                </div>

                <div className="info-card">
                  <div className="info-icon">⏰</div>
                  <div>
                    <h4>Horarios del Horno</h4>
                    <p>Lunes a Sábado: 8:00 AM - 7:30 PM</p>
                    <p>Domingos y Festivos: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Pedidos / Cotizaciones */}
            <div className="contact-form-panel">
              <div className="form-box">
                <h3>Cotiza tu Pastel o Postre</h3>
                <p>Déjanos los detalles de tu pedido y te contactaremos en minutos.</p>

                {enviado && (
                  <div className="alert-success">
                    🧁 ¡Gracias por contactarnos! Recibimos tu solicitud y nos pondremos en contacto contigo pronto.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo *</label>
                    <input 
                      type="text" 
                      id="nombre"
                      name="nombre" 
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej. Sofía Martínez" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="correo">Correo Electrónico *</label>
                    <input 
                      type="email" 
                      id="correo"
                      name="correo" 
                      value={formData.correo}
                      onChange={handleChange}
                      placeholder="sofia@ejemplo.com" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono / WhatsApp</label>
                    <input 
                      type="tel" 
                      id="telefono"
                      name="telefono" 
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+57 300 123 4567" 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tipoPostre">Postre o Ocasión de Interés</label>
                    <input 
                      type="text" 
                      id="tipoPostre"
                      name="tipoPostre" 
                      value={formData.tipoPostre}
                      onChange={handleChange}
                      placeholder="Ej. Torta de cumpleaños, cupcakes para boda, cheesecake..." 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="mensaje">Detalles de tu pedido o mensaje *</label>
                    <textarea 
                      id="mensaje"
                      name="mensaje" 
                      rows="4" 
                      value={formData.mensaje}
                      onChange={handleChange}
                      placeholder="Indícanos fecha de entrega, número de porciones y sabores deseados..." 
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-submit">
                    Enviar Cotización
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
