import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'
import logo from '../assets/logo.jpg'

export default function Nosotros() {
  return (
    <div className="min-h-screen flex flex-col bg-logo-vanilla text-logo-brown">
      <Header />

      <main className="flex-1">
        {/* Banner Superior Limpio */}
        <section className="bg-gradient-to-b from-white via-logo-cream to-logo-vanilla py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-logo-pink/20">
          <div className="max-w-2xl mx-auto space-y-2.5">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-logo-pinkHover">
              Nuestra Pasión Pastelera
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-logo-brown">
              ¿Quiénes Somos?
            </h1>
            <p className="text-xs sm:text-sm text-logo-brownLight font-light max-w-md mx-auto">
              Conoce la historia, el amor y la dedicación que horneamos en cada una de nuestras recetas.
            </p>
          </div>
        </section>

        {/* Reseña de la Pastelería con Logo Decorativo */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 text-center">
          <div className="inline-block p-1 bg-white rounded-full shadow-sm border border-logo-pink/30 mb-4">
            <img
              src={logo}
              alt="Logo Dulce Delicia"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-logo-brown mb-3">
            El Dulce Secreto de Nuestra Tradición
          </h2>
          <div className="w-12 h-1 bg-logo-pink mx-auto mb-5 rounded-full"></div>
          <p className="text-logo-brownLight text-sm sm:text-base leading-relaxed font-light">
            <strong>Dulce Delicia</strong> nació con el sueño de transformar reuniones familiares y celebraciones 
            en recuerdos dulces e inolvidables. Desde nuestro taller artesanal, horneamos a diario con materias 
            primas seleccionadas, conservando recetas de antaño con una presentación cuidada y contemporánea.
          </p>
        </section>

        {/* Misión y Visión */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-logo-pink/20 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-logo-pinkLight text-logo-pinkHover flex items-center justify-center text-xl mb-4">
                🎯
              </div>
              <h3 className="font-display text-xl font-bold text-logo-brown mb-2">
                Nuestra Misión
              </h3>
              <p className="text-logo-brownLight text-xs sm:text-sm leading-relaxed font-light">
                Brindar momentos de felicidad a nuestros clientes mediante postres y pasteles artesanales de sabor inigualable, elaborados con pasión, ingredientes de primera y una atención cercana y amable.
              </p>
            </div>

            <div className="bg-white p-7 sm:p-8 rounded-2xl border border-logo-pink/20 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-logo-pinkLight text-logo-pinkHover flex items-center justify-center text-xl mb-4">
                🔭
              </div>
              <h3 className="font-display text-xl font-bold text-logo-brown mb-2">
                Nuestra Visión
              </h3>
              <p className="text-logo-brownLight text-xs sm:text-sm leading-relaxed font-light">
                Ser la repostería artesanal referente y preferida de la ciudad para el 2030, destacándonos por la autenticidad de nuestras recetas, la creatividad en el diseño y la máxima frescura garantizada.
              </p>
            </div>

          </div>
        </section>

        {/* Valores */}
        <section className="bg-white/80 border-t border-logo-pink/20 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h3 className="font-display text-xl sm:text-2xl font-bold text-logo-brown text-center mb-8">
              Nuestros Pilares
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-logo-vanilla/80 p-5 rounded-xl border border-logo-pink/20 text-center">
                <span className="text-2xl block mb-2">🍰</span>
                <h4 className="font-display text-sm font-bold text-logo-brown mb-1">Pasión</h4>
                <p className="text-[11px] sm:text-xs text-logo-brownLight font-light">
                  Amor por el oficio pastelero en cada batido.
                </p>
              </div>

              <div className="bg-logo-vanilla/80 p-5 rounded-xl border border-logo-pink/20 text-center">
                <span className="text-2xl block mb-2">🌿</span>
                <h4 className="font-display text-sm font-bold text-logo-brown mb-1">Frescura</h4>
                <p className="text-[11px] sm:text-xs text-logo-brownLight font-light">
                  Ingredientes frescos y horneado diario.
                </p>
              </div>

              <div className="bg-logo-vanilla/80 p-5 rounded-xl border border-logo-pink/20 text-center">
                <span className="text-2xl block mb-2">🎨</span>
                <h4 className="font-display text-sm font-bold text-logo-brown mb-1">Creatividad</h4>
                <p className="text-[11px] sm:text-xs text-logo-brownLight font-light">
                  Diseños adaptados a tus ocasiones especiales.
                </p>
              </div>

              <div className="bg-logo-vanilla/80 p-5 rounded-xl border border-logo-pink/20 text-center">
                <span className="text-2xl block mb-2">❤️</span>
                <h4 className="font-display text-sm font-bold text-logo-brown mb-1">Cariño</h4>
                <p className="text-[11px] sm:text-xs text-logo-brownLight font-light">
                  Atención dedicada a cada uno de tus encargos.
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
