import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeScreen from './pages/HomeScreen';
import AdminHomeScreen from './pages/AdminHomeScreen';
import Navigation from './components/Navigation';
import './App.css';

// Create a wrapper component to access location
function AppContent({ isAuthenticated, userType, user, admin, handleLogin, handleAdminLogin, handleGuestLogin, handleLogout }) {
  const location = useLocation();
  
  // Don't show navigation on splash screen
  const shouldShowNavigation = isAuthenticated && userType !== 'admin' && location.pathname !== '/';

  return (
    <div className="App">
      {shouldShowNavigation && (
        <Navigation cartItemCount={0} />
      )}
      <Routes>
        <Route 
          path="/" 
          element={<SplashScreen />}
        />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            (userType === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />) : 
            <Login onLogin={handleLogin} onAdminLogin={handleAdminLogin} onGuestLogin={handleGuestLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            (userType === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/home" replace />) : 
            <Register onRegister={handleLogin} />
          } 
        />
        <Route 
          path="/home" 
          element={
            isAuthenticated && (userType === 'user' || userType === 'guest') ? 
            <HomeScreen user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/orders" 
          element={
            isAuthenticated && (userType === 'user' || userType === 'guest') ? 
            <div className="page-container">
              <h1>Orders</h1>
              <p>Your order history will appear here.</p>
            </div> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/rewards" 
          element={
            isAuthenticated && (userType === 'user' || userType === 'guest') ? 
            <div className="page-container">
              <h1>Rewards</h1>
              <p>Your rewards and points will appear here.</p>
            </div> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/account" 
          element={
            isAuthenticated && (userType === 'user' || userType === 'guest') ? 
            <div className="page-container">
              <h1>My Account</h1>
              <p>Your account settings will appear here.</p>
            </div> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/cart" 
          element={
            isAuthenticated && (userType === 'user' || userType === 'guest') ? 
            <div className="page-container">
              <h1>Shopping Cart</h1>
              <p>Your cart items will appear here.</p>
            </div> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/admin" 
          element={
            isAuthenticated && userType === 'admin' ? 
            <AdminHomeScreen admin={admin} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [userType, setUserType] = useState(null);
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
        if (data.user.is_guest) {
          setUser(data.user);
          setUserType('guest');
          setIsAuthenticated(true);
        } else if (data.user.role) {
          // This is an admin
          setAdmin(data.user);
          setUserType('admin');
          setIsAuthenticated(true);
        } else {
          // This is a regular user
          setUser(data.user);
          setUserType('user');
          setIsAuthenticated(true);
        }
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
    setUserType('user');
    setIsAuthenticated(true);
  };

  const handleAdminLogin = (adminData) => {
    setAdmin(adminData);
    setUserType('admin');
    setIsAuthenticated(true);
  };

  const handleGuestLogin = (guestData) => {
    setUser(guestData);
    setUserType('guest');
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
      setAdmin(null);
      setUserType(null);
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
      <AppContent 
        isAuthenticated={isAuthenticated}
        userType={userType}
        user={user}
        admin={admin}
        handleLogin={handleLogin}
        handleAdminLogin={handleAdminLogin}
        handleGuestLogin={handleGuestLogin}
        handleLogout={handleLogout}
      />
    </Router>
  );
}

export default App;
