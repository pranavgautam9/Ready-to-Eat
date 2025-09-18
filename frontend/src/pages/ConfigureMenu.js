import React, { useState, useEffect } from 'react';
import './ConfigureMenu.css';

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

import config from '../config';
// Map image paths to imported images
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
      const response = await fetch('${config.API_BASE_URL}/api/admin/menu', {
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
      console.error('Fetch menu items error:', err);
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
      console.error('Update item price error:', err);
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
      console.error('Delete item error:', err);
    }
  };

  const addNewItem = async () => {
    try {
      const response = await fetch('${config.API_BASE_URL}/api/admin/menu', {
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
      console.error('Add new item error:', err);
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('${config.API_BASE_URL}/api/admin/upload-image', {
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
      console.error('Upload image error:', err);
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
                        src={newItem.image_path.startsWith('http') ? newItem.image_path : (imageMap[newItem.image_path] || newItem.image_path)} 
                        alt="Preview" 
                        onError={(e) => {
                          console.log('Preview image error:', newItem.image_path);
                          console.log('Trying to load from:', e.target.src);
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
                    {item.image_path ? (
                      <img 
                        src={item.image_path.startsWith('http') ? item.image_path : (imageMap[item.image_path] || item.image_path)} 
                        alt={item.name}
                        onError={(e) => {
                          console.log('Image load error for:', item.name, 'path:', item.image_path);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="no-image" style={{ display: item.image_path ? 'none' : 'flex' }}>
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
