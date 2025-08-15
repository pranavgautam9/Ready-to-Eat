import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MediCapsLogo from '../assets/MediCaps-Logo-no-bg.png';
import './SplashScreen.css';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after 2 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <img 
          src={MediCapsLogo} 
          alt="MediCaps University Logo" 
          className="splash-logo"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
