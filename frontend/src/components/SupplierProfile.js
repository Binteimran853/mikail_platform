import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SupplierProfile = ({ username, userEmail }) => {
  const [orders, setOrders] = useState([]);



  return (
    <div className="profile-page">
      <h2>Supplier Profile: {username}</h2>
      <p>Email: {userEmail}</p>

      {/* Render orders if any */}
      <div>
        <h3>Orders:</h3>
        {orders.length > 0 ? (
          <ul>
            {orders.map(order => (
              <li key={order.order_id}>
                Order ID: {order.order_id}, Product: {order.product_name}
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default SupplierProfile;
