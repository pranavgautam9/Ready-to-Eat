import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeScreen from './pages/HomeScreen';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        // User is not authenticated, which is normal for new visitors
        console.log('User not authenticated, redirecting to login');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Network errors are common during development, don't treat as fatal
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div className="card">
          <div className="logo">
            <div className="logo-text">Ready-to-Eat</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<SplashScreen />}
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/home" replace /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? 
              <Navigate to="/home" replace /> : 
              <Register onRegister={handleLogin} />
            } 
          />
          <Route 
            path="/home" 
            element={
              isAuthenticated ? 
              <HomeScreen user={user} onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
