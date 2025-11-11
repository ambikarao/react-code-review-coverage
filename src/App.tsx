import React, { useCallback } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./AppContext";
import { NotificationProvider } from "./components";
import { Header } from "./components";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";
import "./App.scss";

const App: React.FC = React.memo(() => {
  const routes = [
    <Route key="product-list" path="/" element={<ProductList />} />, 
    <Route key="login" path="/login" element={<Login />} />, 
    <Route key="signup" path="/signup" element={<SignUp />} />, 
    <Route key="cart" path="/cart" element={<Cart />} />, 
    <Route key="wishlist" path="/wishlist" element={<Wishlist />} />, 
    <Route key="checkout" path="/checkout" element={<Checkout />} />, 
    <Route key="orders" path="/orders" element={<Orders />} />, 
    <Route key="profile" path="/profile" element={<Profile />} />, 
    <Route key="contact" path="/contact" element={<Contact />} />
  ];

  return (
    <AppProvider>
      <NotificationProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Header />
            <main className="app-main">
              <Routes>{routes}</Routes>
            </main>
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </AppProvider>
  );
});

export default App;