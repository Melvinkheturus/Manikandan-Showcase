/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#a259ff', // Neon Purple (was Emerald Green)
          50: '#f5eeff',
          100: '#ebe0ff',
          200: '#d6c0ff',
          300: '#c2a0ff',
          400: '#b380ff',
          500: '#a259ff', // Main accent color
          600: '#9047e0',
          700: '#7e36c2',
          800: '#6c26a3',
          900: '#5a1785',
        },
        background: {
          DEFAULT: '#0A0A0A', // Dark Background
          50: '#1A1A1A',
          100: '#171717',
          200: '#151515',
          300: '#121212',
          400: '#0F0F0F',
          500: '#0A0A0A',
          600: '#080808',
          700: '#050505',
          800: '#030303',
          900: '#000000',
        },
      },
      backgroundImage: {
        'purple-veil': 'radial-gradient(circle at 50% 50%, rgba(162,89,255,0.3) 0%, rgba(0,0,0,0.9) 80%, #000000 100%)',
        'purple-deep': 'linear-gradient(135deg, #0f0f0f 0%, #121212 40%, #2a1245 75%, #1a0b33 100%)',
        'midnight-purple': 'linear-gradient(to bottom right, rgba(10,10,10,1) 0%, rgba(162,89,255,0.3) 40%, rgba(162,89,255,0.6) 60%, rgba(0,0,0,1) 100%)',
        'purple-fade': 'linear-gradient(to bottom, rgba(162,89,255,0.2) 0%, rgba(0,0,0,0) 100%)',
        'purple-glow': 'radial-gradient(circle at 50% 40%, rgba(162,89,255,0.4) 0%, rgba(0,0,0,0) 60%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        shimmer: 'shimmer 2s infinite linear',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
} 