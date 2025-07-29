import React from 'react';
import './HomeScreen.css';

const HomeScreen = ({ user, onLogout }) => {
  return (
    <div className="home-screen">
      <div className="home-container">
        <div className="home-header">
          <h1>Welcome to Ready-to-Eat!</h1>
          <p>Hello, {user?.name || 'User'}!</p>
        </div>
        
        <div className="home-content">
          <div className="welcome-card">
            <h2>🎉 Successfully Logged In!</h2>
            <p>This is your home screen. More features coming soon!</p>
            <div className="user-info">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
            </div>
          </div>
          
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;