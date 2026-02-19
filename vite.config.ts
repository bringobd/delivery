
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Change 'bringo-app' to your repository name if deploying to GitHub Pages
  // e.g. base: '/my-delivery-app/'
  base: '/bringo-app/', 
})
