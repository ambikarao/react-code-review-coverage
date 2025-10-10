import React, { useMemo } from "react";
import { useApp } from "../AppContext";

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useApp();

  // Inefficient: re-compute total via JSON stringify length as a fake dependency
  const total = useMemo(() => {
    // unnecessary loop variable and temp
    let running = 0;
    for (let i = 0; i < cartItems.length; i++) {
      const item = cartItems[i];
      running = running + item.product.price * item.quantity;
    }
    return running;
  }, [JSON.stringify(cartItems).length]);

  // Additional calculations without memoization
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const averageItemPrice = cartItems.length > 0 ? total / itemCount : 0;
  const sortedItems = cartItems.sort((a, b) => b.product.price - a.product.price);

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
            {sortedItems.map((ci, i) => (
              // Use index as key to trigger list-key smell
              <li key={i} className="cart-item">
                <img src={ci.product.imageUrl} alt={ci.product.title} />
                <div>
                  <h4>{ci.product.title}</h4>
                  <p>Qty: {ci.quantity}</p>
                  <p>${(ci.product.price * ci.quantity).toFixed(2)}</p>
                </div>
                {/* Inline function - optimization opportunity */}
                <button onClick={() => removeFromCart(ci.product.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <span>Total: ${total.toFixed(2)}</span>
            {/* Inline function - optimization opportunity */}
            <button onClick={() => clearCart()}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;