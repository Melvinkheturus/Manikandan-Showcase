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
          DEFAULT: '#00FF7F', // Emerald Green
          50: '#EAFFF6',
          100: '#D5FFEC',
          200: '#ACFFD9',
          300: '#82FFC6',
          400: '#59FFB4',
          500: '#2FFA9F',
          600: '#00FF7F',
          700: '#00D66A',
          800: '#00AD55',
          900: '#008441',
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
        'emerald-veil': 'radial-gradient(circle at 50% 50%, rgba(16,185,129,0.3) 0%, rgba(0,0,0,0.9) 80%, #000000 100%)',
        'emerald-deep': 'linear-gradient(135deg, #0f0f0f 0%, #121212 40%, #0b3d31 75%, #0e2c22 100%)',
        'midnight-green': 'linear-gradient(to bottom right, rgba(10,10,10,1) 0%, rgba(16,185,129,0.3) 40%, rgba(16,185,129,0.6) 60%, rgba(0,0,0,1) 100%)',
        'emerald-fade': 'linear-gradient(to bottom, rgba(16,185,129,0.2) 0%, rgba(0,0,0,0) 100%)',
        'emerald-glow': 'radial-gradient(circle at 50% 40%, rgba(16,185,129,0.4) 0%, rgba(0,0,0,0) 60%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
} 