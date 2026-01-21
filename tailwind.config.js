/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        academia: {
          bg: '#1a1a1a',
          text: '#d4c3a1',
          accent: '#8b0000',
        },
        zen: {
          bg: '#fcfaf7',
          text: '#2d2d2d',
          accent: '#556b2f',
        }
      },
    },
  },
  plugins: [],
}