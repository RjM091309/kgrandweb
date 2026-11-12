import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      allowedHosts: ['thekgrandhotel.com', 'www.thekgrandhotel.com'],
      // Set DISABLE_HMR=true to turn off hot reload and file watching.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      // When the site is opened on its port directly (http://<server-ip>:5070, while the domain is in maintenance), the booking
      // API is forwarded to the admin server as nginx does for the domain. X-Real-IP lets the admin rate-limit each visitor.
      proxy: {
        '/api/public': {
          target: 'http://127.0.0.1:5051',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              if (req.socket.remoteAddress) proxyReq.setHeader('X-Real-IP', req.socket.remoteAddress.replace(/^::ffff:/, ''));
            });
          },
        },
      },
    },
  };
});
