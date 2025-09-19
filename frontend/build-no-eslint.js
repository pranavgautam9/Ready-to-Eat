const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Set environment variables to disable ESLint
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.CI = 'false';
process.env.SKIP_PREFLIGHT_CHECK = 'true';

console.log('Building without ESLint...');

try {
  execSync('npx react-scripts build', { stdio: 'inherit' });
  
  // Copy 404.html to the root of build directory
  const source404 = path.join(__dirname, 'public', '404.html');
  const dest404 = path.join(__dirname, 'build', '404.html');
  
  if (fs.existsSync(source404)) {
    fs.copyFileSync(source404, dest404);
    console.log('Copied 404.html to build root');
  }
  
  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}