/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'text-[var(--theme-fg)]',
    'bg-[var(--theme-bg)]',
    'border-[var(--theme-fg)]',
    'text-cyan-100', 'text-cyan-300',
    'border-cyan-700', 'bg-gray-800', 'bg-cyan-300',
    'text-gray-400',
    'grid-cols-20', 'gap-[1px]', 'w-[2px]', 'h-[2px]'
  ],
  
  theme: {
    extend: {
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        blink: 'blink 1s steps(2, start) infinite',
        flicker: 'flicker 2s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.2' },
        },
      },
    },
  },
  plugins: [],
};
