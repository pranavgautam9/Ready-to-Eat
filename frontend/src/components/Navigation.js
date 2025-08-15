import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MediCapsLogo from '../assets/MediCaps-Logo-no-bg.png';
import './Navigation.css';

const Navigation = ({ cartItemCount = 0 }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/home" className="nav-logo">
          <img src={MediCapsLogo} alt="MediCaps Logo" />
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/orders" 
            className={`nav-link ${isActive('/orders') ? 'active' : ''}`}
          >
            Orders
          </Link>
          
          <Link 
            to="/rewards" 
            className={`nav-link ${isActive('/rewards') ? 'active' : ''}`}
          >
            Rewards
          </Link>
          
          <Link 
            to="/account" 
            className={`nav-link ${isActive('/account') ? 'active' : ''}`}
          >
            My Account
          </Link>
          
          <Link 
            to="/cart" 
            className={`nav-link cart-link ${isActive('/cart') ? 'active' : ''}`}
          >
            <div className="cart-icon">
              🛒
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
