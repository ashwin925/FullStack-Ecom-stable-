// client/src/components/Rating.jsx
import React from 'react';
import { FaStar } from 'react-icons/fa';

const Rating = ({ rating, onRate, readOnly = false }) => {
  return (
    <div className="rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          color={star <= rating ? '#ffc107' : '#e4e5e9'}
          onClick={() => !readOnly && onRate && onRate(star)}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        />
      ))}
    </div>
  );
};

export default Rating;