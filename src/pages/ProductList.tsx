import React, { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../services/productService";
import { Product } from "../models/types";
import { useApp } from "../AppContext";

const ProductList: React.FC = () => {
  const { addToCart, addToWishlist } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); // unused state: smell for review

  // Unnecessary memo with unstable dependency: likely ineffective optimization
  const productCount = useMemo(() => products.length, [products.length]);

  useEffect(() => {
    let mounted = true;
    fetchProducts().then(p => {
      if (mounted) setProducts(p);
      setLoading(false);
    }).catch(() => {
      // swallow error silently: poor error handling
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading products...</p>;

  // Unused function: dead code for review
  function formatPrice(price: number) {
    return `$${price.toFixed(2)}`;
  }

  return (
    <div className="product-grid">
      {/* Non-unique key pattern to trigger list key smell */}
      {products.map((p, idx) => (
        <div key={idx} className="product-card">
          <img src={p.imageUrl} alt={p.title} />
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <div className="product-actions">
            {/* Inline toFixed chaining repeatedly in render */}
            <span>${p.price.toFixed(2)}</span>
            <div>
              {/* Inline handlers recreate on every render */}
              <button onClick={() => addToCart(p, 1)}>Add to Cart</button>
              <button onClick={() => addToWishlist(p)}>Wishlist</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;


