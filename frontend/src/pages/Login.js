import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import MediCapsLogo from '../assets/MediCaps-Logo-no-bg.png';

const Login = ({ onLogin, onGuestLogin, onAdminLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [adminFormData, setAdminFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminError, setAdminError] = useState('');
  const [loginMode, setLoginMode] = useState('user'); // 'user', 'admin', 'guest'
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleAdminChange = (e) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value
    });
    if (adminError) setAdminError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user);
        navigate('/home');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminError('');

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(adminFormData)
      });

      const data = await response.json();

      if (response.ok) {
        onAdminLogin(data.admin);
        navigate('/admin');
      } else {
        setAdminError(data.error || 'Admin login failed. Please try again.');
      }
    } catch (error) {
      setAdminError('Network error. Please check your connection and try again.');
    } finally {
      setAdminLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setGuestLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/guest/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        onGuestLogin(data.user);
        navigate('/home');
      } else {
        setError('Guest access failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setGuestLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo">
          <img 
            src={MediCapsLogo} 
            alt="MediCaps University Logo" 
            className="logo-image"
          />
          <div className="logo-text">Ready-to-Eat</div>
          <div className="logo-divider"></div>
        </div>

        {/* Login Mode Tabs */}
        <div className="login-tabs">
          <button 
            className={`tab-button ${loginMode === 'user' ? 'active' : ''}`}
            onClick={() => setLoginMode('user')}
          >
            User Login
          </button>
          <button 
            className={`tab-button ${loginMode === 'admin' ? 'active' : ''}`}
            onClick={() => setLoginMode('admin')}
          >
            Admin Login
          </button>
        </div>

        {/* User Login Form */}
        {loginMode === 'user' && (
          <>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-toggle">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <span>⚠️</span>
                  {error}
                </div>
              )}

              <div className="forgot-password">
                <button type="button" onClick={handleForgotPassword}>
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '16px' }}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="auth-options">
              <div className="divider">
                <span>OR</span>
              </div>
              
              <button
                onClick={handleGuestAccess}
                className="btn btn-secondary"
                style={{ width: '100%', marginBottom: '16px' }}
                disabled={guestLoading}
              >
                {guestLoading ? 'Accessing...' : 'Continue as Guest'}
              </button>
            </div>
          </>
        )}

        {/* Admin Login Form */}
        {loginMode === 'admin' && (
          <form onSubmit={handleAdminSubmit}>
            <div className="form-group">
              <label htmlFor="admin-username" className="form-label">Username</label>
              <input
                type="text"
                id="admin-username"
                name="username"
                className="form-input"
                value={adminFormData.username}
                onChange={handleAdminChange}
                placeholder="Enter admin username"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-password" className="form-label">Password</label>
              <div className="password-toggle">
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  id="admin-password"
                  name="password"
                  className="form-input"
                  value={adminFormData.password}
                  onChange={handleAdminChange}
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                >
                  {showAdminPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <button type="button" onClick={handleForgotPassword}>
                Forgot Password?
              </button>
            </div>

            {adminError && (
              <div className="error-message">
                <span>⚠️</span>
                {adminError}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '16px' }}
              disabled={adminLoading}
            >
              {adminLoading ? 'Signing In...' : 'Admin Sign In'}
            </button>
          </form>
        )}

        <div className="auth-footer">
          <p>Don't have an account?</p>
          <Link to="/register" className="link">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
