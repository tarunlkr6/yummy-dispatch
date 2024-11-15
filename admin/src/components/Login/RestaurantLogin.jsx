import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './login.css';

function RestaurantLogin() {
  const url = 'http://localhost:8080/api/v1/user';
  // const url = 'https://scan-dine-backend-bnj2.onrender.com/api/v1/user'
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/login`, { email, password });
      console.log(response.data.data);

      if (response.data.success) {
        localStorage.setItem('token', JSON.stringify(response.data.data.accessToken));
        localStorage.setItem('restaurantId', JSON.stringify(response.data.data.user.restaurantId));
        const token = JSON.parse(localStorage.getItem("token"));
        const resid = JSON.parse(localStorage.getItem("restaurantId"));
        console.log(resid)
        console.log(token)
      
        setEmail('');
        setPassword('');
        navigate('/dashboard');
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="background">
      <form onSubmit={onSubmitHandler} className="login-form">
        <h1 className="login-title">Scan&Dine</h1>
        <h2 className="login-subtitle">Admin Login Portal</h2>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              placeholder="tony@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-gray-200">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="•••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="login-button"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

export default RestaurantLogin;
