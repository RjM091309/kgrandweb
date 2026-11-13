import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Set PMS_API_TARGET in .env to point at a different PMS (e.g. http://localhost:5050 on a dev PC).
  // Without it, the proxy goes to the admin server on the same machine (port 5051), as on the live server.
  const localPms = env.PMS_API_TARGET;
  const pmsTarget = localPms || 'http://127.0.0.1:5051';
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
          target: pmsTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              if (req.socket.remoteAddress) proxyReq.setHeader('X-Real-IP', req.socket.remoteAddress.replace(/^::ffff:/, ''));
              // A local PMS rejects POSTs whose Origin differs from its own ("Cross-site request blocked"), so present the
              // request as same-origin. Only when PMS_API_TARGET is set, so the live server behaves exactly as before.
              if (localPms) {
                proxyReq.setHeader('Origin', localPms);
                proxyReq.setHeader('Referer', `${localPms}/`);
              }
            });
          },
        },
      },
    },
  };
});
