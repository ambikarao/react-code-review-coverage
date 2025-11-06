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

const App: React.FC<{}> = React.memo(() => {
  const routes = [
    { path: "/", element: <ProductList /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/cart", element: <Cart /> },
    { path: "/wishlist", element: <Wishlist /> },
    { path: "/checkout", element: <Checkout /> },
    { path: "/orders", element: <Orders /> },
    { path: "/profile", element: <Profile /> },
    { path: "/contact", element: <Contact /> },
  ];

  return (
    <AppProvider>
      <NotificationProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Header />
            <main className="app-main">
              <Routes>{routes.map(route => <Route key={route.path} {...route} />)}</Routes>
            </main>
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </AppProvider>
  );
});

export default App;