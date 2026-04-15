/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0A1628',
        ink: '#0A1628',
        bleu: '#4A72B8',
        'bleu-fonce': '#1E3D82',
        rouge: '#C94040',
        jaune: '#C97830',
        vert: '#28A050',
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
      },
    },
  },
  plugins: [],
};
