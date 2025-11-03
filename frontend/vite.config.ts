import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
   server: {
    middlewareMode: false,
    hmr: {
      host: 'localhost',
      port: 5173
    }
  },
  build: {
    outDir: '../build/frontend',
    emptyOutDir: true,
    minify: false,  // Disable minification to see readable code
    sourcemap: true, // Generate source maps
  }
})