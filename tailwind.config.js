/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs pilotées par variables CSS (R G B) pour permettre les
        // thèmes (clair / sombre / contraste élevé) sans toucher les
        // classes utilitaires des composants. Valeurs dans globals.css :root.
        navy: 'rgb(var(--c-navy) / <alpha-value>)',
        ink: 'rgb(var(--c-navy) / <alpha-value>)',
        bleu: 'rgb(var(--c-bleu) / <alpha-value>)',
        'bleu-fonce': 'rgb(var(--c-bleu-fonce) / <alpha-value>)',
        rouge: 'rgb(var(--c-rouge) / <alpha-value>)',
        jaune: 'rgb(var(--c-jaune) / <alpha-value>)',
        vert: 'rgb(var(--c-vert) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        glass: '24px',
      },
      boxShadow: {
        glass: '0 12px 40px rgba(10,22,40,0.09), inset 0 1px 0 #ffffff',
        'glass-hover': '0 16px 48px rgba(10,22,40,0.14), inset 0 1px 0 #ffffff',
      },
      animation: {
        'blob-1': 'blob1 22s ease-in-out infinite',
        'blob-2': 'blob2 28s ease-in-out infinite',
        'blob-3': 'blob3 32s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out 0.15s both',
      },
      keyframes: {
        blob1: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(40px,-30px) scale(1.12)' },
        },
        blob2: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(-30px,40px) scale(1.18)' },
        },
        blob3: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '50%': { transform: 'translate(20px,30px) scale(0.92)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
