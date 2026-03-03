import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://localhost:5003",
        secure: false,
        changeOrigin: true,
      },
      "/v1": {
        target: "https://localhost:5001",
        secure: false,
        changeOrigin: true,
      },
    },
  },

  plugins: [react(), tailwindcss(), mkcert()],
});
