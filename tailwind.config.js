/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: 'false',
  daisyui: {
    themes: false,
    darkTheme: "light",
    themeRoot: "root",
  
  },

  plugins: [require("daisyui"), require('@tailwindcss/aspect-ratio') ],
}