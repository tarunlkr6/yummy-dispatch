import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './pages/Home/Home'
import RestaurantRegistration from "./components/Registrer/RestaurantRegistration";
import RestaurantLogin from "./components/Login/RestaurantLogin";
import Dashboard from "./components/Sidebar/Dashboard";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Set authentication status after login
  const handleLogin = () => setIsAuthenticated(true);

  return (
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RestaurantRegistration />} />
        <Route path="/login" element={<RestaurantLogin onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
  );
};

export default App;
