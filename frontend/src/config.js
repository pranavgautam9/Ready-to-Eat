// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
  },
  production: {
    API_BASE_URL: 'https://ready-to-eat-production.up.railway.app', // Your actual Railway backend URL
  }
};

// Automatically detect environment and use appropriate config
const isDevelopment = process.env.NODE_ENV === 'development' || 
                      window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

export default isDevelopment ? config.development : config.production;
