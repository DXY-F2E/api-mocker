module.exports = {
  apps: [{
    name: 'api-mocker-server',
    script: 'index.js',
    env_test: {
      NODE_ENV: 'development',
      EGG_SERVER_ENV: 'test'
    },
    env_production: {
      NODE_ENV: 'production',
      EGG_SERVER_ENV: 'prod'
    }
  }]
}
