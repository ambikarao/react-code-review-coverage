import React, { useEffect, useState, useCallback } from "react";
import { fetchProducts } from "../services/productService";
import { Product } from "../models/types";
import { useApp } from "../AppContext";
import { ProductSearch, ProductFilter, ProductDetailModal, LoadingSpinner } from "../components";

const ProductList: React.FC = () => {
  const { addToCart, addToWishlist } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetchProducts().then(p => {
      if (mounted) {
        setProducts(p);
        setFilteredProducts(p);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = useCallback((query: string) => {
    const filtered = products.filter(product =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products]);

  const handleClearSearch = useCallback(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  if (loading) return <LoadingSpinner text="Loading products..." />;

  return (
    <div className="product-list-page">
      <div className="product-controls">
        <ProductSearch 
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search products..."
        />
        <ProductFilter 
          products={products}
          onFilteredProducts={setFilteredProducts}
        />
      </div>
      
      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-products">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img 
                src={product.imageUrl} 
                alt={product.title}
                onClick={() => handleProductClick(product)}
                className="product-image"
              />
              <div className="product-info">
                <h3 onClick={() => handleProductClick(product)} className="product-title">
                  {product.title}
                </h3>
                <p className="product-description">{product.description}</p>
                <div className="product-actions">
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  <div className="action-buttons">
                    <button 
                      onClick={() => addToCart(product, 1)}
                      className="add-to-cart-btn"
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => addToWishlist(product)}
                      className="add-to-wishlist-btn"
                    >
                      Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ProductList;


