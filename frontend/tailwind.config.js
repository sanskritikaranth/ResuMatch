/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // This tells Tailwind: "Look at the <html> tag for the word 'dark'"
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}