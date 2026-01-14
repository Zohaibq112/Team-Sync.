import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/',                 // ✅ VERY IMPORTANT
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
