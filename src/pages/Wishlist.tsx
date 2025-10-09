import React from "react";
import { useApp } from "../AppContext";

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, addToCart } = useApp();

  return (
    <div>
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <ul className="wishlist-list">
          {wishlist.map(w => (
            <li key={w.product.id} className="wishlist-item">
              <img src={w.product.imageUrl} alt={w.product.title} />
              <div>
                <h4>{w.product.title}</h4>
                <p>Added: {new Date(w.addedAt).toLocaleString()}</p>
              </div>
              <div>
                <button onClick={() => addToCart(w.product, 1)}>Add to Cart</button>
                <button onClick={() => removeFromWishlist(w.product.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;


