// client/src/pages/OrderHistoryPage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders');
        setOrders(data);
      } catch (error) {
        console.error('Order history error:', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="order-history">
      <ToastContainer />
      <h1>Your Order History</h1>
      
      {orders.length > 0 ? (
        <div className="orders-container">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span>Order #{order.id.slice(0, 8)}</span>
                <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="order-products">
                {order.products.map((product, index) => (
                  <div key={`${product.productId}-${index}`} className="product-item">
                    <h3>{product.name}</h3>
                    <p>Price: ${product.price.toFixed(2)}</p>
                    <p>Quantity: {product.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't placed any orders yet</p>
      )}
    </div>
  );
};

export default OrderHistoryPage;