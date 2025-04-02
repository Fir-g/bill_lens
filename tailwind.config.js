/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#57CC99',
        secondary: '#2D4356',
      },
    },
  },
  plugins: [],
};