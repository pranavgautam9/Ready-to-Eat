import React, { useState, useEffect } from 'react';
import './ConfigureMenu.css';
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

import config from '../config';

// Map images by food item name (works in both dev and production)
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
  };
  
  return imageMap[name] || null;
};

// Helper function to get image source from item
const getImageSrc = (item) => {
  // If it's a full URL, use it directly
  if (item.image_path && item.image_path.startsWith('http')) {
    return item.image_path;
  }
  
  // If it's a public assets path (like /assets/filename.jpg), use it
  if (item.image_path && item.image_path.startsWith('/assets/')) {
    return item.image_path;
  }
  
  // Otherwise, try to get image by name
  const imageByName = getImageByName(item.name);
  if (imageByName) {
    return imageByName;
  }
  
  // Fallback: try to use image_path if it exists
  return item.image_path || null;
};

const ConfigureMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    image_path: ''
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.API_BASE_URL}/api/admin/menu`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data.menu_items);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch menu items');
      }
    } catch (err) {
      setError('Network error while fetching menu items');
    } finally {
      setLoading(false);
    }
  };

  const updateItemPrice = async (itemId, newPrice) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/menu/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ price: newPrice })
      });
      
      if (response.ok) {
        await fetchMenuItems();
        setEditingItem(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update item price');
      }
    } catch (err) {
      setError('Network error while updating item price');
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/menu/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        await fetchMenuItems();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete item');
      }
    } catch (err) {
      setError('Network error while deleting item');
    }
  };

  const addNewItem = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/menu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: newItem.name,
          price: parseFloat(newItem.price),
          image_path: newItem.image_path,
          has_extra_option: false
        })
      });
      
      if (response.ok) {
        await fetchMenuItems();
        setNewItem({ name: '', price: '', image_path: '' });
        setShowAddForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add new item');
      }
    } catch (err) {
      setError('Network error while adding new item');
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleEditPrice = (item) => {
    setEditingItem({ ...item, newPrice: item.price });
  };

  const handleSavePrice = () => {
    if (editingItem && editingItem.newPrice >= 0) {
      updateItemPrice(editingItem.id, editingItem.newPrice);
    }
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.price) {
      addNewItem();
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${config.API_BASE_URL}/api/admin/upload-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setNewItem({ ...newItem, image_path: data.image_path });
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('Network error while uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="configure-menu-container">
      <div className="container">
        <div className="menu-section">
          <div className="menu-header">
            <h2>Configure Menu</h2>
            <div className="header-actions">
              <button 
                className="add-item-btn" 
                onClick={() => setShowAddForm(!showAddForm)}
              >
                ➕ Add Item
              </button>
            </div>
          </div>

          {loading && (
            <div className="loading-message">
              <p>Loading menu items...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <button onClick={fetchMenuItems}>Try Again</button>
            </div>
          )}

          {showAddForm && (
            <div className="add-item-form">
              <h3>Add New Menu Item</h3>
              <div className="form-group">
                <label>Item Name:</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>
              <div className="form-group">
                <label>Price (₹):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="Enter price"
                />
              </div>
              <div className="form-group">
                <label>Image:</label>
                <div className="image-upload-section">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="upload-btn">
                    {uploadingImage ? 'Uploading...' : 'Choose Image'}
                  </label>
                  {newItem.image_path && (
                    <div className="image-preview">
                      <img 
                        src={newItem.image_path.startsWith('http') || newItem.image_path.startsWith('/assets/') ? newItem.image_path : (getImageByName(newItem.name) || newItem.image_path)} 
                        alt="Preview" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <button 
                        type="button"
                        className="remove-image-btn"
                        onClick={() => setNewItem({ ...newItem, image_path: '' })}
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-actions">
                <button className="save-btn" onClick={handleAddItem}>
                  Save
                </button>
                <button className="cancel-btn" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!loading && !error && menuItems.length === 0 && (
            <div className="no-items-message">
              <p>No menu items found. Add some items to get started!</p>
            </div>
          )}

          {!loading && !error && menuItems.length > 0 && (
            <div className="menu-items-grid">
              {menuItems.map((item) => (
                <div key={item.id} className="menu-item-card">
                  <div className="item-image">
                    {(() => {
                      const imageSrc = getImageSrc(item);
                      return imageSrc ? (
                        <img 
                          src={imageSrc} 
                          alt={item.name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null;
                    })()}
                    <div className="no-image" style={{ display: getImageSrc(item) ? 'none' : 'flex' }}>
                      📷
                    </div>
                  </div>
                  
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <div className="item-price">
                      {editingItem && editingItem.id === item.id ? (
                        <div className="edit-price">
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingItem.newPrice}
                            onChange={(e) => setEditingItem({ 
                              ...editingItem, 
                              newPrice: parseFloat(e.target.value) 
                            })}
                          />
                          <div className="edit-actions">
                            <button className="save-btn" onClick={handleSavePrice}>
                              ✓
                            </button>
                            <button className="cancel-btn" onClick={handleCancelEdit}>
                              ✕
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span>₹{item.price}</span>
                      )}
                    </div>
                    
                    <div className="item-options">
                      {item.has_extra_option && (
                        <span className="extra-option">Extra Options Available</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="item-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditPrice(item)}
                      disabled={editingItem && editingItem.id === item.id}
                    >
                      ✏️ Edit Price
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteItem(item.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfigureMenu;
