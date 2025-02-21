
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  base: '',
  server: {
    host: "localhost",
    port: 8080,
  },
  plugins: [
    react({
      tsDecorators: true,
      plugins: [
        ['@swc/plugin-emotion', {}]
      ]
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    target: 'esnext',
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true
      },
      tsconfigRaw: {
        compilerOptions: {
          target: 'esnext',
          module: 'esnext',
          moduleResolution: 'bundler',
          jsx: 'preserve',
          allowJs: true,
          skipLibCheck: true,
          esModuleInterop: true,
          strict: true,
          composite: true,
        }
      }
    }
  }
}));
