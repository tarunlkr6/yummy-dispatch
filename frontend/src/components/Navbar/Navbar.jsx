import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import {logout} from "../../slices/authSlice"
const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // const [menu, setMenu] = useState("Home");
  const { userInfo } = useSelector((state)=> state.auth)
  const [logoutApiCall] = useLogoutMutation()
  const handleLogout = async () => {
    try {
      const res = await logoutApiCall().unwrap();
      //console.log(res); // Check the response status and data
      dispatch(logout());
      setShowLogin(false);
      navigate('/');
    } catch (error) {
      if (error.originalStatus === 401) {
        console.error("Unauthorized: Check if token is being sent correctly.");
      } else {
        console.error("Logout error:", error);
      }
    }
  };  
  const { cartItems} = useSelector((state)=> state.cart)


  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.app} alt="" className="logo" />
      </Link>
      {/* <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("Home")}
          className={menu === "Home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("Explore Restaurant")}
          className={menu === "Explore Restaurant" ? "active" : ""}
        >
          Explore Restaurant
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          mobile-app
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          contact us
        </a>
      </ul> */}
      
      <div className="navbar-right">
      <i className="fa-solid fa-qrcode fa-lg"></i>
      <i className="fa-solid fa-bell fa-lg"></i>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <i className="fa-solid fa-basket-shopping fa-lg"></i>
          </Link>
          <div className={cartItems.length === 0 ? "" : "dot"}>
            <p className="display-cart-quantity"></p>
          </div>
        </div>
        {! userInfo ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <i className="fa-solid fa-user fa-lg"></i>
            
            <ul className="nav-profile-dropdown">
              <li>
              <i className="fa-solid fa-bag-shopping"></i>
                <p>Orders</p>
              </li>
              <hr className="hr-line" />
              <li onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
