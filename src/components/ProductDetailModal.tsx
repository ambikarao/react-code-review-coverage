import React, { useState, useEffect } from 'react';
import { Product } from '../models/types';
import { useApp } from '../AppContext';
import { useNotification } from './Notification';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
  const { addToCart, addToWishlist, cartItems } = useApp();
  const { addNotification } = useNotification();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Reset quantity when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedImageIndex(0);
    }
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!product || !isOpen) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.title} (${quantity}x) has been added to your cart.`
    });
    onClose();
  };

  const handleAddToWishlist = () => {
    addToWishlist(product);
    addNotification({
      type: 'success',
      title: 'Added to Wishlist',
      message: `${product.title} has been added to your wishlist.`
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Check if product is in cart
  const isInCart = cartItems.some(item => item.product.id === product.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ✕
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
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="quantity-input"
                  />
                  <button 
                    onClick={incrementQuantity}
                    disabled={quantity >= 10}
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
};

export default ProductDetailModal;
