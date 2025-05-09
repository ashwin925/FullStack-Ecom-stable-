// client/src/pages/Products.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import ProductFilters from '../components/ProductFilters';
import Rating from '../components/Rating';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          search: searchParams.get('search') || '',
          minPrice: searchParams.get('minPrice') || '',
          maxPrice: searchParams.get('maxPrice') || '',
          category: searchParams.get('category') || ''
        };
        
        const cleanParams = {};
        for (const [paramKey, paramValue] of Object.entries(params)) {
          if (paramValue !== '') {
            cleanParams[paramKey] = paramValue;
          }
        }
    
        const { data } = await axios.get('/api/products', { params: cleanParams });
        setProducts(data);
      } catch (err) {
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  return (
    <div className="products-page">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="page-title"
      >
        Our Products
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ProductFilters />
      </motion.div>

      {loading ? (
        <div className="loading-spinner">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="spinner"
          />
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="products-grid">
          <AnimatePresence>
            {products.length > 0 ? (
              products.map((product) => (
                <motion.div
                  key={product.id}
                  className="product-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                  layout
                >
                  <div className="product-image">
                    <img 
                      src={product.image || '/placeholder-product.jpg'} 
                      alt={product.name}
                    />
                    <div className="product-badge">
                      {product.category || 'General'}
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="product-meta">
                      <Rating 
                        rating={Math.floor(Math.random() * 5) + 1} 
                        readOnly={true} 
                      />
                      <span>({Math.floor(Math.random() * 100)})</span>
                    </div>
                    <p className="product-description">
                      {product.description}
                    </p>
                    <div className="product-footer">
                      <span className="product-price">
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                      </span>
                      <button className="add-to-cart-btn">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="no-products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3>No products found</h3>
                <p>Try adjusting your search filters</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Products;