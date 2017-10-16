module.exports = {
  apps: [
    {
      name: 'api-mocker',
      script: './server/index.js',
      cwd: '/var/www/api-mocker/server/',
      env_production: {
        NODE_ENV: 'production',
        EGG_SERVER_ENV: "prod",
        PORT: 7001
      }
    }
  ]
};
