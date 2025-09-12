import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyAccount.css';

const AdminAccount = ({ admin, onLogout }) => {
  const navigate = useNavigate();

  const handleChangePasswordClick = () => {
    navigate('/admin/change-password');
  };

  return (
    <div className="my-account-container">
      <div className="my-account-content">
        <div className="account-header">
          <h1>My Account</h1>
        </div>

        <div className="account-details">
          <div className="detail-section">
            <h2>Administrator Information</h2>
            <div className="detail-item">
              <label>Username:</label>
              <span>{admin?.username || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Full Name:</label>
              <span>{admin?.full_name || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Role:</label>
              <span>{admin?.role || 'System Administrator'}</span>
            </div>
          </div>

          <div className="security-actions">
            <button 
              className="change-password-btn"
              onClick={handleChangePasswordClick}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;
