import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: {
    proxy: {
      "/chathub": {
        target: "https://localhost:5001",
        secure: false,
        ws: true,
        changeOrigin: true
      },
      
      "/api/auth": {
        target: "https://localhost:5003",
        secure: false,
        changeOrigin: true,
      },
      "/api": {
        target: "https://localhost:5001",
        secure: false,
        changeOrigin: true,
      },
     
      
    },
  },

  plugins: [react(), tailwindcss(), mkcert()],
});
