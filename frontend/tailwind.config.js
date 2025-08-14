/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefaf2',
          100: '#dff3e6',
          200: '#bfe7cc',
          300: '#9fdcaf',
          400: '#6fcf81',
          500: '#3fb353',   // primary green
          600: '#36a548',
          700: '#2b8638',
          800: '#226b2e',
          900: '#16481f'
        }
      }
    }
  },
  plugins: [],
}
