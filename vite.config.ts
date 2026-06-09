import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Pick a unique port for each site so multiple `npm run dev` instances coexist.
// Assigned ports live in ../readme.md (5500-5510).
const DEV_FRONTEND_PORT = 5506;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: DEV_FRONTEND_PORT,
    strictPort: true,
  },
  // onnxruntime-web ships wasm assets that break if Vite pre-bundles them.
  optimizeDeps: { exclude: ["@huggingface/transformers", "onnxruntime-web"] },
});
