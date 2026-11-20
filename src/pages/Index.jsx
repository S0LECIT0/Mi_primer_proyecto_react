import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'

export default function Index() {
  return (
    <div className="page-wrapper">
      <Header />

      <main className="main-content">
        <section className="hero-banner">
          <div className="container">
            <h1 className="hero-title">El Dulce Sabor de los Momentos Especiales</h1>
            <p className="hero-subtitle">
              Pastelería fina y repostería artesanal horneada cada mañana con pasión, dedicación y los mejores ingredientes.
            </p>
          </div>
        </section>

        {/* Carrusel interactivo de las 10 especialidades */}
        <section className="container py-4">
          <div className="section-header">
            <h2 className="section-title">Nuestras Especialidades Dulces</h2>
            <p className="section-subtitle">
              Conoce nuestra selección exclusiva de pasteles, tartas y postres más aclamados.
            </p>
          </div>
          <Carousel />
        </section>

        {/* Sección de propuesta de valor */}
        <section className="features-section">
          <div className="container">
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">🍓</span>
                <h3>Ingredientes Frescos</h3>
                <p>Mantequilla pura, chocolates de origen y frutas frescas de temporada sin conservantes artificiales.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">👩‍🍳</span>
                <h3>Hecho a Mano con Amor</h3>
                <p>Recetas tradicionales perfeccionadas con técnicas modernas de pastelería artesanal.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🛵</span>
                <h3>Envíos y Encargos</h3>
                <p>Empacados cuidadosamente para que tus postres y tartas lleguen intactos y frescos a tu mesa.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
