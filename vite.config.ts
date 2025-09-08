  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  // https://vitejs.dev/config/
  export default defineConfig({
    base: '/cartridge-detective-quiz/',
    plugins: [react()],
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
