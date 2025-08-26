import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Ensure proper asset handling for Chrome extension
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        // Ensure assets are properly referenced for extension
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'assets/[name].js',
        entryFileNames: 'assets/[name].js'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
