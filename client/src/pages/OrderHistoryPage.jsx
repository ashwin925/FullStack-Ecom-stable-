import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('/api/orders', { 
          withCredentials: true 
        });
        setOrders(data);
      } catch (err) {
        toast.error('Failed to load orders');
        console.error('Order history error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchOrders();
  }, [user]);

  if (loading) return <div className="loading">Loading order history...</div>;

  return (
    <div className="order-history">
      <ToastContainer />
      <h1>Your Orders</h1>
      
      {orders.length > 0 ? (
        <div className="orders-container">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span>Order #{order.id.slice(0, 8)}</span>
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="order-products">
                {order.products.map(item => (
                  <div key={item.productId} className="product-item">
                    <h3>{item.product?.name || 'Product'}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.product?.price?.toFixed(2) || '0.00'}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-orders">No orders found</p>
      )}
    </div>
  );
};

export default OrderHistoryPage;