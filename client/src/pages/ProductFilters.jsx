// client/src/pages/ProductFilters.jsx
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    category: searchParams.get('category') || ''
  });

  const handleApplyFilters = () => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.category) params.category = filters.category;
    setSearchParams(params);
  };

  const handleReset = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      category: ''
    });
    setSearchParams({});
  };

  return (
    <div className="product-filters">
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
        />
      </div>

      <div className="filter-group">
        <input
          type="number"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
        />
        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
        />
      </div>

      <div className="filter-group">
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
          {/* Add more categories as needed */}
        </select>
      </div>

      <button onClick={handleApplyFilters}>Apply Filters</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default ProductFilters;