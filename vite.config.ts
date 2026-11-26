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
    build: {
      rolldownOptions: {
        output: {
          // Libraries in their own files: they rarely change, so browsers keep them cached across deploys of the site's code.
          codeSplitting: {
            groups: [
              {name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/},
              {name: 'motion', test: /node_modules[\\/](motion|motion-dom|motion-utils|framer-motion)[\\/]/},
            ],
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
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
