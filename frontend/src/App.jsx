// App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Appbar from './components/Navbar/Appbar'
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Login from './components/Loginc/LoginPage';
import Partner from './components/Partner/Partner';
import RestaurantTemplate from './components/Restaurant/Explore_restaurant_page/RestaurantTemplate';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { ThemeProvider } from '@material-tailwind/react';
import { materialTheme } from './configs/theme';
import { ToastContainer } from 'react-toastify';
import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import TableBooking from './components/Restaurant/BookingTable/TableBooking';
import ChangePassword from './components/ForgetPassword/ChangePassword';
import RestaurantMenu from './components/Restaurant/RestaurantMenu/RestaurantMenu';
import OrderDetails from './components/ViewOrder/OrderDetails';
const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <ThemeProvider value={materialTheme}>
      <ToastContainer />
      {showLogin && <Login setShowLogin={setShowLogin} />}
      <div className='app'>
      <Appbar setShowLogin={setShowLogin}/>
        {/* <Navbar setShowLogin={setShowLogin} /> */}
        <Routes>
          {/* Public routes */}
          <Route path='/' element={<Home />} exact />
          <Route path='/partner' element={<Partner />} />
          <Route path='/restaurant/:id/view' element={<RestaurantTemplate />} />
          <Route path='/forgetpassword' element={<ForgetPassword />} />
          <Route path='/:id/book-table' element={<TableBooking />} />
          <Route path='/vieworders' element={<OrderDetails/>}/>
          
          {/* Private routes */}
          <Route path='' element={<PrivateRoute />}>
          <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/restaurant/:id/menu' element={<RestaurantMenu />} />
          </Route>
          <Route path='/user/change-password' element={<ChangePassword/>}/>
        </Routes>
      </div>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
