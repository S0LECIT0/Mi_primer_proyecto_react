import React from 'react'
import { NavLink, Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-container">
        <Link to="/" className="brand-logo">
          <span className="logo-icon">🧁</span>
          <span className="logo-text">Dulce <strong>Delicia</strong></span>
        </Link>

        <nav className="main-nav">
          <ul className="nav-list">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                end
              >
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/nosotros" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                ¿Quiénes somos?
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contacto" 
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Contacto
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
