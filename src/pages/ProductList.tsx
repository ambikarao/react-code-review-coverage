import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import { Product } from "../models/types";
import { useApp } from "../AppContext";

const ProductList: React.FC = () => {
  const { addToCart, addToWishlist } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchProducts().then(p => {
      if (mounted) setProducts(p);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="product-grid">
      {products.map(p => (
        <div key={p.id} className="product-card">
          <img src={p.imageUrl} alt={p.title} />
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <div className="product-actions">
            <span>${p.price.toFixed(2)}</span>
            <div>
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


