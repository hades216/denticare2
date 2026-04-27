import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    tanstackRouter(),
    tanstackStart({
      server: {
        preset: "node-server",
      },
    }),
    react(),
    tailwindcss(),
  ],
});
