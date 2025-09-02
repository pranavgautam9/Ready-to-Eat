import React, { useState, useEffect } from 'react';
import { foodItems } from '../data/foodItems';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Load orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'GET',
          credentials: 'include', // Include cookies for session
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Convert API data to frontend format
          const formattedOrders = data.orders.map(order => ({
            id: order.id,
            orderNumber: order.order_number,
            items: order.order_items.map(item => ({
              foodId: item.food_id,
              quantity: item.quantity,
              hasExtra: item.has_extra
            })),
            total: order.total_amount,
            tax: order.tax_amount,
            grandTotal: order.grand_total,
            points: order.points_earned,
            orderTime: new Date(order.order_time),
            estimatedTime: order.estimated_time,
            status: order.status === 'completed' ? 'past' : 'current'
          }));
          setOrders(formattedOrders);
        } else {
          console.error('Failed to fetch orders:', response.statusText);
          // Fallback to empty array if API fails
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to empty array if API fails
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  // Calculate remaining time for current orders
  const calculateRemainingTime = (order) => {
    const now = currentTime;
    const orderTime = new Date(order.orderTime);
    const elapsedMinutes = Math.floor((now - orderTime) / 60000);
    const remainingMinutes = order.estimatedTime - elapsedMinutes;

    if (remainingMinutes <= 0) {
      return 'Your order is ready!';
    }
    return `${remainingMinutes} minutes`;
  };

  // Get food item details
  const getFoodItem = (foodId) => {
    return foodItems.find(item => item.id === foodId);
  };

  // Separate current and past orders
  const currentOrders = orders.filter(order => order.status === 'current');
  const pastOrders = orders.filter(order => order.status === 'past');

  // Update order status when time expires
  useEffect(() => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.status === 'current') {
          const now = currentTime;
          const orderTime = new Date(order.orderTime);
          const elapsedMinutes = Math.floor((now - orderTime) / 60000);
          
          // Move to past orders after estimated time + 1 hour
          if (elapsedMinutes >= order.estimatedTime + 60) {
            return { ...order, status: 'past' };
          }
        }
        return order;
      })
    );
  }, [currentTime]);

  return (
    <div className="orders-container">
      <div className="orders-content">
        <h1 className="orders-title">Your Orders</h1>

        {/* Current Orders */}
        {currentOrders.length > 0 && (
          <div className="orders-section">
            <h2 className="section-title">Current Orders</h2>
            <div className="orders-list">
              {currentOrders.map(order => (
                <div key={order.id} className="order-card current">
                  <div className="order-header">
                    <div className="order-info">
                      <h3 className="order-number">{order.orderNumber}</h3>
                      <p className="order-time">
                        Ordered at {order.orderTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <div className="order-status">
                      <span className="status-badge current">
                        {calculateRemainingTime(order)}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>Items Ordered:</h4>
                    <div className="items-list">
                      {order.items.map((item, index) => {
                        const foodItem = getFoodItem(item.foodId);
                        return (
                          <div key={index} className="order-item">
                            <div className="item-details">
                              <span className="item-name">{foodItem?.name}</span>
                              <span className="item-quantity">Qty: {item.quantity}</span>
                            </div>
                            <span className="item-price">
                              ₹{(foodItem?.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{order.total.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax (15%):</span>
                      <span>₹{order.tax.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>₹{order.grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="points-earned">
                      <span>Points Earned: {order.points}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Orders */}
        {pastOrders.length > 0 && (
          <div className="orders-section">
            <h2 className="section-title">Past Orders</h2>
            <div className="orders-list">
              {pastOrders.map(order => (
                <div key={order.id} className="order-card past">
                  <div className="order-header">
                    <div className="order-info">
                      <h3 className="order-number">{order.orderNumber}</h3>
                      <p className="order-time">
                        Ordered at {order.orderTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} on {order.orderTime.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="order-status">
                      <span className="status-badge completed">Completed</span>
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>Items Ordered:</h4>
                    <div className="items-list">
                      {order.items.map((item, index) => {
                        const foodItem = getFoodItem(item.foodId);
                        return (
                          <div key={index} className="order-item">
                            <div className="item-details">
                              <span className="item-name">{foodItem?.name}</span>
                              <span className="item-quantity">Qty: {item.quantity}</span>
                            </div>
                            <span className="item-price">
                              ₹{(foodItem?.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{order.total.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Tax (15%):</span>
                      <span>₹{order.tax.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>₹{order.grandTotal.toFixed(2)}</span>
                    </div>
                    <div className="points-earned">
                      <span>Points Earned: {order.points}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Orders Message */}
        {currentOrders.length === 0 && pastOrders.length === 0 && (
          <div className="no-orders">
            <div className="no-orders-icon">📋</div>
            <h2>No orders yet</h2>
            <p>Your order history will appear here once you place your first order.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
