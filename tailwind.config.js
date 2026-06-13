/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#06111f',
        panel: '#0b1b2d',
        line: '#1b354d',
        cyan: '#27d3f2',
      },
      boxShadow: {
        glow: '0 0 32px rgba(39, 211, 242, 0.08)',
      },
      animation: {
        floatin: 'floatin .45s ease-out both',
      },
      keyframes: {
        floatin: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
