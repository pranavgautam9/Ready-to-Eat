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

// Image mapping for database paths to imported images
const imageMap = {
  '/src/assets/Samosa.jpg': Samosa,
  '/src/assets/Kachori.jpg': Kachori,
  '/src/assets/Aloo Parantha.jpg': AlooParantha,
  '/src/assets/Pav Bhaji.jpg': PavBhaji,
  '/src/assets/Chole Bhature.jpg': CholeBhature,
  '/src/assets/Veg Burger.jpg': VegBurger,
  '/src/assets/Hakka Noodles.jpg': HakkaNoodles,
  '/src/assets/Manchurian.jpg': Manchurian,
  '/src/assets/Tea.JPG': Tea,
  '/src/assets/Cold Coffee.jpg': ColdCoffee,
  '/src/assets/Lays.jpg': Lays,
  '/src/assets/Kurkure.jpg': Kurkure,
  '/src/assets/Coca Cola.jpg': CocaCola,
  '/src/assets/Frooti.jpg': Frooti,
};

const FoodCard = ({ foodItem, onAddToCart, onRemoveFromCart, cartQuantity = 0 }) => {
  const [showExtraOption, setShowExtraOption] = useState(false);

  // Handle image path - use image_path from database or fallback to image
  const getImageSrc = () => {
    if (foodItem.image_path) {
      // If it's a full URL, use it directly
      if (foodItem.image_path.startsWith('http')) {
        return foodItem.image_path;
      }
      // If it's a database path, map it to imported image
      if (imageMap[foodItem.image_path]) {
        return imageMap[foodItem.image_path];
      }
      // If it's a local path, use it directly
      return foodItem.image_path;
    }
    // Fallback to the old image property
    return foodItem.image;
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
