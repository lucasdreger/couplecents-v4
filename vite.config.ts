
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '',
  server: {
    host: "localhost",
    port: 8080,
  },
  plugins: [
    react({
      // Add TypeScript configuration here to avoid referencing tsconfig.node.json
      tsDecorators: true,
      jsxImportSource: "@emotion/react",
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add esbuild configuration to handle TypeScript directly
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));
