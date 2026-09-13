import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Telegram Mini Apps are served over https and embedded in a WebView,
// relative base keeps the build portable regardless of hosting path.
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    host: true,
    port: 5173
  }
});
