module.exports = {
  apps: [
    {
      name: 'kgrandhotel',
      cwd: __dirname,
      script: 'node_modules/vite/bin/vite.js',
      args: '--host 0.0.0.0 --port 5070 --strictPort',
      interpreter: '/root/.nvm/versions/node/v22.23.3/bin/node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
    },
  ],
};
