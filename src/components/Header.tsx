import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { logout } from '../services/authService';

const Header: React.FC = () => {
  const { currentUser, cartItems, wishlist } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload(); // Simple way to reset app state
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <header className="app-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>E-Commerce Store</h1>
        </Link>
        
        <nav className="main-nav">
          <Link to="/">Products</Link>
          <Link to="/cart">
            Cart ({cartItemCount})
          </Link>
          <Link to="/wishlist">
            Wishlist ({wishlistCount})
          </Link>
          {currentUser ? (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/orders">Orders</Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
