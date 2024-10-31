import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "../Navbar/Navbar";
import Add from "../../pages/Add/Add";
import List from "../../pages/List/List";
import Orders from "../../pages/Orders/Orders";
import './dashboard.css'
const url= 'http://localhost:8080'

const Dashboard = () => (
  
  <div className="dashboard-layout">
    <Navbar />
    <Sidebar />
    <div className="content">
      <Routes>
        <Route path="/add" element={<Add url={url} />} />
        <Route path="/list" element={<List url={url} />} />
        <Route path="/orders" element={<Orders url={url} />} />
      </Routes>
    </div>
  </div>
);

export default Dashboard;
