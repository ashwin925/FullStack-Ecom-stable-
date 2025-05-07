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

          // Collect ratings
          if (product.ratings) {
            product.ratings.forEach(rating => {
              if (rating.rating >= 1 && rating.rating <= 5) {
                ratingDistribution[rating.rating - 1]++;
                productSales[product.productId].ratings.push(rating.rating);
              }
            });
          }

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

  if (loading) return <div className="loading">Loading analytics...</div>;

  return (
    <div className="seller-analytics">
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
        <div className="chart-container">
          <h3>Revenue Over Time</h3>
          <Chart
            type="line"
            data={{
              labels: Object.keys(salesOverTime),
              datasets: [{
                label: 'Revenue ($)',
                data: Object.values(salesOverTime),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' }
              }
            }}
          />
        </div>

        <div className="chart-container">
          <h3>Top Selling Products</h3>
          <Chart
            type="bar"
            data={{
              labels: Object.values(productSales).map(p => p.name),
              datasets: [{
                label: 'Units Sold',
                data: Object.values(productSales).map(p => p.quantity),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' }
              }
            }}
          />
        </div>

        <div className="chart-container">
          <h3>Product Ratings</h3>
          <Chart
            type="bar"
            data={{
              labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
              datasets: [{
                label: 'Rating Count',
                data: ratingDistribution,
                backgroundColor: 'rgba(255, 206, 86, 0.7)'
              }]
            }}
            options={{
              responsive: true,
              scales: { y: { beginAtZero: true } }
            }}
          />
        </div>

        <div className="chart-container">
          <h3>Customer Orders</h3>
          <Chart
            type="bar"
            data={{
              labels: Object.keys(customerData),
              datasets: [{
                label: 'Number of Orders',
                data: Object.values(customerData).map(c => c.count),
                backgroundColor: 'rgba(255, 159, 64, 0.5)'
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SellerAnalytics;