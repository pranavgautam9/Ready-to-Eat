import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { foodItems } from '../data/foodItems';
import './Cart.css';

const Cart = ({ cart, onUpdateCart }) => {
  const [estimatedTime, setEstimatedTime] = useState(15);
  const [isCheckoutDisabled, setIsCheckoutDisabled] = useState(false);
  const navigate = useNavigate();

  // Calculate estimated time based on current time
  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

    let time = 15; // default

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

    // Check if checkout should be disabled
    const isWeekend = currentDay === 0 || currentDay === 6; // Sunday or Saturday
    const isOffHours = (currentHour >= 18 || currentHour < 8) && !isWeekend;
    
    setIsCheckoutDisabled(isWeekend || isOffHours);
  }, []);

  // Calculate cart totals
  const calculateTotals = () => {
    let subtotal = 0;
    const cartItems = [];

    Object.entries(cart).forEach(([key, item]) => {
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
    });

    const tax = subtotal * 0.15; // 15% tax
    const total = subtotal + tax;
    const points = Math.floor(subtotal / 10); // 1 point for every ₹10 spent (excluding tax)

    return { cartItems, subtotal, tax, total, points };
  };

  const { cartItems, subtotal, tax, total, points } = calculateTotals();

  const updateQuantity = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      // Remove item from cart
      const newCart = { ...cart };
      delete newCart[`${foodId}`];
      delete newCart[`${foodId}_extra`];
      onUpdateCart(newCart);
    } else {
      // Update quantity
      const newCart = { ...cart };
      const key = `${foodId}`;
      if (newCart[key]) {
        newCart[key].quantity = newQuantity;
        onUpdateCart(newCart);
      }
    }
  };

  const removeItem = (foodId) => {
    const newCart = { ...cart };
    delete newCart[`${foodId}`];
    delete newCart[`${foodId}_extra`];
    onUpdateCart(newCart);
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
            <div key={item.id} className="cart-item">
              <div className="item-info">
                <h3 className="item-name">{item.name}</h3>
                <div className="item-controls">
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
                  <button 
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="item-price">₹{item.total}</div>
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
