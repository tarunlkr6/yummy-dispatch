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
import Profile from './components/Profile/Profile';
import TableBookingDetails from './components/Restaurant/BookingTable/TableBookingDetails';
import Payment from './components/Payment/Payment';
import ResetPassword from './components/ResetPassword/ResetPassword'
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
          <Route path='/reset-password'setShowLogin={setShowLogin} element={<ForgetPassword />} />
          
          <Route path='/vieworders' element={<OrderDetails/>}/>
          <Route path='/table/details' element={<TableBookingDetails/>}/>

          {/* User Routes */}
          <Route path='/user/change-password' element={<ChangePassword/>}/>
          {/* <Route path='/user/reset-password/:token' element={<ResetPassword />} /> */}
          <Route path='/user/me' element={<Profile/>}/>
          {/* Private routes */}
          <Route path='' element={<PrivateRoute />}>
          <Route path='/cart' element={<Cart />} />
            <Route path='/:id/book-table' element={<TableBooking />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/order/:id' element={<Payment/>}/>
            <Route path='/restaurant/:id/menu' element={<RestaurantMenu />} />
          </Route>
          
        </Routes>
      </div>
      <Footer />
    </ThemeProvider>
  );
};

export default App;
