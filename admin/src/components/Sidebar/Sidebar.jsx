import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-header">
        <h2>Dashboard</h2>
      </div>
      <div className="sidebar-options">
        <NavLink to='/dashboard/add' className="sidebar-option">
        <i className="fa-solid fa-utensils text-xl "></i>
          <p>Add Items</p>
        </NavLink>

        <NavLink to='/dashboard/restaurant/67251d6a3e030e9e961800b0/menu' className="sidebar-option">
        <i class="fa-solid fa-list-ol text-xl"></i>
          <p>List Items</p>
        </NavLink>

        <NavLink to='/dashboard/orders/67251d6a3e030e9e961800b0' className="sidebar-option">
        <i className="fa-solid fa-cart-plus"></i>
          <p>Orders</p>
        </NavLink>

{/* 
        /:resid/all */}

{/* // router.route("/:resid/offer/create").post(verifyJWT, authRole, upload.fields([{ name: 'offerImage', maxCount: 1, }]), createOffer)
// router.route("/:resid/offer/delete/:offerid").delete(verifyJWT, authRole, deleteOffer)
// router.route("/:resid/offers").get(getOffers) */}


        <NavLink to='/dashboard/67251d6a3e030e9e961800b0/all' className="sidebar-option">
        <i className="fa-solid fa-hand-holding-heart"></i>
          <p>Bookings</p>
        </NavLink>


        <NavLink to='/dashboard/67251d6a3e030e9e961800b0/offers' className="sidebar-option">
        <i className="fa-solid fa-hand-holding-heart"></i>
          <p>Offers</p>
        </NavLink>
        

      </div>
    </div>
  );
}

export default Sidebar;
