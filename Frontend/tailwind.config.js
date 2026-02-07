/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        gravitas: ['"Gravitas One"', 'serif'],
        alfa: ['"Alfa Slab One"', 'serif'],
        passion: ['"Passion One"', 'sans-serif'],
        titan: ['"Titan One"', 'cursive'],
      },
    },
  },
  plugins: [],
}

