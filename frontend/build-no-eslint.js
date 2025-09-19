const { execSync } = require('child_process');

// Set environment variables to disable ESLint
process.env.DISABLE_ESLINT_PLUGIN = 'true';
process.env.CI = 'false';
process.env.SKIP_PREFLIGHT_CHECK = 'true';

console.log('Building without ESLint...');

try {
  execSync('npx react-scripts build', { stdio: 'inherit' });
  console.log('Build successful!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
