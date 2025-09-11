import React, { useState, useEffect } from 'react';
import { foodItems } from '../data/foodItems';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

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
        console.log('🔍 Fetching orders from API...');
        const response = await fetch('http://localhost:5000/api/orders', {
          method: 'GET',
          credentials: 'include', // Include cookies for session
          headers: {
            'Content-Type': 'application/json',
          },
        });

        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('📦 Orders data received:', data);
          
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
            status: order.status === 'completed' ? 'past' : order.status
          }));
          
          console.log('✨ Formatted orders:', formattedOrders);
          setOrders(formattedOrders);
        } else {
          const errorText = await response.text();
          console.error('❌ Failed to fetch orders:', response.status, errorText);
          setOrders([]);
        }
      } catch (error) {
        console.error('💥 Error fetching orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
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

    // If order is ready or time has passed, show ready message
    if (order.status === 'ready' || remainingMinutes <= 0) {
      return 'Your order is ready!';
    }
    
    // Calculate ready time
    const readyTime = new Date(orderTime.getTime() + (order.estimatedTime * 60000));
    return `Your order will be ready at - ${readyTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })}`;
  };

  // Get food item details
  const getFoodItem = (foodId) => {
    return foodItems.find(item => item.id === foodId);
  };

  // Separate current and past orders
  const currentOrders = orders.filter(order => order.status === 'current' || order.status === 'ready');
  const pastOrders = orders.filter(order => order.status === 'past' || order.status === 'completed');

  // Update order status when time expires
  useEffect(() => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.status === 'current') {
          const now = currentTime;
          const orderTime = new Date(order.orderTime);
          const elapsedMinutes = Math.floor((now - orderTime) / 60000);
          
          // Change to ready when estimated time is reached
          if (elapsedMinutes >= order.estimatedTime) {
            return { ...order, status: 'ready' };
          }
          
          // Move to past orders after estimated time + 1 hour
          if (elapsedMinutes >= order.estimatedTime + 60) {
            return { ...order, status: 'past' };
          }
        }
        
        if (order.status === 'ready') {
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

  if (loading) {
    return (
      <div className="orders-container">
        <div className="orders-content">
          <div style={{color: 'white', textAlign: 'center', fontSize: '20px'}}>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-content">
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
                        Ordered on {order.orderTime.toLocaleDateString()} at {order.orderTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.status === 'ready' ? 'ready' : 'current'}`}>
                        {calculateRemainingTime(order)}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    <div className="items-list">
                      {order.items.map((item, index) => {
                        const foodItem = getFoodItem(item.foodId);
                        return (
                          <div key={index} className="order-item">
                            <span className="item-name">{foodItem?.name || 'Unknown Item'}</span>
                            <span className="item-quantity">Qty: {item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="order-points">
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
                        Ordered on {order.orderTime.toLocaleDateString()} at {order.orderTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <div className="order-status">
                      <span className="status-badge completed">Completed</span>
                    </div>
                  </div>

                  <div className="order-items">
                    <div className="items-list">
                      {order.items.map((item, index) => {
                        const foodItem = getFoodItem(item.foodId);
                        return (
                          <div key={index} className="order-item">
                            <span className="item-name">{foodItem?.name || 'Unknown Item'}</span>
                            <span className="item-quantity">Qty: {item.quantity}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="order-points">
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