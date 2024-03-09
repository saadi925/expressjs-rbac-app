{
  apps: [
    {
      script: '/build/src/server.js',
      name: 'advoco-api',
      //   for development
      watch: true,
      autorestart: true, // Enable automatic restart of the application on failure
      restart_delay: 5000, // Delay between restarts
    },
  ];
}
