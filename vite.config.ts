import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(() => {
  // Vercel deploys to *.vercel.app root — base must be '/'
  // GitHub Pages deploys to basantawad.github.io/Basant/ — use VITE_DEPLOY_TARGET=github-pages npm run build
  return { plugins: [react()], base: '/' }
})
