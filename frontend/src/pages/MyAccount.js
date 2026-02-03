import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyAccount.css';

const MyAccount = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleChangePasswordClick = () => {
    navigate('/change-password');
  };

  return (
    <div className="my-account-container">
      <div className="my-account-content">
        <div className="account-header">
          <h1>My Account</h1>
        </div>

        <div className="account-details">
          <div className="detail-section">
            <h2>Personal Information</h2>
            <div className="detail-item">
              <label>Name:</label>
              <span>{user?.first_name} {user?.last_name}</span>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{user?.is_guest ? 'N/A' : user?.email}</span>
            </div>
            <div className="detail-item">
              <label>Mobile:</label>
              <span>{user?.mobile}</span>
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

export default MyAccount;
