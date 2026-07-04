import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/ — build estático listo para Vercel
export default defineConfig({
  plugins: [react()],
})
