module.exports = {
  apps: [
    {
      name: "nextjs-website",                         // Your app name
      script: "node_modules/next/dist/bin/next",      // Next.js start script
      args: "start -p 3000",                          // Start on port 3000
      instances: "max",                               // Cluster mode, use all CPU cores
      exec_mode: "cluster",
      watch: false,                                   // Disable auto-reload in prod
      max_memory_restart: "500M",                     // Restart if memory exceeds
      error_file: "./logs/err.log",                  // Error logs
      out_file: "./logs/out.log",                     // Stdout logs
      log_file: "./logs/combined.log",               // Combined logs
      time: true,                                    // Add timestamp to logs
      merge_logs: true,
      autorestart: true,                             // Restart on crash
      max_restarts: 10,
      min_uptime: "10s",
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3000
      }
    }
  ]
};
