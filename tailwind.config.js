// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  safelist: [
    'translate-y-0',
    'translate-y-[100%]',
    '-translate-y-[150%]',
    'opacity-0',
    'opacity-100'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
