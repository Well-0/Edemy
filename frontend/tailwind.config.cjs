module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  safelist: [
    'bg-gray-800',
    'bg-white/5',
    'text-gray-300',
    'outline-white/10',
    'after:bg-white/10',
    'data-focus:bg-white/5',
  ],
  plugins: [],
}