/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: { 500: '#F59E0B' },
        green: { 400: '#4ADE80' },
        blue: { 800: '#1E40AF' }
      }
    },
  },
  plugins: [],
}
