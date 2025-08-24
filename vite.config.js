import { defineConfig } from "vite";
export default defineConfig({
  root: "dist",         // Eleventy’s output
  build: { outDir: "dist", emptyOutDir: false }
});
