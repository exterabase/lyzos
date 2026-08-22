import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base must match the repo name for GitHub Pages project sites
// (served at https://<user>.github.io/<repo>/), otherwise built asset
// paths resolve to the domain root and 404.
export default defineConfig({
  plugins: [react()],
  base: '/lyzos/',
})
