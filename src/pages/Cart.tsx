import React from "react";
import { useApp } from "../AppContext";

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useApp();

  const total = cartItems.reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map(ci => (
              <li key={ci.product.id} className="cart-item">
                <img src={ci.product.imageUrl} alt={ci.product.title} />
                <div>
                  <h4>{ci.product.title}</h4>
                  <p>Qty: {ci.quantity}</p>
                  <p>${(ci.product.price * ci.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(ci.product.id)}>Remove</button>
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


