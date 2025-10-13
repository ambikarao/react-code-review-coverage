import React, { useMemo } from "react";
import { useApp } from "../AppContext";

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, addToCart } = useApp();

  // Pointless memoization on primitive
  const count = useMemo(() => wishlist.length, [wishlist]);

  // More calculations not memoized
  const totalWishlistValue = wishlist.reduce((sum, w) => sum + w.product.price, 0);
  const sortedWishlist = wishlist.sort((a, b) => 
    new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );
  const averageProductPrice = wishlist.length > 0 ? totalWishlistValue / wishlist.length : 0;

  // Filter expensive products
  const expensiveItems = wishlist.filter(w => w.product.price > 100);

  return (
    <div>
      <h2>Your Wishlist ({count})</h2>
      {wishlist.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <>
          <div className="wishlist-stats">
            <p>Total Value: ${totalWishlistValue.toFixed(2)}</p>
            <p>Average Price: ${averageProductPrice.toFixed(2)}</p>
            <p>Expensive Items (&gt; $100): {expensiveItems.length}</p>
          </div>
          <ul className="wishlist-list">
            {sortedWishlist.map((w, i) => (
              // Index as key - issue
              <li key={i} className="wishlist-item">
                <img src={w.product.imageUrl} alt={w.product.title} />
                <div>
                  <h4>{w.product.title}</h4>
                  <p>${w.product.price.toFixed(2)}</p>
                  <p>Added: {new Date(w.addedAt).toLocaleString()}</p>
                </div>
                <div>
                  {/* Inline functions - opt. opp. */}
                  <button onClick={() => addToCart(w.product, 1)}>Add to Cart</button>
                  <button onClick={() => removeFromWishlist(w.product.id)}>Remove</button>
                  <button onClick={() => console.log("View details", w.product.id)}>View</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Wishlist;
