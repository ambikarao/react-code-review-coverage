import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Product } from '../models/types';
import { useApp } from '../AppContext';
import { useNotification } from '../pages/Notification';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

const ProductDetailModal: React.FC<ProductDetailModalProps> = React.memo(({ product, isOpen, onClose }) => {
  const { addToCart, addToWishlist, cartItems } = useApp();
  const { addNotification } = useNotification();
  const [quantity, setQuantity] = useState(MIN_QUANTITY);

  useEffect(() => {
    if (isOpen) {
      setQuantity(MIN_QUANTITY);
    }
  }, [isOpen]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscape]);

  if (!product || !isOpen) return null;

  const handleAddToCart = useCallback(() => {
    addToCart(product, quantity);
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.title} (${quantity}x) has been added to your cart.`
    });
    onClose();
  }, [addToCart, product, quantity, addNotification, onClose]);

  const handleAddToWishlist = useCallback(() => {
    addToWishlist(product);
    addNotification({
      type: 'success',
      title: 'Added to Wishlist',
      message: `${product.title} has been added to your wishlist.`
    });
  }, [addToWishlist, product, addNotification]);

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= MIN_QUANTITY && value <= MAX_QUANTITY) {
      setQuantity(value);
    }
  }, []);

  const incrementQuantity = useCallback(() => {
    setQuantity(prev => Math.min(prev + 1, MAX_QUANTITY));
  }, []);

  const decrementQuantity = useCallback(() => {
    setQuantity(prev => Math.max(prev - 1, MIN_QUANTITY));
  }, []);

  const isInCart = useMemo(() => cartItems?.some(item => item.product.id === product.id) ?? false, [cartItems, product.id]);

  const handleModalContentClick = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          &times;
        </button>
        
        <div className="modal-body">
          <div className="product-images">
            <div className="main-image">
              <img src={product.imageUrl} alt={product.title} />
            </div>
          </div>
          
          <div className="product-details">
            <h2 className="product-title">{product.title}</h2>
            <p className="product-description">{product.description}</p>
            
            <div className="product-price">
              <span className="current-price">${product.price.toFixed(2)}</span>
            </div>
            
            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={decrementQuantity}
                    disabled={quantity <= MIN_QUANTITY}
                    aria-label="Decrease quantity"
                  >
                    &minus;
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min={MIN_QUANTITY}
                    max={MAX_QUANTITY}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                  />
                  <button 
                    onClick={incrementQuantity}
                    disabled={quantity >= MAX_QUANTITY}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="action-buttons">
                <button 
                  onClick={handleAddToCart}
                  className="add-to-cart-btn"
                  disabled={isInCart}
                >
                  {isInCart ? 'Already in Cart' : 'Add to Cart'}
                </button>
                
                <button 
                  onClick={handleAddToWishlist}
                  className="add-to-wishlist-btn"
                >
                  Add to Wishlist
                </button>
              </div>
            </div>
            
            <div className="product-specs">
              <h3>Product Details</h3>
              <ul>
                <li><strong>Product ID:</strong> {product.id}</li>
                <li><strong>Category:</strong> Electronics</li>
                <li><strong>Availability:</strong> In Stock</li>
                <li><strong>Shipping:</strong> Free shipping on orders over $50</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProductDetailModal;