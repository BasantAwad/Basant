import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const target = env.VITE_DEPLOY_TARGET
  let base = '/'
  if (target === 'github-pages') {
    base = '/Basant/'
  }
  return {
    plugins: [react()],
    base,
  }
})
