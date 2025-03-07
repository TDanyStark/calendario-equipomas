/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary" : "#0202db",
        "primary-accent": "#0202db",
        "secondary-accent": "#E9F004",
        secondary: {
          100: "#E2E2D5",
          200: "#888883",
        },
        "principal-text": "#ffffff",
        "principal-bg": "#000000",
        "secondary-bg": "#1f2937",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
