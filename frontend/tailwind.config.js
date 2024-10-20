/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0000ff',
        'secondary': {
          100: '#E2E2D5',
          200: '#888883',
        },
        'principal-text': '#ffffff',
      },
    },
  },
  plugins: [],
}

