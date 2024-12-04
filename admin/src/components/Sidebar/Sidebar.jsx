import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [restaurantId, setRestaurantId] = useState('');

  useEffect(() => {
    const storedRestaurantId = JSON.parse(localStorage.getItem('restaurantId'));
    if (storedRestaurantId) {
      setRestaurantId(storedRestaurantId);
    }
  }, []);

  return (
    <div className='sidebar'>
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <div className="sidebar-options">
        <NavLink to='/dashboard/add' className="sidebar-option">
          <i className="fa-solid fa-utensils text-xl"></i>
          <p>Add Items</p>
        </NavLink>

        <NavLink to={`/dashboard/restaurant/${restaurantId}/menu`} className="sidebar-option">
          <i className="fa-solid fa-list-ol text-xl"></i>
          <p>List Items</p>
        </NavLink>

        <NavLink to={`/dashboard/orders/${restaurantId}`} className="sidebar-option">
          <i className="fa-solid fa-cart-plus"></i>
          <p>Orders</p>
        </NavLink>

        <NavLink to={`/dashboard/${restaurantId}/all`} className="sidebar-option">
          <i className="fa-solid fa-hand-holding-heart"></i>
          <p>Bookings</p>
        </NavLink>

        <NavLink to={`/dashboard/${restaurantId}/offers`} className="sidebar-option">
        <i className="fa-solid fa-gift"></i>
          <p>Offers</p>
        </NavLink>

        <NavLink to={`/dashboard/profile`} className="sidebar-option">
        <i className="fa-solid fa-user"></i>
          <p>Profile</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
