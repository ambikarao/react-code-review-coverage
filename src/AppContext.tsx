import React, { createContext, useContext, useMemo, useState } from "react";
import { CartItem, Product, User, WishlistItem } from "./models/types";

interface AppState {
  currentUser: User | null;
  token: string | null;
  cartItems: CartItem[];
  wishlist: WishlistItem[];
}

interface AppContextValue extends AppState {
  setUser: (user: User | null, token: string | null) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearCart: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  const setUser = (user: User | null, authToken: string | null) => {
    setCurrentUser(user);
    setToken(authToken);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.product.id === product.id);
      if (existing) {
        return prev.map(ci =>
          ci.product.id === product.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(ci => ci.product.id !== productId));
  };

  const addToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.some(w => w.product.id === product.id)) return prev;
      return [...prev, { product, addedAt: new Date().toISOString() }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(w => w.product.id !== productId));
  };

  const clearCart = () => setCartItems([]);

  // Overly broad memo deps and unstable function references included
  const value = useMemo<AppContextValue>(
    () => ({
      currentUser,
      token,
      cartItems,
      wishlist,
      setUser,
      addToCart,
      removeFromCart,
      addToWishlist,
      removeFromWishlist,
      clearCart,
    }),
    [currentUser, token, cartItems, wishlist, setUser, addToCart, removeFromCart, addToWishlist, removeFromWishlist, clearCart]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};


