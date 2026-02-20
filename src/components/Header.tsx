import React, { useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { logout } from '../services/authService';

// Conceptual ErrorBoundary HOC (not defined in this file, but implied for reliability optimization)
// const withErrorBoundary = (Component: React.FC) => (props: any) => <ErrorBoundary><Component {...props} /></ErrorBoundary>;

// Maintainability Optimization: Extracted conditional navigation component
interface AuthNavigationProps {
  currentUser: any; // Type according to AppContext
  onLogout: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AuthNavigation: React.FC<AuthNavigationProps> = React.memo(({ currentUser, onLogout }) => {
  return (
    <>
      {currentUser ? (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/orders">Orders</Link>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </>
  );
});

const Header: React.FC = React.memo(() => {
  const { currentUser, cartItems, wishlist } = useApp();
  const navigate = useNavigate();

  const handleLogout = useCallback(async (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await logout();
      navigate('/');
      // Removed window.location.reload(); // Anti-pattern for SPAs
      // Consider using a proper state management solution to reset app state here.
    } catch (error) {
      console.error('Logout failed:', error);
      // Provide user feedback, e.g., a toast notification
    }
  }, [navigate]); // logout is a stable import, no need to include as dependency.

  const cartItemCount = useMemo(() =>
    cartItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0)
  , [cartItems]);

  const wishlistCount = useMemo(() =>
    wishlist.length
  , [wishlist]);

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
          <AuthNavigation currentUser={currentUser} onLogout={handleLogout} />
        </nav>
      </div>
    </header>
  );
});

export default Header; // Reliability Optimization: Error Boundary would wrap this component, e.g., export default withErrorBoundary(Header);