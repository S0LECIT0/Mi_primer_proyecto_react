import React, { useState } from 'react'

// Importación de las 10 imágenes propias desde src/assets/images
import arequipe from '../assets/images/arequipe.jpg'
import cafe from '../assets/images/cafe.jpg'
import chocolate from '../assets/images/chocolate.jpg'
import durazno from '../assets/images/durazno.png'
import flan from '../assets/images/flan.jpg'
import fresa from '../assets/images/fresa.jpg'
import maracuya from '../assets/images/maracuya.jpg'
import oreo from '../assets/images/oreo.jpg'
import tiramisu from '../assets/images/tiramisu.png'
import tres_leches from '../assets/images/tres_leches.jpg'

const carouselItems = [
  {
    id: 1,
    image: arequipe,
    title: '1. Mousse Individual de Arequipe',
    description: 'Porción personal en domo con cremosa mousse de dulce de leche, base crocante y un topping suave de arequipe con nuez.'
  },
  {
    id: 2,
    image: cafe,
    title: '2. Vasitos de Postre Moka y Café',
    description: 'Delicadas capas de crema suave al café, crujiente de galleta y abundante lluvia de cacao puro con virutas de chocolate.'
  },
  {
    id: 3,
    image: chocolate,
    title: '3. Tarta Suprema de Chocolate',
    description: 'Bizcocho artesanal multicapa de chocolate oscuro, relleno de ganache cremosa y coronado con glaseado brillante y detalle dorado.'
  },
  {
    id: 4,
    image: durazno,
    title: '4. Cheesecake Horneado de Durazno',
    description: 'Cremosa base de queso horneado al estilo clásico sobre galleta crujiente, decorado con durazno en almíbar y menta fresca.'
  },
  {
    id: 5,
    image: flan,
    title: '5. Flan Casero al Caramelo',
    description: 'Receta tradicional de textura sedosa y delicada, bañado generosamente con un brillante caramelo líquido dorado.'
  },
  {
    id: 6,
    image: fresa,
    title: '6. Panna Cotta con Frutos Rojos',
    description: 'Postre italiano de crema aromatizada con vainilla, bañado en salsa brillante de fresa y decorado con frambuesas frescas.'
  },
  {
    id: 7,
    image: maracuya,
    title: '7. Pie Cítrico de Maracuyá',
    description: 'Suave tarta artesanal con relleno de crema de maracuyá y un balance dulce-ácido perfecto, cubierta con coulis natural y semillas.'
  },
  {
    id: 8,
    image: oreo,
    title: '8. Domo Cheesecake de Oreo',
    description: 'Postre individual elaborado con base de galletas Oreo trituradas, crema suave con trozos de galleta y cobertura de chocolate.'
  },
  {
    id: 9,
    image: tiramisu,
    title: '9. Tiramisú Artesanal con Nueces',
    description: 'Copas individuales con capas de crema mascarpone, bizcocho impregnado en café aromático, cacao fino y nueces tostadas.'
  },
  {
    id: 10,
    image: tres_leches,
    title: '10. Pastel Clásico Tres Leches',
    description: 'Bizcochuelo tradicional humedecido en nuestra mezcla especial de tres leches, cubierto con chantilly ligera, fresas y chocolate.'
  }
]

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const currentItem = carouselItems[currentIndex]

  return (
    <section className="carousel-section">
      <div className="carousel-wrapper">
        {/* Contenedor de la Imagen */}
        <div className="carousel-image-container">
          <img 
            src={currentItem.image} 
            alt={currentItem.title} 
            className="carousel-image"
          />
          <div className="carousel-badge">
            Postre {currentIndex + 1} de {carouselItems.length}
          </div>
        </div>

        {/* Controles de Navegación (Flechas) */}
        <button 
          className="carousel-btn prev-btn" 
          onClick={prevSlide}
          aria-label="Postre anterior"
        >
          &#10094;
        </button>
        <button 
          className="carousel-btn next-btn" 
          onClick={nextSlide}
          aria-label="Postre siguiente"
        >
          &#10095;
        </button>

        {/* Información del postre (Título y Descripción adaptados) */}
        <div className="carousel-info">
          <h3 className="carousel-title">{currentItem.title}</h3>
          <p className="carousel-description">{currentItem.description}</p>
        </div>

        {/* Indicadores Visuales (10 puntos) */}
        <div className="carousel-indicators" role="tablist">
          {carouselItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
              title={`Ver ${item.title}`}
              aria-label={`Ir al postre ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
