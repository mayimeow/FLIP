/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pan-bg': 'pan 30s linear infinite',
        'shine': 'shine 1.5s ease-out infinite',
        // ADD THIS FLIP ANIMATION:
        'flip': 'flip 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-10deg)' },
          '50%': { transform: 'translateY(-15px) rotate(-8deg)' },
        },
        pan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        shine: {
          '100%': { left: '200%' },
        },
        // ADD THIS FLIP KEYFRAME:
        flip: {
          '0%, 15%': { transform: 'perspective(600px) rotateY(0deg) rotate(-10deg)' },
          '45%, 55%': { transform: 'perspective(600px) rotateY(180deg) rotate(-10deg)' },
          '85%, 100%': { transform: 'perspective(600px) rotateY(360deg) rotate(-10deg)' },
        }
      }
    },
  },
  plugins: [],
}