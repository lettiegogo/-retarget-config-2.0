import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/-retarget-config-2.0/' : '/',
  plugins: [react()],
}))
