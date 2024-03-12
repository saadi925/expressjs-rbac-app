module.exports = {
  apps: [
    {
      script: 'build/src/server.js',
      name: 'advoco-api',
      watch: false,
      autorestart: true, // Enable automatic restart of the application on failure
      restart_delay: 5000, // Delay between restarts
    },
  ],
};
