import React, { useState, useEffect } from 'react';
import './HomeScreen.css';
import MediCapsLogo from '../assets/MediCaps-Logo-no-bg.png';
import { Link } from 'react-router-dom';
import FoodCard from '../components/FoodCard';
import { foodItems } from '../data/foodItems';

const HomeScreen = ({ user, onLogout, onCartUpdate, cart, onUpdateCart }) => {
  const [totalItems, setTotalItems] = useState(0);

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

  // Calculate total items whenever cart changes
  useEffect(() => {
    const total = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(total);
    // Update parent component with cart count
    if (onCartUpdate) {
      onCartUpdate(total);
    }
  }, [cart, onCartUpdate]);

  const addToCart = (foodId, hasExtra = false) => {
    const key = `${foodId}${hasExtra ? '_extra' : ''}`;
    const newCart = {
      ...cart,
      [key]: {
        foodId,
        hasExtra,
        quantity: (cart[key]?.quantity || 0) + 1
      }
    };
    onUpdateCart(newCart);
  };

  const removeFromCart = (foodId) => {
    const newCart = { ...cart };
    
    // Remove both regular and extra versions
    const regularKey = `${foodId}`;
    const extraKey = `${foodId}_extra`;
    
    if (newCart[regularKey]) {
      newCart[regularKey].quantity -= 1;
      if (newCart[regularKey].quantity <= 0) {
        delete newCart[regularKey];
      }
    }
    
    if (newCart[extraKey]) {
      newCart[extraKey].quantity -= 1;
      if (newCart[extraKey].quantity <= 0) {
        delete newCart[extraKey];
      }
    }
    
    onUpdateCart(newCart);
  };

  const getCartQuantity = (foodId, hasExtra = false) => {
    const key = `${foodId}${hasExtra ? '_extra' : ''}`;
    return cart[key]?.quantity || 0;
  };

  return (
    <div className="home-container">
      <div className="container">


        <div className="food-section">
          <div className="food-grid">
            {foodItems.map((foodItem) => (
              <FoodCard
                key={foodItem.id}
                foodItem={foodItem}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                cartQuantity={getCartQuantity(foodItem.id)}
              />
            ))}
          </div>
        </div>

        <div className="disclaimer">
          <p>Please note: Food images are for reference purposes only. Actual items may vary in appearance, size, and presentation. All prices are subject to availability and may change without prior notice.</p>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
