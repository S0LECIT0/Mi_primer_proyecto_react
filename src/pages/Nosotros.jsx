import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Nosotros() {
  return (
    <div className="page-wrapper">
      <Header />

      <main className="main-content">
        <section className="page-banner">
          <div className="container">
            <h1 className="page-title">Nuestra Pasión por la Repostería</h1>
            <p className="page-description">
              Conoce la historia, el amor y la dedicación que horneamos en cada una de nuestras creaciones.
            </p>
          </div>
        </section>

        <section className="container py-5">
          <div className="about-overview">
            <h2>Sobre Dulce Delicia</h2>
            <p className="lead-text">
              <strong>Dulce Delicia</strong> nació del amor por la pastelería clásica y el deseo de transformar 
              reuniones familiares y celebraciones en recuerdos dulces e inolvidables. Desde nuestro pequeño taller de horneado 
              hasta convertirnos en una repostería querida por la comunidad, mantenemos intacta la promesa de usar recetas 
              auténticas y materias primas de la más alta calidad.
            </p>
          </div>

          <div className="mv-grid">
            <div className="mv-card">
              <div className="card-badge">🎂</div>
              <h3>Nuestra Misión</h3>
              <p>
                Deleitar los paladares de nuestros clientes a través de postres y pasteles artesanales de sabor inigualable, 
                elaborados con ingredientes frescos y amor por el detalle, brindando calidez y sonrisas en cada celebración.
              </p>
            </div>

            <div className="mv-card">
              <div className="card-badge">✨</div>
              <h3>Nuestra Visión</h3>
              <p>
                Ser reconocidos como la repostería artesanal de referencia y primera opción en pastelería fina, destacándonos 
                por la innovación constante en sabores, presentaciones elegantes y un servicio al cliente cálido y cercano.
              </p>
            </div>
          </div>

          <div className="values-section">
            <h3 className="section-title text-center">Nuestros Pilares</h3>
            <div className="values-grid">
              <div className="value-item">
                <span className="value-icon">🍰</span>
                <h4>Pasión Pastelera</h4>
                <p>Cuidamos cada detalle desde el primer batido hasta el último toque de decoración.</p>
              </div>
              <div className="value-item">
                <span className="value-icon">🌿</span>
                <h4>Frescura Garantizada</h4>
                <p>Horneamos a diario con productos seleccionados para garantizar frescura absoluta.</p>
              </div>
              <div className="value-item">
                <span className="value-icon">🎨</span>
                <h4>Creatividad</h4>
                <p>Diseños y combinaciones de sabores personalizados para cada tipo de ocasión.</p>
              </div>
              <div className="value-item">
                <span className="value-icon">❤️</span>
                <h4>Atención Cálida</h4>
                <p>Escuchamos tus ideas y te asesoramos para que tu evento sea perfecto.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
