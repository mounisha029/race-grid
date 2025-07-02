
// Deployment configuration for different environments
module.exports = {
  development: {
    domain: 'localhost:8080',
    ssl: false,
    compressionLevel: 1,
    minifyAssets: false,
    sourceMap: true,
    hotReload: true,
    apiTimeout: 30000,
    retryAttempts: 3,
  },
  staging: {
    domain: 'staging.f1insights.com',
    ssl: true,
    compressionLevel: 6,
    minifyAssets: true,
    sourceMap: true,
    hotReload: false,
    apiTimeout: 15000,
    retryAttempts: 2,
  },
  production: {
    domain: 'f1insights.com',
    ssl: true,
    compressionLevel: 9,
    minifyAssets: true,
    sourceMap: false,
    hotReload: false,
    apiTimeout: 10000,
    retryAttempts: 1,
  }
};
