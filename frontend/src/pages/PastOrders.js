import React, { useState, useEffect } from 'react';
import config from '../config';
import './PastOrders.css';

const PastOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const fetchPastOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('${config.API_BASE_URL}/api/admin/orders/past', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch past orders');
      }
    } catch (err) {
      setError('Network error while fetching past orders');
      console.error('Fetch past orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPastOrders();
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { text: 'Completed', class: 'status-completed' }
    };
    
    const config = statusConfig[status] || { text: status, class: 'status-unknown' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  return (
    <div className="past-orders-container">
      <div className="container">
        <div className="orders-section">
          <div className="orders-header">
            <h2>Past Orders</h2>
            <button className="refresh-btn" onClick={fetchPastOrders}>
              🔄 Refresh
            </button>
          </div>

          {loading && (
            <div className="loading-message">
              <p>Loading past orders...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <button onClick={fetchPastOrders}>Try Again</button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="no-orders-message">
              <p>No completed orders found in the system.</p>
            </div>
          )}

          {!loading && !error && orders.length > 0 && (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Order #{order.id}</h3>
                      <p className="customer-info">
                        {order.user_name}
                      </p>
                      <p className="order-time">
                        Ordered: {formatDate(order.order_time)}
                      </p>
                      {order.ready_time && (
                        <p className="ready-time">
                          Ready at: {formatTime(order.ready_time)}
                        </p>
                      )}
                      {order.completed_time && (
                        <p className="completed-time">
                          Completed at: {formatTime(order.completed_time)}
                        </p>
                      )}
                    </div>
                    <div className="order-status">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>Items:</h4>
                    <ul className="items-list">
                      {order.items && order.items.map((item, index) => (
                        <li key={index} className="order-item">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">Qty: {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Total Amount:</span>
                      <span>₹{order.grand_total}</span>
                    </div>
                    <div className="summary-row">
                      <span>Points Earned:</span>
                      <span>{order.points_earned} pts</span>
                    </div>
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

export default PastOrders;
