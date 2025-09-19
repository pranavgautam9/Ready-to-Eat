@echo off
set DISABLE_ESLINT_PLUGIN=true
set CI=false
set SKIP_PREFLIGHT_CHECK=true
npx react-scripts build
