import React, { useState, useCallback } from 'react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onClear: () => void;
  placeholder?: string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({ 
  onSearch, 
  onClear, 
  placeholder = "Search products..." 
}) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      onClear();
      return;
    }

    setIsSearching(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
      onSearch(searchQuery.trim());
    } finally {
      setIsSearching(false);
    }
  }, [onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="product-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="search-input"
          />
          {isSearching && <div className="search-spinner">⟳</div>}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-btn"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
    </div>
  );
};

export default ProductSearch;
