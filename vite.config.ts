import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves this repo under /baseballIQ/. The Actions workflow
// overrides BASE_PATH from the real repo name so the casing can never drift;
// the literal below is the fallback for local `npm run build && npm run preview`.
const base = process.env.BASE_PATH ?? '/baseballIQ/'

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: 'es2022',
    sourcemap: true,
  },
})
