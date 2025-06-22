/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#007df4',
        'primary-dark': '#0066cc',
        'secondary': '#00c8c2',
        'secondary-dark': '#00a29d',
        'negro': '#1a1b15',
        'blanco': '#FFFFFF',
        'gris': '#64748B',
        'gris-claro': '#F8FAFC',
      },
      fontFamily: {
        'sans': ['Outfit', 'sans-serif'],
        'heading': ['Outfit', 'sans-serif'],
      },
      fontSize: {
        'base': '1.6rem',
      },
      boxShadow: {
        'custom': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, var(--primary), var(--primary-dark))',
        'gradient-secondary': 'linear-gradient(to right, var(--secondary), var(--secondary-dark))',
      }
    },
  },
  plugins: [],
}