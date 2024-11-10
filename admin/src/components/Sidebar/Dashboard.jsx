import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar/Navbar";
import Add from "../../pages/Add/Add";
import List from "../../pages/List/List";
import Orders from "../../pages/Orders/Orders";
import BookTable from "../../pages/BookTable/Book";
import './dashboard.css';
import bgv from './bgv.mp4'

const url = 'https://scan-dine-backend-j9ci.onrender.com' || 'http://localhost:8080/api/v1';

const Dashboard = () => {
  console.log("Dashboard component rendered"); // Debugging log

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Sidebar />
      <video className="background-video" autoPlay loop muted>
        <source src={bgv} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="content">




        <Routes>
          <Route path="add" element={<Add url={url} />} />
          <Route path="restaurant/67251d6a3e030e9e961800b0/menu" element={<List url={url} />} />
          <Route path="orders/67251d6a3e030e9e961800b0" element={<Orders url={url} />} />
          <Route path="67251d6a3e030e9e961800b0/all" element={<BookTable url={url}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
