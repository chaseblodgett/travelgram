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
        bounceOnceGrow: {
          "0%, 100%": { transform: "translateY(0)", animationTimingFunction: "ease-out" },
          "50%": { transform: "translateY(-10%)", animationTimingFunction: "ease-in" }
        },
        shake: {
          '10%, 90%': { transform: 'translateX(-1px)' },
          '20%, 80%': { transform: 'translateX(2px)' },
          '30%, 50%, 70%': { transform: 'translateX(-4px)' },
          '40%, 60%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        "fade-in-grow": "fadeInGrow 0.5s ease-out",
        'squeeze-slide-out-right': 'squeezeSlideOutRight 0.5s ease forwards',
        'bounce-once-grow': 'bounceOnceGrow 0.4s ease-in-out',
         'shake': 'shake 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
