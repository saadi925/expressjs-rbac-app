//  transform into common js
module.exports = {
  apps: [
    {
      name: 'api server',
      script: 'npm run dev',
      watch: true,
      env: {
        NODE_ENV: 'development',
      },
    },
  ],
};
