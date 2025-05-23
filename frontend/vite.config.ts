import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    optimizeDeps: {
        exclude: ['lucide-react'],
    },
    server: {
        proxy: {
            '/api': {
                target: '127.0.0.1:5000',
                ws: true, // enables WebSocket proxying
            },
        },
    },
});
