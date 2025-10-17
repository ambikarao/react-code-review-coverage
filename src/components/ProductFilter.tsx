import React, { useState, useCallback, useMemo } from 'react';
import { Product } from '../models/types';

interface ProductFilterProps {
  products: Product[];
  onFilteredProducts: (filteredProducts: Product[]) => void;
}

interface FilterOptions {
  priceRange: [number, number];
  category: string;
  sortBy: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}

const ProductFilter: React.FC<ProductFilterProps> = ({ products, onFilteredProducts }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 1000],
    category: 'all',
    sortBy: 'name-asc'
  });

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = products.reduce((acc, product) => {
      // Extract category from product title (simple categorization)
      const category = product.title.split(' ')[0].toLowerCase();
      acc.add(category);
      return acc;
    }, new Set<string>());
    
    return ['all', ...Array.from(cats)];
  }, [products]);

  // Get price range for slider
  const priceRange = useMemo(() => {
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

  const applyFilters = useCallback((newFilters: FilterOptions) => {
    let filtered = [...products];

    // Filter by category
    if (newFilters.category !== 'all') {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(newFilters.category)
      );
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= newFilters.priceRange[0] && 
      product.price <= newFilters.priceRange[1]
    );

    // Sort products
    filtered.sort((a, b) => {
      switch (newFilters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    onFilteredProducts(filtered);
  }, [products, onFilteredProducts]);

  const handleFilterChange = (field: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [priceRange.min, priceRange.max],
      category: 'all',
      sortBy: 'name-asc'
    };
    setFilters(defaultFilters);
    applyFilters(defaultFilters);
  };

  return (
    <div className="product-filter">
      <div className="filter-section">
        <h3>Filters</h3>
        
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</label>
          <div className="price-range">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={filters.priceRange[0]}
              onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
              className="price-slider"
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              value={filters.priceRange[1]}
              onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
              className="price-slider"
            />
          </div>
        </div>

        <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>

        <button onClick={resetFilters} className="reset-filters-btn">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
