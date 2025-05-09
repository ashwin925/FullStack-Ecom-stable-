// client/src/pages/Home.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const features = [
    {
      icon: '🚀',
      title: 'Fast Delivery',
      description: 'Get your products delivered in record time'
    },
    {
      icon: '🛡️',
      title: 'Secure Payments',
      description: '100% secure payment processing'
    },
    {
      icon: '🔄',
      title: 'Easy Returns',
      description: 'Hassle-free return policy'
    }
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Welcome to ShopEase</h1>
          <p>The best place to find everything you need at amazing prices</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">
              Shop Now
            </Link>
            <Link to="/register" className="btn-outline">
              Join Now
            </Link>
          </div>
        </motion.div>
        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img src="/hero-image.png" alt="Shopping" />
        </motion.div>
      </section>

      <section className="features-section">
        <h2>Why Choose Us</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Ready to start shopping?</h2>
          <Link to="/products" className="btn-primary btn-lg">
            Browse Products
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;