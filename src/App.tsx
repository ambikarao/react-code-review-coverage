import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AppProvider } from "./AppContext";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import "./App.scss";

const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app-shell">
          <header className="app-header">
            <nav>
              <Link to="/">Products</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </nav>
          </header>
          <main className="app-main">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;


