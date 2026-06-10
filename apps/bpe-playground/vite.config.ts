import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Pick a unique port for each site so multiple `npm run dev` instances coexist.
const DEV_FRONTEND_PORT = 5501;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: DEV_FRONTEND_PORT,
    strictPort: true,
  },
});
