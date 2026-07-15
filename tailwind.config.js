/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          purple: '#0E7490',
          'purple-light': '#E6F5FA',
          'purple-dark': '#155E75',
          navy: '#0F172A',
          'navy-card': '#123044',
          lavender: '#EDF6FB',
          yellow: '#3BAFDA',
        }
      }
    },
  },
  plugins: [],
}
