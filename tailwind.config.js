/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "border-glow": "var(--color-border-glow)",
        "border-primary": "var(--color-border-primary)",
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
        "neon-primary": "var(--shadow-neon-primary)",
        "neon-accent": "var(--shadow-neon-accent)",
        "neon-pink": "var(--shadow-neon-pink)",
        "glass-inner": "var(--shadow-glass-inner)",
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
