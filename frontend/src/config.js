// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
  },
  production: {
    API_BASE_URL: 'https://ready-to-eat-production.up.railway.app', // Your actual Railway backend URL
  }
};

// Determine current environment
const isDevelopment = process.env.NODE_ENV === 'development';
const currentConfig = isDevelopment ? config.development : config.production;

export default currentConfig;
