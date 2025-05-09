// client/src/components/Rating.jsx (New frontend-only rating component)
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Rating.css';

const Rating = ({ rating = 0, readOnly = false, onRate = () => {} }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (value) => {
    if (!readOnly) {
      onRate(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readOnly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={`rating ${readOnly ? 'read-only' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.span
          key={star}
          className={`star ${star <= displayRating ? 'filled' : ''}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          whileHover={!readOnly ? { scale: 1.2 } : {}}
          whileTap={!readOnly ? { scale: 0.9 } : {}}
        >
          {star <= displayRating ? '★' : '☆'}
        </motion.span>
      ))}
    </div>
  );
};

export default Rating;