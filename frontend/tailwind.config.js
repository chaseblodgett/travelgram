/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
  ],
  theme: {
    extend: {
      keyframes: {
        squeezeSlideOutRight: {
          '0%': { transform: 'scaleX(1) translateX(0)', opacity: '1' },
          '50%': { transform: 'scaleX(0.8) translateX(50px)', opacity: '0.8' },
          '100%': { transform: 'scaleX(0) translateX(100%)', opacity: '0' },
        },
        fadeInGrow: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in-grow": "fadeInGrow 0.5s ease-out",
        'squeeze-slide-out-right': 'squeezeSlideOutRight 0.5s ease forwards',
      },
    },
  },
  plugins: [],
};

