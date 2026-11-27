import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Carousel from '../components/Carousel'
import WhatsAppButton from '../components/WhatsAppButton'
import logo from '../assets/logo.jpg'

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-logo-vanilla text-logo-brown">
      <Header />

      <main className="flex-1">
      
        <section className="relative overflow-hidden bg-gradient-to-b from-white via-logo-cream to-logo-vanilla py-14 sm:py-20 px-4 sm:px-6 lg:px-8 text-center border-b border-logo-pink/20">
          <div className="max-w-3xl mx-auto space-y-4">
            
            <div className="inline-flex items-center justify-center p-1.5 bg-white rounded-full shadow-sm border border-logo-pink/40 mb-1">
              <img
                src={logo}
                alt="Emblema Dulce Delicia"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              />
            </div>

            <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-logo-brown leading-tight">
              Momentos Dulces con <span className="text-logo-pinkHover italic">Amor Artesanal</span>
            </h1>
            
            <p className="text-sm sm:text-base text-logo-brownLight max-w-xl mx-auto font-light leading-relaxed">
              Postres de alta repostería y tortas personalizadas, horneadas con recetas tradicionales y los ingredientes más frescos.
            </p>
          </div>
        </section>

        {/* Sección del Carrusel de 10 Postres */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-logo-brown">
              Especialidades de la Casa
            </h2>
            <div className="w-12 h-1 bg-logo-pink mx-auto my-2.5 rounded-full"></div>
            <p className="text-xs sm:text-sm text-logo-brownLight font-light">
              Explora nuestra selección de creaciones frias del día.
            </p>
          </div>

          <Carousel />
        </section>

        {/* Sección de Beneficios (Limpia y con aire) */}
        <section className="bg-white/80 border-t border-logo-pink/20 py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              
              <div className="p-6 rounded-2xl bg-logo-cream/70 border border-logo-pink/20 text-center hover:bg-logo-cream transition-colors">
                <span className="text-3xl block mb-2.5">🍓</span>
                <h3 className="font-display text-lg font-bold text-logo-brown mb-1.5">
                  100% Natural
                </h3>
                <p className="text-xs sm:text-sm text-logo-brownLight font-light leading-relaxed">
                  Frutas frescas, chocolate de origen y mantequilla pura sin aditivos.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-logo-cream/70 border border-logo-pink/20 text-center hover:bg-logo-cream transition-colors">
                <span className="text-3xl block mb-2.5">🧁</span>
                <h3 className="font-display text-lg font-bold text-logo-brown mb-1.5">
                  Horneado a Mano
                </h3>
                <p className="text-xs sm:text-sm text-logo-brownLight font-light leading-relaxed">
                  Cuidamos cada detalle de sabor, textura y decoración personalizada.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-logo-cream/70 border border-logo-pink/20 text-center hover:bg-logo-cream transition-colors">
                <span className="text-3xl block mb-2.5">🛵</span>
                <h3 className="font-display text-lg font-bold text-logo-brown mb-1.5">
                  Entregas Cuidadosas
                </h3>
                <p className="text-xs sm:text-sm text-logo-brownLight font-light leading-relaxed">
                  Empacado seguro para que tu postre llegue impecable a tu mesa.
                </p>
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
