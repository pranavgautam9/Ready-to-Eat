import React from 'react';
import './AdminHomeScreen.css';
import MediCapsLogo from '../assets/MediCaps-Logo-no-bg.png';

const AdminHomeScreen = ({ admin, onLogout }) => {
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
    <div className="admin-home-container">
      <div className="container">
        <div className="admin-home-header">
          <div className="logo">
            <img 
              src={MediCapsLogo} 
              alt="MediCaps University Logo" 
              className="logo-image"
            />
            <div className="logo-text">Ready-to-Eat</div>
          </div>
          
          <h1 className="welcome-message">
            Welcome, {admin?.full_name}! 👨‍💼
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '18px' }}>
            Administrative Dashboard - Manage your cafeteria system
          </p>
        </div>

        <div className="admin-info">
          <h2 style={{ 
            color: 'var(--white)', 
            marginBottom: '24px', 
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            Administrator Information
          </h2>
          
          <div className="admin-details">
            <div className="admin-detail">
              <div className="admin-detail-label">Full Name</div>
              <div className="admin-detail-value">{admin?.full_name}</div>
            </div>
            
            <div className="admin-detail">
              <div className="admin-detail-label">Username</div>
              <div className="admin-detail-value">{admin?.username}</div>
            </div>
            
            <div className="admin-detail">
              <div className="admin-detail-label">Role</div>
              <div className="admin-detail-value">{admin?.role}</div>
            </div>
            
            <div className="admin-detail">
              <div className="admin-detail-label">Account Created</div>
              <div className="admin-detail-value">
                {formatDate(admin?.created_at)}
              </div>
            </div>
            
            <div className="admin-detail">
              <div className="admin-detail-label">Last Updated</div>
              <div className="admin-detail-value">
                {formatDate(admin?.updated_at)}
              </div>
            </div>
            
            <div className="admin-detail">
              <div className="admin-detail-label">Admin ID</div>
              <div className="admin-detail-value">#{admin?.id}</div>
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
              🛠️ Administrative features coming soon!
            </p>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '14px'
            }}>
              Manage users, view orders, configure menu items, and monitor system analytics.
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

export default AdminHomeScreen;
