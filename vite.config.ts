import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/-retarget-config-2.0/',
  plugins: [react()],
})
