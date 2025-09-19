// Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:5000',
  },
  production: {
    API_BASE_URL: 'https://ready-to-eat-production.up.railway.app', // Your actual Railway backend URL
  }
};

// Always use production config for now to ensure it works
export default config.production;
