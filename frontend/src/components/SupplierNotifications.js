import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useOrder } from '../Context/OrderContext';
import './SupplierNotifications.css'; // ✅ Import CSS
import { Navigate, useNavigate } from 'react-router-dom';
const SupplierNotifications = () => {
    const navigate=useNavigate()
  const { orderDetails, setOrderDetails } = useOrder();
  const [supplierPrices, setSupplierPrices] = useState({});

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/notificationOrders/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        setOrderDetails(response.data.orders);
       
      } catch (error) {
        console.log('Error fetching orders:', error);
      }
    };

    getOrders();
  }, []);

  const handlePriceChange = (orderId, itemId, value) => {
    setSupplierPrices((prev) => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [itemId]: parseFloat(value) || 0,
      },
    }));
  };

  const calculateOrderTotal = (orderId) => {
    const order = supplierPrices[orderId];
    if (!order) return 0;
    return Object.values(order).reduce((sum, val) => sum + val, 0).toFixed(2);
  };

  const handleSubmitPrices = (orderId) => {
   
    console.log('order_id: ',orderDetails)
    const prices = supplierPrices[orderId];
    if (!prices) return alert('Please enter prices before submitting.');
    alert(`Prices for Order ${orderId} submitted successfully!`);
    navigate('/Buyer-notification')
  };

  return (
    <div className="notifications-container">
      <h2 className="notifications-title">📦 Supplier Notifications</h2>
      {Array.isArray(orderDetails) && orderDetails.length > 0 ? (
        orderDetails.map((order, index) => (
          <div key={index} className="order-card">
            <h3 className="order-header">🛒 Order #{order.order_id}</h3>
            <p><strong>Buyer:</strong> {order.buyer_username} (ID: {order.buyer_id})</p>
            <p><strong>Status:</strong> {order.order_status}</p>
            <p><strong>Sent At:</strong> {new Date(order.sent_at).toLocaleString()}</p>

            <h4 style={{ marginTop: '1rem' }}>Items</h4>
            <ul className="item-list">
              {order.items.map((item, idx) => (
                <li key={idx} className="item-card">
                  <p><strong>Item:</strong> {item.item_name}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Original Total Price:</strong> £{item.item_total_price}</p>
                  <div className="price-input-wrapper">
                    <label><strong>Your Price:</strong></label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Enter your price"
                      value={
                        supplierPrices[order.order_id]?.[item.order_item_id] || ''
                      }
                      onChange={(e) =>
                        handlePriceChange(order.order_id, item.order_item_id, e.target.value)
                      }
                      className="price-input"
                    />
                  </div>
                </li>
              ))}
            </ul>

            <p className="total-price">💰 Total Your Price: £{calculateOrderTotal(order.order_id)}</p>
            <button
              onClick={() => handleSubmitPrices(order.order_id)}
              className="submit-button"
            >
              Submit Prices
            </button>
          </div>
        ))
      ) : (
        <p>No orders yet.</p>
      )}
    </div>
  );
};

export default SupplierNotifications;
