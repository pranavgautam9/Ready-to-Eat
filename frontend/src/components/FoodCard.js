import React, { useState } from 'react';
import './FoodCard.css';

// Import all food images
import Samosa from '../assets/Samosa.jpg';
import Kachori from '../assets/Kachori.jpg';
import AlooParantha from '../assets/Aloo Parantha.jpg';
import PavBhaji from '../assets/Pav Bhaji.jpg';
import CholeBhature from '../assets/Chole Bhature.jpg';
import VegBurger from '../assets/Veg Burger.jpg';
import HakkaNoodles from '../assets/Hakka Noodles.jpg';
import Manchurian from '../assets/Manchurian.jpg';
import Tea from '../assets/Tea.JPG';
import ColdCoffee from '../assets/Cold Coffee.jpg';
import Lays from '../assets/Lays.jpg';
import Kurkure from '../assets/Kurkure.jpg';
import CocaCola from '../assets/Coca Cola.jpg';
import Frooti from '../assets/Frooti.jpg';

// Image mapping based on food item names
const getImageByName = (name) => {
  const imageMap = {
    'Samosa': Samosa,
    'Kachori': Kachori,
    'Aloo Parantha': AlooParantha,
    'Pav Bhaji': PavBhaji,
    'Chole Bhature': CholeBhature,
    'Veg Burger': VegBurger,
    'Hakka Noodles': HakkaNoodles,
    'Manchurian': Manchurian,
    'Cup of Tea': Tea,
    'Cold Coffee': ColdCoffee,
    'Lays Chips': Lays,
    'Kurkure': Kurkure,
    'Coca Cola': CocaCola,
    'Frooti': Frooti,
    // Reward items
    'Samosa (Reward)': Samosa,
    'Kachori (Reward)': Kachori,
    'Veg Burger (Reward)': VegBurger,
    'Hakka Noodles (Reward)': HakkaNoodles,
    'Pav Bhaji + Lays + Coca Cola (Reward)': PavBhaji,
    'Chole Bhature + Kurkure + Frooti (Reward)': CholeBhature,
  };
  
  return imageMap[name] || Samosa; // Default fallback
};

const FoodCard = ({ foodItem, onAddToCart, onRemoveFromCart, cartQuantity = 0 }) => {
  const [showExtraOption, setShowExtraOption] = useState(false);

  // Handle image path - use food item name to get the correct imported image
  const getImageSrc = () => {
    // Use the food item name to get the correct imported image
    return getImageByName(foodItem.name);
  };

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
        <img src={getImageSrc()} alt={foodItem.name} className="food-image" />
      </div>
      
      <div className="food-info">
        <h3 className="food-name">{foodItem.name}</h3>
        <p className="food-price">₹{foodItem.price}</p>
        
        {foodItem.has_extra_option && (
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
