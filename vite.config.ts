import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

// Development only. In production nginx serves the built dist/ folder and forwards /api/public/ to the admin server itself.
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Set PMS_API_TARGET in .env to point at a different PMS (e.g. http://localhost:5050 on a dev PC).
  const pmsTarget = env.PMS_API_TARGET || 'http://127.0.0.1:5051';
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // Kept until nginx serves dist/ for the domain; safe to remove after that move.
      allowedHosts: ['thekgrandhotel.com', 'www.thekgrandhotel.com'],
      // Set DISABLE_HMR=true to turn off hot reload and file watching.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        // The browser's Host header is kept (no changeOrigin), so it matches the Origin of the page and the PMS's
        // same-origin check passes on its own, while it still blocks requests sent from other sites.
        '/api/public': {
          target: pmsTarget,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              // Lets the PMS rate-limit each visitor (it trusts X-Real-IP only from a local proxy).
              if (req.socket.remoteAddress) proxyReq.setHeader('X-Real-IP', req.socket.remoteAddress.replace(/^::ffff:/, ''));
            });
          },
        },
      },
    },
  };
});
