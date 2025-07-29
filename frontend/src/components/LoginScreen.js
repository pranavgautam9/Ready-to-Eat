import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaUserShield } from 'react-icons/fa';
import './LoginScreen.css';

const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission based on active tab
    console.log('Form submitted:', { tab: activeTab, data: formData });
  };

  const handleGuestLogin = () => {
    console.log('Guest login clicked');
    // Navigate to menu page as guest
  };

  const renderUserLogin = () => (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label className="form-label">
          <FaEnvelope className="form-icon" />
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Enter your email"
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">
          <FaLock className="form-icon" />
          Password
        </label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter your password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Login
      </button>
    </form>
  );

  const renderRegister = () => (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label className="form-label">
          <FaUser className="form-icon" />
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          <FaEnvelope className="form-icon" />
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Enter your email"
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">
          <FaLock className="form-icon" />
          Password
        </label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Create a password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          <FaLock className="form-icon" />
          Confirm Password
        </label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Register
      </button>
    </form>
  );

  const renderAdminLogin = () => (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label className="form-label">
          <FaUserShield className="form-icon" />
          Admin ID
        </label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Enter admin ID"
          required
        />
      </div>
      
      <div className="form-group">
        <label className="form-label">
          <FaLock className="form-icon" />
          Password
        </label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter admin password"
            required
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Admin Login
      </button>
    </form>
  );

  const renderResetPassword = () => (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label className="form-label">
          <FaEnvelope className="form-icon" />
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Enter your email"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Reset Password
      </button>
    </form>
  );

  return (
    <div className="login-screen">
      <div className="container">
        <div className="login-container">
          <div className="login-header">
            <img 
              src="/Medicaps-Logo.png" 
              alt="Medi-Caps University Logo" 
              className="header-logo"
            />
            <h1 className="header-title">Medi-Caps Cafeteria</h1>
            <p className="header-subtitle">Welcome back! Please sign in to continue.</p>
          </div>

          <div className="login-tabs">
            <button
              className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => setActiveTab('user')}
            >
              <FaUser />
              User Login
            </button>
            <button
              className={`tab-button ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              <FaUserShield />
              Admin Login
            </button>
          </div>

          <div className="login-content">
            {activeTab === 'user' && renderUserLogin()}
            {activeTab === 'admin' && renderAdminLogin()}
          </div>

          {activeTab === 'user' && (
            <div className="login-options">
              <div className="divider">
                <span>or</span>
              </div>
              
              <button 
                className="btn btn-secondary w-full mb-4"
                onClick={() => setActiveTab('register')}
              >
                Create New Account
              </button>
              
              <button 
                className="btn btn-secondary w-full mb-4"
                onClick={() => setActiveTab('reset')}
              >
                Forgot Password?
              </button>
              
              <button 
                className="btn btn-secondary w-full"
                onClick={handleGuestLogin}
              >
                Continue as Guest
              </button>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="login-content">
              {renderRegister()}
              <button 
                className="btn btn-secondary w-full mt-4"
                onClick={() => setActiveTab('user')}
              >
                Already have an account? Sign in
              </button>
            </div>
          )}

          {activeTab === 'reset' && (
            <div className="login-content">
              {renderResetPassword()}
              <button 
                className="btn btn-secondary w-full mt-4"
                onClick={() => setActiveTab('user')}
              >
                Back to Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginScreen; 