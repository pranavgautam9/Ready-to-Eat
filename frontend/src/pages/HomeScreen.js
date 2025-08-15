import React from 'react';
import './HomeScreen.css';
import MediCapsLogo from '../assets/MediCaps-Logo-no-bg.png';
import { Link } from 'react-router-dom';

const HomeScreen = ({ user, onLogout }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="home-container">
      <div className="container">
        <div className="home-header">
          <div className="logo">
            <img 
              src={MediCapsLogo} 
              alt="MediCaps University Logo" 
              className="logo-image"
            />
            <div className="logo-text">Ready-to-Eat</div>
          </div>
          
          <h1 className="welcome-message">
            Welcome, {user?.first_name} {user?.last_name}! 🎉
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px' }}>
            {user?.is_guest ? 'Guest Access - Temporary Account' : 'You have successfully logged into your account.'}
          </p>
          {user?.is_guest && (
            <div style={{ 
              background: 'rgba(255, 193, 7, 0.2)', 
              border: '1px solid rgba(255, 193, 7, 0.5)',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '16px',
              color: '#856404'
            }}>
              ⚠️ Guest Mode: Your session will end when you close the browser. 
              <br />
              <Link to="/register" style={{ color: '#856404', textDecoration: 'underline' }}>
                Create a permanent account
              </Link> to save your preferences and order history.
            </div>
          )}
        </div>

        <div className="user-info">
          <h2 style={{ 
            color: 'var(--white)', 
            marginBottom: '24px', 
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            Account Information
          </h2>
          
          <div className="user-details">
            <div className="user-detail">
              <div className="user-detail-label">Full Name</div>
              <div className="user-detail-value">
                {user?.first_name} {user?.last_name}
              </div>
            </div>
            
            <div className="user-detail">
              <div className="user-detail-label">Email Address</div>
              <div className="user-detail-value">{user?.email}</div>
            </div>
            
            <div className="user-detail">
              <div className="user-detail-label">Mobile Number</div>
              <div className="user-detail-value">{user?.mobile}</div>
            </div>
            
            <div className="user-detail">
              <div className="user-detail-label">Account Created</div>
              <div className="user-detail-value">
                {formatDate(user?.created_at)}
              </div>
            </div>
            
            <div className="user-detail">
              <div className="user-detail-label">Last Updated</div>
              <div className="user-detail-value">
                {formatDate(user?.updated_at)}
              </div>
            </div>
            
            <div className="user-detail">
              <div className="user-detail-label">User ID</div>
              <div className="user-detail-value">#{user?.id}</div>
            </div>
          </div>
          
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            marginTop: '20px'
          }}>
            <p style={{ 
              color: 'var(--white)', 
              fontSize: '16px',
              marginBottom: '12px'
            }}>
              🍽️ Food ordering functionality coming soon!
            </p>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '14px'
            }}>
              Browse the cafeteria menu, place orders, and track your deliveries.
            </p>
          </div>
        </div>

        <div className="logout-section">
          <button onClick={onLogout} className="logout-button">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
