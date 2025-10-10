import React, { useMemo, useCallback } from 'react';
import { useApp } from '../AppContext';

const Cart: React.FC = React.memo(() => {
  const { cartItems, removeFromCart, clearCart } = useApp();

  const calculateTotal = (items) => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = useMemo(() => calculateTotal(cartItems), [cartItems]);

  const itemCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const averageItemPrice = cartItems?.length > 0 ? total / itemCount : 0;
  const sortedItems = useMemo(() => [...cartItems].sort((a, b) => b.product.price - a.product.price), [cartItems]);

  const handleRemove = useCallback((id) => removeFromCart(id), [removeFromCart]);
  const handleClear = useCallback(() => clearCart(), [clearCart]);

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-stats">
            <span>Items: {itemCount}</span>
            <span>Avg Price: ${averageItemPrice.toFixed(2)}</span>
          </div>
          <ul className="cart-list">
            {sortedItems.map((ci) => (
              <li key={ci.product.id} className="cart-item">
                <img src={ci.product.imageUrl} alt={ci.product.title} />
                <div>
                  <h4>{ci.product.title}</h4>
                  <p>Qty: {ci.quantity}</p>
                  <p>${(ci.product.price * ci.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => handleRemove(ci.product.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <span>Total: ${total.toFixed(2)}</span>
            <button onClick={handleClear}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
});

export default Cart;