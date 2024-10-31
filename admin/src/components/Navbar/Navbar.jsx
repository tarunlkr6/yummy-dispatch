import React from "react";
import "./navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="left-navbar-section">
        <img className="logo" src={assets.logo} alt="logo" />
      </div>
      <div className="right-navbar-section">
        <img
          className="profile"
          src={assets.profile_image}
          alt="profile logo"
        />
        {/* <Link to="/register">Register</Link>
        <Link to="/login">Login</Link> */}
      </div>
    </div>
  );
};

export default Navbar;
