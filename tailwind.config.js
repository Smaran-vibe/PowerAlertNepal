/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      colors: {
        brand: {
          purple: '#1A5632',
          'purple-light': '#E7F3E8',
          'purple-dark': '#123A24',
          navy: '#0F2A1A',
          'navy-card': '#15351F',
          lavender: '#F3F9F3',
          yellow: '#D9A441',
        }
      }
    },
  },
  plugins: [],
}
