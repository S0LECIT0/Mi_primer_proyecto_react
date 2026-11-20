# Dulce Delicia | Repostería Artesanal & Postres Gourmet
Aplicación web moderna y dinámica desarrollada con **React** y **Vite**.

---

## 🍰 Características Principales

- **Carrusel Interactivo de 10 Especialidades:** Con controles anterior/siguiente, contador visual e indicadores de 10 puntos.
- **Navegación Fluida con React Router DOM:** Transición instantánea entre páginas sin recarga del sitio.
- **Componentes Modulares e Independientes:** `Header`, `Footer` y `Carousel`.
- **Tres Vistas Completas:**
  - `/` : Inicio con banner y el carrusel de 10 postres.
  - `/nosotros` : ¿Quiénes somos?, historia, misión, visión y valores artesanales.
  - `/contacto` : Información de atención, WhatsApp, ubicación y formulario de cotizaciones.
- **Diseño Responsivo:** Adaptado para teléfonos móviles, tablets y computadores de escritorio.

---

## 📁 Estructura del Proyecto

```text
mi_primer_proyecto/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── images/
│   │       ├── arequipe.jpg
│   │       ├── cafe.jpg
│   │       ├── chocolate.jpg
│   │       ├── durazno.png
│   │       ├── flan.jpg
│   │       ├── fresa.jpg
│   │       ├── maracuya.jpg
│   │       ├── oreo.jpg
│   │       ├── tiramisu.png
│   │       └── tres_leches.jpg
│   ├── components/
│   │   ├── Header.jsx                         # Barra de navegación
│   │   ├── Footer.jsx                         # Pie de página institucional
│   │   └── Carousel.jsx                       # Carrusel interactivo de postres
│   ├── pages/
│   │   ├── Index.jsx                          # Inicio con el carrusel
│   │   ├── Nosotros.jsx                       # ¿Quiénes somos?
│   │   └── Contacto.jsx                       # Contacto y cotizaciones
│   ├── App.jsx                                # Configuración de rutas
│   ├── main.jsx                               # Punto de entrada de React
│   └── index.css                              # Estilos y diseño visual
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Cómo Ejecutar la Aplicación

1. En la consola, dentro de la carpeta del proyecto, ejecuta:
   ```bash
   npm run dev
   ```
2. Abre en tu navegador la URL que indica la terminal (por lo general `http://localhost:5173`).
