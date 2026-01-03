import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFoodItems from '../hooks/useFoodItems';
import config from '../config';
import './Cart.css';

const Cart = ({ cart, onUpdateCart, onCartUpdate }) => {
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);
  const navigate = useNavigate();
  const { foodItems, loading } = useFoodItems();

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();

    let time = 15;

    if (currentHour >= 8 && currentHour < 10) {
      time = 15;
    } else if (currentHour >= 10 && currentHour < 12) {
      time = 30;
    } else if (currentHour >= 12 && currentHour < 15) {
      time = 45;
    } else if (currentHour >= 15 && currentHour < 17) {
      time = 20;
    } else if (currentHour >= 17 && currentHour < 18) {
      time = 10;
    }

    setEstimatedTime(time);
    const isWeekend = currentDay === 0 || currentDay === 6;
    const isOffHours = (currentHour >= 18 || currentHour < 8) && !isWeekend;
    
    setIsCheckoutDisabled(isWeekend || isOffHours);
  }, []);

  const calculateTotals = () => {
    let subtotal = 0;
    const cartItems = [];

    Object.entries(cart).forEach(([key, item]) => {
      if (item.isReward) {
        cartItems.push({
          ...item,
          total: 0,
          isReward: true,
          id: item.foodId
        });
      } else {
        const foodItem = foodItems.find(f => f.id === item.foodId);
        if (foodItem) {
          const itemTotal = foodItem.price * item.quantity;
          subtotal += itemTotal;
          cartItems.push({
            ...foodItem,
            quantity: item.quantity,
            total: itemTotal,
            hasExtra: item.hasExtra
          });
        }
      }
    });

    const tax = subtotal * 0.15;
    const total = Math.floor(subtotal + tax);
    const points = Math.floor(subtotal / 10);

    return { cartItems, subtotal, tax, total, points };
  };

  const { cartItems, subtotal, tax, total, points } = calculateTotals();

  const updateQuantity = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      const newCart = { ...cart };
      delete newCart[`${foodId}`];
      delete newCart[`${foodId}_extra`];
      onUpdateCart(newCart);
    } else {
      const newCart = { ...cart };
      const key = `${foodId}`;
      if (newCart[key]) {
        newCart[key].quantity = newQuantity;
        onUpdateCart(newCart);
      }
    }
  };

  const removeItem = async (foodId, isReward = false) => {
    const newCart = { ...cart };
    if (isReward) {
      Object.keys(cart).forEach(key => {
        if (cart[key].foodId === foodId && cart[key].isReward) {
          if (cart[key].rewardPoints) {
            restorePoints(cart[key].rewardPoints);
          }
          delete newCart[key];
        }
      });
    } else {
      delete newCart[`${foodId}`];
      delete newCart[`${foodId}_extra`];
    }
    onUpdateCart(newCart);
  };

  const restorePoints = async (pointsToRestore) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/user/points`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        const currentPoints = data.points || 0;
        const newPoints = currentPoints + pointsToRestore;
        await fetch('${config.API_BASE_URL}/api/user/points', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ points: newPoints })
        });

      }
    } catch (error) {
    }
  };

  const handleCheckout = () => {
    if (!isCheckoutDisabled) {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-content">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.isReward ? 'reward' : 'regular'}`} className={`cart-item ${item.isReward ? 'reward-item' : ''}`}>
              <div className="item-info">
                <h3 className="item-name">
                  {item.name}
                </h3>
                <div className="item-controls">
                  {!item.isReward ? (
                    <>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">Qty: {item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </>
                  ) : (
                    <span className="quantity">Qty: {item.quantity}</span>
                  )}
                </div>
              </div>
              <div className="item-price-section">
                <div className="item-price">
                  {item.isReward ? 'FREE' : `₹${item.total}`}
                </div>
                <button 
                  className="remove-btn"
                  onClick={() => removeItem(item.id, item.isReward)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="points-info">
          <p>You will be earning <strong>{points} points</strong> on this order</p>
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Taxes (15%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          className={`checkout-btn ${isCheckoutDisabled ? 'disabled' : ''}`}
          onClick={handleCheckout}
          disabled={isCheckoutDisabled}
        >
          {isCheckoutDisabled ? 'Checkout Unavailable' : 'Proceed to Checkout'}
        </button>

        {isCheckoutDisabled && (
          <p className="checkout-disabled-message">
            Checkout is only available Monday-Friday, 8:00 AM - 6:00 PM
          </p>
        )}

        <div className="estimated-time">
          <p>Your order will be ready in: <strong>{estimatedTime} minutes</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
