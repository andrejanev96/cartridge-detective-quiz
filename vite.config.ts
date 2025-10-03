import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plugin to inject OG meta tags at build time
const injectOGTags = () => {
  return {
    name: 'inject-og-tags',
    transformIndexHtml(html: string) {
      const baseUrl = process.env.VITE_APP_URL || 'https://cartridgequizzes.com';
      const ogImageUrl = `${baseUrl}/og-image.png`;

      // Inject OG tags after og:type
      const ogTags = `
    <meta property="og:url" content="${baseUrl}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="The Cartridge Detective Challenge - Test your ammunition knowledge" />`;

      // Inject twitter:image after twitter:description
      const twitterTag = `
    <meta name="twitter:image" content="${ogImageUrl}" />`;

      return html
        .replace('property="og:type" content="website" />', `property="og:type" content="website" />${ogTags}`)
        .replace('name="twitter:description" content="Test your ammunition knowledge with this interactive cartridge identification quiz." />', `name="twitter:description" content="Test your ammunition knowledge with this interactive cartridge identification quiz." />${twitterTag}`);
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
