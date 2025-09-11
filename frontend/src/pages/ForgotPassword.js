import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Show the reset token for testing (remove in production)
        if (data.reset_token) {
          setMessage(`${data.message}\n\nReset Token: ${data.reset_token}\n\nReset Link: http://localhost:3000/reset-password?token=${data.reset_token}`);
        }
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      setError('An error occurred while sending reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <div className="forgot-password-header">
          <h1>Forgot Password?</h1>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your email address"
            />
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              <span>✅</span>
              <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{message}</pre>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="btn btn-secondary"
              disabled={loading}
            >
              Back to Login
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
