import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MediCapsLogo from '../assets/MediCaps-Logo-no-bg.png';
import './AdminNavigation.css';

const AdminNavigation = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="admin-navigation">
      <div className="nav-container">
        <Link to="/admin" className="nav-logo">
          <img src={MediCapsLogo} alt="MediCaps Logo" />
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/admin/orders" 
            className={`nav-link ${isActive('/admin/orders') ? 'active' : ''}`}
          >
            Past Orders
          </Link>
          
          <Link 
            to="/admin/menu" 
            className={`nav-link ${isActive('/admin/menu') ? 'active' : ''}`}
          >
            Configure Menu
          </Link>
          
          <Link 
            to="/admin/account" 
            className={`nav-link ${isActive('/admin/account') ? 'active' : ''}`}
          >
            My Account
          </Link>
          
          <button className="nav-link logout-btn" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
