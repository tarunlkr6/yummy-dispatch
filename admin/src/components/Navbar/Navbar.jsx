import React from "react";
import "./navbar.css";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="left-navbar-section">
        <Link to="/dashboard" className="logo-container">
          <img src={assets.logo} className="logo rounded-full" alt="Logo" />
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Logout</Link>
        </div>
      </div>

      <div className="right-navbar-section">
        <Link to="/profile" className="profile-container">
          <img
            className="profile"
            src={assets.profile_image}
            alt="Profile"
          />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
