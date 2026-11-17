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
  // 'pre' so the absolute URLs are in place before Vite rewrites relative-looking
  // URLs in the HTML (otherwise the dev server serves "/https://..." on nested routes).
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => html.replaceAll('__SITE_URL__', siteUrl),
  },
})

// Public pages listed in sitemap.xml. Keep in sync with src/router/index.tsx.
const SITEMAP_PATHS = ['/', '/blocks', '/utxos', '/addresses', '/about']

const robotsTxt = (siteUrl: string) => `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

const sitemapXml = (siteUrl: string) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_PATHS.map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`).join('\n')}
</urlset>
`

// Without real files, the SPA fallback answers /robots.txt and /sitemap.xml with
// index.html. Both need the absolute site URL, so generate them instead of
// keeping static copies in public/.
const crawlerFilesPlugin = (siteUrl: string): Plugin => {
  const files: Record<string, { type: string; body: string }> = {
    'robots.txt': { type: 'text/plain', body: robotsTxt(siteUrl) },
    'sitemap.xml': { type: 'application/xml', body: sitemapXml(siteUrl) },
  }
  return {
    name: 'crawler-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = files[req.url?.split('?')[0].slice(1) ?? '']
        if (!file) return next()
        res.setHeader('Content-Type', `${file.type}; charset=utf-8`)
        res.end(file.body)
      })
    },
    generateBundle() {
      for (const [fileName, { body }] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName, source: body })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss(), siteUrlPlugin(siteUrl), crawlerFilesPlugin(siteUrl)],
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
