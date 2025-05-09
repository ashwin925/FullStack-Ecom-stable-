// client/src/components/SellerAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import { 
  BarElement, CategoryScale, Chart as ChartJS,
  Legend, LinearScale, LineElement, PointElement,
  Title, Tooltip, ArcElement
} from 'chart.js';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { io } from 'socket.io-client';
import 'chartjs-adapter-date-fns';
import './sellerAnalytics.css';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, ArcElement,
  Title, Tooltip, Legend
);

const SellerAnalytics = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`/api/orders/seller/${user.id}?range=${timeRange}`);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const socket = io('http://localhost:5000');
    socket.on('order_created', (newOrder) => {
      if (newOrder.products.some(p => p.sellerId === user.id)) {
        setOrders(prev => [newOrder, ...prev]);
      }
    });

    return () => socket.disconnect();
  }, [user.id, timeRange]);

  const processChartData = () => {
    const productSales = {};
    const salesOverTime = {};
    const customerData = {};
    const ratingDistribution = [0, 0, 0, 0, 0]; // For 1-5 stars

    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      
      if (!customerData[order.buyer]) {
        customerData[order.buyer] = { count: 0, total: 0 };
      }
      
      order.products.forEach(product => {
        if (product.sellerId === user.id) {
          // Product sales data
          if (!productSales[product.productId]) {
            productSales[product.productId] = {
              name: product.name,
              quantity: 0,
              revenue: 0,
              ratings: []
            };
          }
          productSales[product.productId].quantity += product.quantity;
          productSales[product.productId].revenue += product.price * product.quantity;

          // Generate random ratings for demo (frontend only)
          const randomRating = Math.floor(Math.random() * 5) + 1;
          ratingDistribution[randomRating - 1]++;
          productSales[product.productId].ratings.push(randomRating);

          // Sales over time data
          if (!salesOverTime[date]) {
            salesOverTime[date] = 0;
          }
          salesOverTime[date] += product.price * product.quantity;

          // Customer data
          customerData[order.buyer].count++;
          customerData[order.buyer].total += product.price * product.quantity;
        }
      });
    });

    return { productSales, salesOverTime, customerData, ratingDistribution };
  };

  const { productSales, salesOverTime, customerData, ratingDistribution } = processChartData();

  if (loading) return (
    <motion.div 
      className="loading-spinner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="spinner"></div>
      <p>Loading analytics...</p>
    </motion.div>
  );

  return (
    <motion.div 
      className="seller-analytics"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="analytics-header">
        <h2>Sales Analytics</h2>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="time-range-selector"
        >
          <option value="day">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="chart-grid">
        <motion.div 
          className="chart-container"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3>Revenue Over Time</h3>
          <Chart
            type="line"
            data={{
              labels: Object.keys(salesOverTime),
              datasets: [{
                label: 'Revenue ($)',
                data: Object.values(salesOverTime),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' }
              }
            }}
          />
        </motion.div>

        <motion.div 
          className="chart-container"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3>Top Selling Products</h3>
          <Chart
            type="bar"
            data={{
              labels: Object.values(productSales).map(p => p.name),
              datasets: [{
                label: 'Units Sold',
                data: Object.values(productSales).map(p => p.quantity),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' }
              }
            }}
          />
        </motion.div>

        <motion.div 
          className="chart-container"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3>Product Ratings</h3>
          <Chart
            type="bar"
            data={{
              labels: ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'],
              datasets: [{
                label: 'Rating Count',
                data: ratingDistribution,
                backgroundColor: 'rgba(255, 206, 86, 0.7)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
              }]
            }}
            options={{
              responsive: true,
              scales: { y: { beginAtZero: true } }
            }}
          />
        </motion.div>

        <motion.div 
          className="chart-container"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3>Customer Orders</h3>
          <Chart
            type="bar"
            data={{
              labels: Object.keys(customerData).map(id => `Customer ${id.slice(0, 4)}`),
              datasets: [{
                label: 'Number of Orders',
                data: Object.values(customerData).map(c => c.count),
                backgroundColor: 'rgba(255, 159, 64, 0.7)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' }
              }
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SellerAnalytics;