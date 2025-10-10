// Complete fixed and optimized code with ALL changes applied
import React, { useMemo, useCallback } from "react";
import { useApp } from "../AppContext";

const Cart: React.FC<{}> = () => {
  const { cartItems, removeFromCart, clearCart } = useApp();

  const total = useMemo(() => {
    let running = 0;
    for (const item of cartItems) {
      running += item.product.price * item.quantity;
    }
    return running;
  }, [cartItems]);

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((cartItem, index) => (
              <li key={cartItem.product.id} className="cart-item">
                <img src={cartItem.product.imageUrl} alt={cartItem.product.title} />
                <div>
                  <h4>{cartItem.product.title}</h4>
                  <p>Qty: {cartItem.quantity}</p>
                  <p>${(cartItem.product.price * cartItem.quantity).toFixed(2)}</p>
                </div>
                const handleRemove = useCallback(() => removeFromCart(cartItem.product.id), [cartItem.product.id]);
                <button onClick={handleRemove}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="cart-summary">
            <span>Total: ${total.toFixed(2)}</span>
            <button onClick={clearCart}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;