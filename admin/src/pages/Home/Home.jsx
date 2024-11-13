import React from "react";
import { Link } from "react-router-dom";
import './home.css';

const Home = () => {
  return (
    <>
      <div className="hero-section relative overflow-hidden flex items-center justify-center bg-black text-white min-h-screen">
        <img
          src="https://picsum.photos/seed/picsum/1900/850"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
          alt="Background"
        />
        <div className="relative z-10 max-w-screen-lg mx-auto text-center p-8">
          <span className="text-sm uppercase font-semibold tracking-wide text-yellow-400 animate-fadeIn">Welcome to the Admin Portal</span>
          <h1 className="text-6xl font-extrabold mb-6 animate-slideUp delay-100">Scan & Dine</h1>
          <p className="text-lg text-gray-300 mb-8 animate-fadeIn delay-200">Manage your restaurant operations efficiently with our portal</p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <button className="button-primary hover:bg-yellow-500">Register</button>
            </Link>
            <Link to="/login">
              <button className="button-primary hover:bg-yellow-500">Login</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="info-section bg-yellow-100 py-20">
        <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row justify-between items-center px-4 space-y-6 md:space-y-0 md:space-x-8">
          <div className="text-center md:text-left max-w-xl space-y-4 animate-slideIn">
            <h2 className="text-3xl font-extrabold text-yellow-800">Leading experts in restaurant management</h2>
            <p className="text-yellow-700">Providing comprehensive solutions in over 90 countries to help your business thrive.</p>
          </div>
          <button className="button-secondary hover:bg-yellow-800">Get Started</button>
        </div>
      </div>

      <div className="assistance-section bg-gray-900 text-white py-20">
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
          <div className="flex flex-col items-center md:items-end space-y-4 text-center md:text-right animate-slideInLeft">
            <h2 className="text-4xl font-bold text-yellow-400">Need Assistance?</h2>
            <p>We offer expert support to help you navigate and manage your operations effectively.</p>
          </div>
          <div className="flex items-center justify-center animate-slideInRight">
            <img
              src="https://picsum.photos/seed/picsum/1900/850"
              className="rounded-xl shadow-lg"
              alt="Assistance"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
