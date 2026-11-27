/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        logo: {
          pink: '#f4a4b5',        // Rosa pastel suave de los lazos y festones
          pinkLight: '#fdecf0',   // Rosa muy clarito para fondos sutiles
          pinkHover: '#ea889d',   // Rosa de interacción
          cream: '#fff9f5',       // Crema marfil del centro del logo
          vanilla: '#fdf6f0',     // Fondo suave de la página
          brown: '#532e23',       // Marrón chocolate de las letras "Dulce Delicia"
          brownLight: '#7a5245',  // Marrón suave para textos secundarios
          cherry: '#dc2638',      // Rojo cereza de acento
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
