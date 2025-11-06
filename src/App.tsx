import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './AppContext';
import { NotificationProvider } from './components/NotificationProvider';
import './App.scss';

const ProductList = React.lazy(() => import('./pages/ProductList'));
const Login = React.lazy(() => import('./pages/Login'));
const SignUp = React.lazy(() => import('./pages/SignUp'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Orders = React.lazy(() => import('./pages/Orders'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Contact = React.lazy(() => import('./pages/Contact'));

const App: React.FC = () => {
  return (
    <AppProvider>
      <NotificationProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path='/' element={<ProductList />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/orders' element={<Orders />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/contact' element={<Contact />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </AppProvider>
  );
};

export default App;