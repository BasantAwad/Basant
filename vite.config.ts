import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // For GitHub Pages at basantawad.github.io/Basant/, base must be '/Basant/'
  // For local dev, use '/' unless VITE_BASE_URL is set
  const isGitHubPages = env.VITE_DEPLOY_TARGET === 'github-pages'
  const base = isGitHubPages ? '/Basant/' : env.VITE_BASE_URL || '/'
  return {
    plugins: [react()],
    base,
  }
})
