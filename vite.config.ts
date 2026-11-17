import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Public origin of the site. Link previews, canonical URLs, robots.txt and the
// sitemap need absolute URLs, so this is baked in at build time.
const DEFAULT_SITE_URL = 'https://dashboard.thegreatlich.xyz'

// Replaces __SITE_URL__ in index.html. Link-preview bots don't run JavaScript,
// so these tags have to be in the static HTML.
const siteUrlPlugin = (siteUrl: string): Plugin => ({
  name: 'site-url',
  transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss(), siteUrlPlugin(siteUrl)],
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
    },
    preview: {
      // Vite preview server automatically handles SPA routing
      port: 4173,
      allowedHosts: [
        'dashboard.thegreatlich.xyz',
        'indexer.qbtc.net',
        'localhost',
        '.localhost', // Allow all localhost subdomains
      ],
    },
  }
})
