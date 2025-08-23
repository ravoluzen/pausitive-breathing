/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        breathing: {
          blue: '#3B82F6',
          teal: '#14B8A6',
          green: '#10B981',
          earth: '#92857D',
          light: '#E0F2FE',
          dark: '#1E293B'
        }
      },
      animation: {
        'breathe-in': 'breatheIn var(--inhale-duration) ease-in-out',
        'breathe-out': 'breatheOut var(--exhale-duration) ease-in-out',
        'gradient-shift': 'gradientShift 20s ease-in-out infinite',
      },
      keyframes: {
        breatheIn: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '100%': { transform: 'scale(1.1)', opacity: '1' }
        },
        breatheOut: {
          '0%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0.8' }
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      }
    },
  },
  plugins: [],
}
