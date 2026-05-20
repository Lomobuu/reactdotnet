import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        dedupe: ['react', 'react-dom', 'react-router-dom'],
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://localhost:7127',
                changeOrigin: true,
                secure: false,
            }
        }
    }
})