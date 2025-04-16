import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BuyerProfile = ({username,userRole,userEmail,userPassword}) => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  // Define fetchOrders function outside of useEffect to access it globally
  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/orders/'); // Adjust API URL as necessary
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setMessage('Failed to fetch orders.');
    }
  };

  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);  // Empty dependency array to call fetchOrders only once

  // Handle order confirmation
  const handleConfirmOrder = async (orderId) => {
    try {
      await axios.put(`http://localhost:8000/api/orders/${orderId}/confirm/`);
      setMessage('Order confirmed successfully!');
      // Re-fetch orders after confirming
      fetchOrders();
    } catch (error) {
      console.error('Error confirming order:', error);
      setMessage('Failed to confirm the order.');
    }
  };

  return (
    <div className="profile-page">
      <h2>Buyer Profile: {username}</h2>
      <p>Email: {userEmail}</p>
      <p>password: {userPassword}</p>
      <p>Welcome to your profile page. Here are your current orders:</p>
      
      {message && <p className="error-message">{message}</p>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div>
          <h3>Your Orders</h3>
          <div className="order-list">
            {orders.map((order) => (
              <div key={order.id} className="order-item">
                <h4>Order ID: {order.id}</h4>
                <p>Total Price: £{order.total_price}</p>
                <p>Status: {order.status}</p>

                {/* If the order is confirmed, show supplier details */}
                {order.status === 'confirmed' && (
                  <p>Supplier: {order.supplier.username}</p>
                )}

                {/* If the order is pending, show a button to confirm */}
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleConfirmOrder(order.id)}
                    className="confirm-order-btn"
                  >
                    Confirm Order
                  </button>
                )}

                {/* If the order is confirmed or cancelled, show a message */}
                {order.status === 'confirmed' && (
                  <p>Order confirmed! Delivery Date: {order.delivery_date}</p>
                )}
                {order.status === 'cancelled' && <p>This order was cancelled.</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerProfile;
