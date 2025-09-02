import React, { useState } from 'react';
import './FoodCard.css';

const FoodCard = ({ foodItem, onAddToCart, onRemoveFromCart, cartQuantity = 0 }) => {
  const [showExtraOption, setShowExtraOption] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(foodItem.id, showExtraOption);
  };

  const handleRemoveFromCart = () => {
    onRemoveFromCart(foodItem.id);
  };

  const handleIncrement = () => {
    onAddToCart(foodItem.id, showExtraOption);
  };

  const handleDecrement = () => {
    onRemoveFromCart(foodItem.id);
  };

  return (
    <div className="food-card">
      <div className="food-image-container">
        <img src={foodItem.image} alt={foodItem.name} className="food-image" />
      </div>
      
      <div className="food-info">
        <h3 className="food-name">{foodItem.name}</h3>
        <p className="food-price">₹{foodItem.price}</p>
        
        {foodItem.hasExtraOption && (
          <div className="extra-option">
            <label className="extra-option-label">
              <input
                type="checkbox"
                checked={showExtraOption}
                onChange={(e) => setShowExtraOption(e.target.checked)}
              />
              {foodItem.extraOption}
            </label>
          </div>
        )}
        
        <div className="cart-controls">
          {cartQuantity === 0 ? (
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          ) : (
            <div className="quantity-controls">
              <button className="quantity-btn minus" onClick={handleDecrement}>
                -
              </button>
              <span className="quantity">{cartQuantity}</span>
              <button className="quantity-btn plus" onClick={handleIncrement}>
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
