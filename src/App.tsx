import React from "react";
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

const App: React.FC = () => {
  return (
    <AppProvider>
      <NotificationProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Header />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<ProductList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </AppProvider>
  );
};

export default App;


