/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#030305", // Extremely dark obsidian
        surface: "rgba(10, 10, 15, 0.4)", // Very subtle glass
        "surface-raised": "rgba(20, 20, 30, 0.6)",
        primary: "#CFFF04", // High-visibility lime/neon yellow
        secondary: "#FF0055", // Neon pink
        accent: "#00F0FF", // Cyan glow
        "text-primary": "#F4F4F5",
        "text-secondary": "#8A8F98",
        "border-glow": "rgba(255, 255, 255, 0.06)",
        "border-primary": "rgba(207, 255, 4, 0.2)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Syne", "sans-serif"],
        tech: ["Space Grotesk", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2.5rem",
        "full-glass": "9999px",
      },
      boxShadow: {
        "neon-primary": "0 0 20px rgba(207, 255, 4, 0.15), 0 0 40px rgba(207, 255, 4, 0.05)",
        "neon-accent": "0 0 20px rgba(0, 240, 255, 0.2)",
        "neon-pink": "0 0 20px rgba(255, 0, 85, 0.2)",
        "glass-inner": "inset 0 1px 1px rgba(255, 255, 255, 0.1)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-dark": "radial-gradient(at 0% 0%, rgba(207,255,4,0.05) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(0,240,255,0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255,0,85,0.03) 0px, transparent 50%)",
      }
    },
  },
  plugins: [],
};
