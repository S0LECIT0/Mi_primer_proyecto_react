import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-section">
          <h3>🧁 Dulce Delicia</h3>
          <p>
            Repostería fina y artesanal. Creamos momentos inolvidables horneando pasteles, 
            tartas y postres con los ingredientes más frescos y seleccionados.
          </p>
        </div>

        <div className="footer-section">
          <h4>Navegación</h4>
          <ul className="footer-links">
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/nosotros">¿Quiénes somos?</Link></li>
            <li><Link to="/contacto">Contacto y Pedidos</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Horario de Atención</h4>
          <p className="schedule-info">
            Lunes a Sábado: 8:00 AM - 7:30 PM<br />
            Domingos y Festivos: 9:00 AM - 5:00 PM<br />
            🍰 Envíos a domicilio en toda la ciudad.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} Dulce Delicia Repostería. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
