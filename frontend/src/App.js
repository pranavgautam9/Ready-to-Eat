import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import HomeScreen from './pages/HomeScreen';
import AdminHomeScreen from './pages/AdminHomeScreen';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Rewards from './pages/Rewards';
import MyAccount from './pages/MyAccount';
import ChangePassword from './pages/ChangePassword';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AdminAccount from './pages/AdminAccount';
import AdminChangePassword from './pages/AdminChangePassword';
import PastOrders from './pages/PastOrders';
import ConfigureMenu from './pages/ConfigureMenu';
import Navigation from './components/Navigation';
import AdminNavigation from './components/AdminNavigation';
import './App.css';

// Create a wrapper component to access location
function AppContent({ isAuthenticated, userType, user, admin, handleLogin, handleAdminLogin, handleGuestLogin, handleLogout, cartItemCount, setCartItemCount, cart, onUpdateCart }) {
  const location = useLocation();
  
  // Don't show navigation on splash screen
  const shouldShowNavigation = isAuthenticated && userType !== 'admin' && location.pathname !== '/';
  const shouldShowAdminNavigation = isAuthenticated && userType === 'admin' && location.pathname !== '/';

  return (
    <div className="App">
      {shouldShowNavigation && (
        <Navigation cartItemCount={cartItemCount} onLogout={handleLogout} />
      )}
      {shouldShowAdminNavigation && (
        <AdminNavigation onLogout={handleLogout} />
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
            <HomeScreen user={user} onLogout={handleLogout} onCartUpdate={setCartItemCount} cart={cart} onUpdateCart={onUpdateCart} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/orders" 
          element={
            isAuthenticated && (userType === 'user' || userType === 'guest') ? 
            <Orders /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/rewards"
          element={
            isAuthenticated && (userType === 'user' || userType === 'guest') ? 
            <Rewards cart={cart} onUpdateCart={onUpdateCart} onCartUpdate={setCartItemCount} userType={userType} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/account" 
          element={
            isAuthenticated && (userType === 'user' || userType === 'guest') ? 
            <MyAccount user={user} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/change-password" 
          element={
            isAuthenticated && (userType === 'user' || userType === 'guest') ? 
            <ChangePassword /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />
        <Route 
          path="/reset-password" 
          element={<ResetPassword />} 
        />
        <Route 
          path="/cart" 
          element={
            isAuthenticated && (userType === 'user' || userType === 'guest') ? 
            <Cart cart={cart} onUpdateCart={onUpdateCart} onCartUpdate={setCartItemCount} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/checkout" 
          element={
            isAuthenticated && (userType === 'user' || userType === 'guest') ? 
            <Checkout cart={cart} onUpdateCart={onUpdateCart} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="*" 
          element={<div style={{padding: '20px', background: 'yellow', color: 'black', fontSize: '30px'}}><h1>🚨 CATCH-ALL ROUTE: {location.pathname}</h1></div>} 
        />
        <Route 
          path="/admin" 
          element={
            isAuthenticated && userType === 'admin' ? 
            <AdminHomeScreen admin={admin} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            isAuthenticated && userType === 'admin' ? 
            <PastOrders /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/admin/menu" 
          element={
            isAuthenticated && userType === 'admin' ? 
            <ConfigureMenu /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/admin/account" 
          element={
            isAuthenticated && userType === 'admin' ? 
            <AdminAccount admin={admin} onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/admin/change-password" 
          element={
            isAuthenticated && userType === 'admin' ? 
            <AdminChangePassword /> : 
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
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cart, setCart] = useState({});

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // First try to check if user is admin
      const adminResponse = await fetch('http://localhost:5000/api/admin/profile', {
        credentials: 'include'
      });
      
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        setAdmin(adminData.admin);
        setUserType('admin');
        setIsAuthenticated(true);
        return;
      }
      
      // If not admin, check if regular user
      const response = await fetch('http://localhost:5000/api/user/profile', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.user.is_guest) {
          setUser(data.user);
          setUserType('guest');
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
      await fetch('http://localhost:5000/api/logout', {
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
      setCart({}); // Clear cart on logout
    }
  };

  const handleUpdateCart = (newCart) => {
    setCart(newCart);
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
        cartItemCount={cartItemCount}
        setCartItemCount={setCartItemCount}
        cart={cart}
        onUpdateCart={handleUpdateCart}
      />
    </Router>
  );
}

export default App;
