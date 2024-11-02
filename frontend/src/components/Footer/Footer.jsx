import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { FaInstagram, FaXTwitter, FaLinkedin } from "react-icons/fa6";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="app-logo" src={assets.app} alt="" />
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet
            impedit dolore sed, consectetur, cumque reiciendis, eum accusamus
            veniam architecto possimus voluptatem! Veniam provident iste
            necessitatibus sequi praesentium ipsa vero autem?
          </p>
          <div className="footer-social-icons">
            <FaInstagram size={30} />
            <FaXTwitter size={30} />
            <FaLinkedin size={30} />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About Us</li>
            <li>Delivery</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get in Touch</h2>
          <ul>
            <li>+1 263-837-3948</li>
            <li>contact@foodkart.com</li>
          </ul>
          <div className="navbar-partner">
            <u>Want to become a prtner? </u>
            <Link to="/partner">
              <span>Click Here!</span>
            </Link>
          </div>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 @ Scan&Dine.in - All Right reserved.
      </p>
    </div>
  );
}

export default Footer;
