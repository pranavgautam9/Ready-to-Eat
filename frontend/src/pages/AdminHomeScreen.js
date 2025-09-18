import React, { useState, useEffect } from 'react';
import config from '../config';
import './AdminHomeScreen.css';

const AdminHomeScreen = ({ admin, onLogout }) => {
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('${config.API_BASE_URL}/api/admin/orders', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError('Network error while fetching orders');
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        // Refresh orders after successful update
        await fetchOrders();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update order status');
      }
    } catch (err) {
      setError('Network error while updating order status');
      console.error('Update order status error:', err);
    }
  };

  useEffect(() => {
    fetchOrders();
    
    // Refresh orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      current: { text: 'Current', class: 'status-current' },
      ready: { text: 'Ready', class: 'status-ready' },
      completed: { text: 'Completed', class: 'status-completed' }
    };
    
    const config = statusConfig[status] || { text: status, class: 'status-unknown' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const getStatusButtons = (order) => {
    if (order.status === 'current') {
      return (
        <button 
          className="status-btn ready-btn"
          onClick={() => updateOrderStatus(order.id, 'ready')}
        >
          Mark as Ready
        </button>
      );
    } else if (order.status === 'ready') {
      return (
        <button 
          className="status-btn completed-btn"
          onClick={() => updateOrderStatus(order.id, 'completed')}
        >
          Picked up
        </button>
      );
    } else {
      return <span className="no-action">No action available</span>;
    }
  };

  return (
    <div className="admin-home-container">
      <div className="container">

        <div className="orders-section">
          <div className="orders-header">
            <h2>Active Orders</h2>
            <button className="refresh-btn" onClick={fetchOrders}>
              🔄 Refresh
            </button>
          </div>

          {loading && (
            <div className="loading-message">
              <p>Loading orders...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>Error: {error}</p>
              <button onClick={fetchOrders}>Try Again</button>
            </div>
          )}

          {!loading && !error && orders.length === 0 && (
            <div className="no-orders-message">
              <p>At this time, there are no active orders requiring attention.</p>
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

                  <div className="order-actions">
                    {getStatusButtons(order)}
                  </div>

                  {order.completed_time && (
                    <div className="completed-time">
                      <p>Completed at: {formatTime(order.completed_time)}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminHomeScreen;
