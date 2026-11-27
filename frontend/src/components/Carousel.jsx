import React, { useState, useEffect } from 'react'

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
    title: 'Mousse Individual de Arequipe',
    description: 'Porción personal en domo con cremosa mousse de dulce de leche, base crocante y un topping suave de arequipe con nuez.'
  },
  {
    id: 2,
    image: cafe,
    title: 'Vasitos de Postre Moka y Café',
    description: 'Delicadas capas de crema suave al café, crujiente de galleta y abundante lluvia de cacao puro con virutas de chocolate.'
  },
  {
    id: 3,
    image: chocolate,
    title: 'Tarta Suprema de Chocolate',
    description: 'Bizcocho artesanal multicapa de chocolate oscuro, relleno de ganache cremosa y coronado con glaseado brillante y detalle dorado.'
  },
  {
    id: 4,
    image: durazno,
    title: 'Cheesecake Horneado de Durazno',
    description: 'Cremosa base de queso horneado al estilo clásico sobre galleta crujiente, decorado con durazno en almíbar y menta fresca.'
  },
  {
    id: 5,
    image: flan,
    title: 'Flan Casero al Caramelo',
    description: 'Receta tradicional de textura sedosa y delicada, bañado generosamente con un brillante caramelo líquido dorado.'
  },
  {
    id: 6,
    image: fresa,
    title: 'Panna Cotta con Frutos Rojos',
    description: 'Postre italiano de crema aromatizada con vainilla, bañado en salsa brillante de fresa y decorado con frambuesas frescas.'
  },
  {
    id: 7,
    image: maracuya,
    title: 'Pie Cítrico de Maracuyá',
    description: 'Suave tarta artesanal con relleno de crema de maracuyá y un balance dulce-ácido perfecto, cubierta con coulis natural y semillas.'
  },
  {
    id: 8,
    image: oreo,
    title: 'Domo Cheesecake de Oreo',
    description: 'Postre individual elaborado con base de galletas Oreo trituradas, crema suave con trozos de galleta y cobertura de chocolate.'
  },
  {
    id: 9,
    image: tiramisu,
    title: 'Tiramisú Artesanal con Nueces',
    description: 'Copas individuales con capas de crema mascarpone, bizcocho impregnado en café aromático, cacao fino y nueces tostadas.'
  },
  {
    id: 10,
    image: tres_leches,
    title: 'Pastel Clásico Tres Leches',
    description: 'Bizcochuelo tradicional humedecido en nuestra mezcla especial de tres leches, cubierto con chantilly ligera, fresas y chocolate.'
  }
]

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Desplazamiento automático cada 3.5 segundos
  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
    }, 8000)

    return () => clearInterval(timer)
  }, [isPaused])

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
    <section className="w-full max-w-4xl mx-auto my-4 px-2 sm:px-4">
      <div 
        className="relative bg-white rounded-3xl shadow-md hover:shadow-lg overflow-hidden border border-logo-pink/30 transition-all duration-300"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        
        {/* Contenedor de la Imagen */}
        <div className="relative w-full h-72 sm:h-96 md:h-[430px] bg-gradient-to-b from-white via-logo-cream to-logo-pinkLight/30 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <img
            key={currentItem.id}
            src={currentItem.image}
            alt={currentItem.title}
            className="w-full h-full object-contain filter drop-shadow transition-all duration-500 animate-fadeIn"
          />

          {/* Badge de posición con indicador de auto-play */}
          <div className="absolute top-4 right-4 bg-logo-brown/85 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} title={isPaused ? 'Pausado' : 'Reproduciendo automáticamente'}></span>
            <span>Postre {currentIndex + 1} de {carouselItems.length}</span>
          </div>
        </div>

        {/* Flechas de Navegación manual */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 sm:left-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-logo-cream text-logo-brown hover:text-logo-pinkHover flex items-center justify-center shadow hover:shadow-md transition-all duration-200 transform hover:scale-105 z-10 border border-logo-pink/20"
          aria-label="Postre anterior"
        >
          <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 w-10 h-10 rounded-full bg-white/95 hover:bg-logo-cream text-logo-brown hover:text-logo-pinkHover flex items-center justify-center shadow hover:shadow-md transition-all duration-200 transform hover:scale-105 z-10 border border-logo-pink/20"
          aria-label="Postre siguiente"
        >
          <svg className="w-5 h-5 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Informacion del postre */}
        <div className="p-5 sm:p-6 text-center bg-white border-t border-logo-pink/15">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-logo-brown mb-2 transition-all duration-300">
            {currentItem.title}
          </h3>
          <p className="text-logo-brownLight text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light transition-all duration-300">
            {currentItem.description}
          </p>
        </div>

        {/* Indicadores de posicion interactivos */}
        <div className="flex items-center justify-center gap-2 pb-5 px-4" role="tablist">
          {carouselItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => goToSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                index === currentIndex
                  ? 'w-7 bg-logo-pink'
                  : 'w-2.5 bg-logo-pink/30 hover:bg-logo-pink/50'
              }`}
              title={`Ver ${item.title}`}
              aria-label={`Ir al postre ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
