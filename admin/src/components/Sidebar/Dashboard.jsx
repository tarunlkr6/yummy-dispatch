import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar/Navbar";
import Add from "../../pages/Add/Add";
import List from "../../pages/List/List";
import Orders from "../../pages/Orders/Orders";
import BookTable from "../../pages/BookTable/Book";
import Offer from "../../pages/Offer/Offer";
import "./dashboard.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import bgv from "./bgv.mp4";

import { Line, Bar, Pie } from "react-chartjs-2";

import {

  Chart as ChartJS,

  CategoryScale,

  LinearScale,

  PointElement,

  LineElement,

  BarElement,

  Title,

  Tooltip,

  Legend,

  ArcElement,

} from "chart.js";

//const url = "http://localhost:8080/api/v1";
const url = 'https://scan-dine-backend-5qms.onrender.com/api/v1';


ChartJS.register(

  CategoryScale,

  LinearScale,

  PointElement,

  LineElement,

  BarElement,

  ArcElement,

  Title,

  Tooltip,

  Legend

);

// Dashboard.js

const Dashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      setLoading(true); // Start loading
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const resid = JSON.parse(localStorage.getItem("restaurantId"));

        const response = await axios.get(`${url}/restaurant/${resid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(response.data.data);
        localStorage.setItem('resname', JSON.stringify(response.data.data.name));
        localStorage.setItem('resphno' , JSON.stringify(response.data.data.phoneNumber ));
        localStorage.setItem('resmailid' , JSON.stringify(response.data.data.ownerEmail ));
        localStorage.setItem('resadd' , JSON.stringify(response.data.data.address ));

      } catch (err) {
        setError("Error fetching restaurant details");
      } finally {
        setLoading(false); // End loading
      }
    };

    const resid = JSON.parse(localStorage.getItem("restaurantId"));
    if (resid) fetchRestaurantDetails();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-layout">
      {error && <div className="error-message">{error}</div>}

      <video autoPlay loop muted src={bgv} className="background-video">
        Your browser does not support the video tag.
      </video>
      <Navbar />
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<DashboardHome restaurant={restaurant} />} />
          <Route path="add" element={<Add url={url} />} />
          <Route path="restaurant/:resid/menu" element={<List url={url} />} />
          <Route path="orders/:resid" element={<Orders url={url} />} />
          <Route path=":resid/all" element={<BookTable url={url} />} />
          <Route path=":resid/offers" element={<Offer url={url} />} />
        </Routes>
      </div>
    </div>
  );
};


const DashboardHome = ({ restaurant }) => {
  const [isOpen, setIsOpen] = useState(restaurant?.isOpen || true);
  const [reviews, setReviews] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [ordersData, setOrdersData] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  const reviewsPerPage = 3;

  useEffect(() => {
    if (restaurant) {
      setIsOpen(restaurant.isOpen);
    }
  }, [restaurant]);


  useEffect(() => {
    const fetchOrdersData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const resid = JSON.parse(localStorage.getItem("restaurantId"));
        const response = await axios.get(`${url}/orders/${resid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const orders = response.data.data;
        const revenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        setTotalRevenue(revenue);
        setOrderCount(orders.length);

        // Extract data for analytics (e.g., revenue over time)
        const dailyRevenue = orders.reduce((acc, order) => {
          const date = new Date(order.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + order.totalPrice;
          return acc;
        }, {});
        setOrdersData(Object.entries(dailyRevenue).map(([date, total]) => ({ date, total })));
      } catch (err) {
        setError("Failed to fetch order data");
      }
    };

    if (restaurant) fetchOrdersData();
  }, [restaurant]);




  

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const resid = JSON.parse(localStorage.getItem("restaurantId"));
        const response = await axios.get(`${url}/restaurant/${resid}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setReviews(response.data.data.restaurantReviews);
        console.log(response.data.data.restaurantReviews)
      } catch (err) {
        setError("Failed to fetch reviews data");
      }
    };

    if (restaurant) fetchReviews();
  }, [restaurant]);


  const handleToggle = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const resid = JSON.parse(localStorage.getItem("restaurantId"));

      // Toggle isOpen locally
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);

      // Send the update to the backend
      await axios.patch(
        `${url}/restaurant/${resid}`,
        { isOpen: newIsOpen },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      setError("Failed to update status");
      // Revert isOpen to its previous state if the update fails
      setIsOpen(!isOpen);
    }
  };
  



  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };


  return restaurant ? (
    <div className="dashboard-home">
      <div className="restaurant-header">
        <img src={restaurant.avatar} alt={`${restaurant.name} Logo`} className="restaurant-avatar" />
        <div className="restaurant-info">
          <h1 className="restaurant-name">{restaurant.name}</h1>
          <div className="revenue-orders">
            <div className="revenue-card">
              <h2>Total Revenue</h2>
              <p>${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="order-count-card">
              <h2>Order Count</h2>
              <p>{orderCount}</p>
            </div>
          </div>

        </div>
      </div>

      <div className="restaurant-details">

        <div className="detail-block">
         <strong>Description:</strong>
         <p>{restaurant.description}</p>
        </div>

        <div className="detail-block">
          <strong>Address:</strong> 
          <p>{restaurant.address}, {restaurant.city}, {restaurant.state} - {restaurant.zipCode}</p>
        </div>
        <div className="detail-block">
          <strong>Phone Number:</strong> 
          <p>{restaurant.phoneNumber}</p>
        </div>
        <div className="detail-block">
          <strong>Owner:</strong> 
          <p>{restaurant.ownerName} ({restaurant.ownerEmail})</p>
        </div>
        <div className="detail-block">
          <strong>Opening Time:</strong> 
          <p>{restaurant.openingTime}</p>
        </div>
        <div className="detail-block">
          <strong>Closing Time:</strong> 
          <p>{restaurant.closingTime}</p>
        </div>
        <div className="detail-block">
          <strong>Rating:</strong> 
          <p>{restaurant.rating}</p>
        </div>
        <div className="toggle-container">
          <label className="toggle-switch">
            <input type="checkbox" checked={isOpen} onChange={handleToggle} />
            <span className="slider"></span>
          </label>
          <span className="toggle-status">{isOpen ? "Open" : "Closed"}</span>
        </div>
      </div>



      <div className="reviews-section">
        <h2>Reviews</h2>
        {currentReviews.length ? (
          currentReviews.map((review, index) => (
            <div key={index} className="review-card">
              <h4>User: {review.name}</h4>
              { review.review ?
              <p className="review-text">{review.review}</p> : ""
              }

              <div className="review-rating">
                Rating: {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < review.rating ? "star filled" : "star"}>★</span>
                ))}
              </div>
              <p className="review-date">Date: {new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">
            Previous
          </button>
          <span className="page-number">Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-button">
            Next
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Dashboard;
