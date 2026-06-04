import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    tanstackStart({ server: { entry: "server" } }),
    react(),
    cloudflare({
      viteEnvironment: {
        name: "ssr"
      }
    })
  ],
});