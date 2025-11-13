/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: "#02010a",
        "oxford-blue": "#04052e",
        "federal-blue": "#140152",
        "navy-blue": "#22007c",
        "duke-blue": "#0d00a4",
        // Keep your old colors if needed
        "dark-purple": "#2c1320",
        "english-violet": "#5f4b66",
        "cool-gray": "#a7adc6",
        "cool-gray-2": "#8797af",
        "paynes-gray": "#56667a",
      },
      fontFamily: {
        sans: ["system-ui", "Avenir", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
