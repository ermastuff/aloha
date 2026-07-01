import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev-only bridge: Vite's dev server doesn't run the Vercel serverless
 * functions in /api, so this mounts api/contact.js at POST /api/contact and
 * shims the Vercel-style req/res helpers. Loads .env into process.env first so
 * the handler sees RESEND_API_KEY etc. Has zero effect on the production build —
 * on Vercel the real serverless function handles the route.
 */
function apiDevServer(mode) {
  return {
    name: 'aloha-api-dev',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(mode, process.cwd(), '')
      for (const [k, v] of Object.entries(env)) {
        if (process.env[k] === undefined) process.env[k] = v
      }

      server.middlewares.use('/api/contact', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          return res.end('Method not allowed')
        }

        let raw = ''
        for await (const chunk of req) raw += chunk
        req.body = raw

        // Minimal Vercel-compatible response helpers
        res.status = (code) => { res.statusCode = code; return res }
        res.json = (obj) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(obj))
        }

        try {
          const { default: handler } = await server.ssrLoadModule('/api/contact.js')
          await handler(req, res)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Dev API error: ' + err.message }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), apiDevServer(mode)],
}))
