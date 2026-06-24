/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        navy: {
          800: '#0f1f3d',
          900: '#070f1e',
          950: '#030810',
        },
        parchment: {
          100: '#fef9e7',
          200: '#fdf0c2',
          300: '#f9e4a0',
          400: '#f0c96a',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        lora: ['Lora', 'serif'],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px #fbbf24, 0 0 10px #fbbf24' },
          '50%': { boxShadow: '0 0 20px #fbbf24, 0 0 40px #f59e0b, 0 0 60px #d97706' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        countUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        }
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
        glow: 'glow 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        countUp: 'countUp 0.6s ease-out forwards',
      }
    },
  },
  plugins: [],
}
