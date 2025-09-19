// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
  },
  production: {
    API_BASE_URL: 'ready-to-eat-production.up.railway.app', // Replace with your actual backend URL
  }
};

// Determine current environment
const isDevelopment = process.env.NODE_ENV === 'development';
const currentConfig = isDevelopment ? config.development : config.production;

export default currentConfig;
