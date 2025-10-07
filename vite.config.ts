import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
  },
  build: {
    outDir: "dist",      // Vercel expects this
    emptyOutDir: true,   // Clear previous builds
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"), // ensure Vite uses this as entry
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
