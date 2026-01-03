import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import config from '../config';
import './ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token,
          newPassword: password 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset successfully! You can now log in with your new password.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (error) {
      setError('An error occurred while resetting password');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (!token) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-content">
          <div className="error-message">
            <span>⚠️</span>
            Invalid reset link. Please request a new password reset.
          </div>
          <button
            onClick={handleBackToLogin}
            className="btn btn-primary"
            style={{ marginTop: '20px' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-content">
        <div className="reset-password-header">
          <h1>Reset Password</h1>
          <p>Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Enter your new password"
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="form-input"
              placeholder="Confirm your new password"
              minLength="6"
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
              {message}
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
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
