  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  // Plugin to inject OG meta tags at build time
  const injectOGTags = () => {
    return {
      name: 'inject-og-tags',
      transformIndexHtml(html: string) {
        const baseUrl = process.env.VITE_APP_URL || 'https://andrejanev96.github.io/cartridge-detective-quiz';
        return html
          .replace('property="og:url" content=""', `property="og:url" content="${baseUrl}"`)
          .replace('property="og:image" content=""', `property="og:image" content="${baseUrl}/og-image.png"`)
          .replace('name="twitter:image" content=""', `name="twitter:image" content="${baseUrl}/og-image.png"`);
      }
    }
  }

  // https://vitejs.dev/config/
  export default defineConfig({
    base: '/cartridge-detective-quiz/',
    plugins: [react(), injectOGTags()],
    server: {
      headers: {
        'Permissions-Policy': 'accelerometer=(), gyroscope=(), magnetometer=(), camera=(), microphone=(), payment=(), usb=()'
      }
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            animations: ['framer-motion'],
          },
        },
      },
    },
  })
