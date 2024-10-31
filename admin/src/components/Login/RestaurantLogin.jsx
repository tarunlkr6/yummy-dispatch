import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../../assets/images-1.jpg';

function RestaurantLogin() {
  const url = 'http://localhost:8080/api/v1/restaurant'
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async(e) => {
    e.preventDefault()
    const formData = new FormData() //insert all form data into One formdata
    formData.append('email', data.email)
    formData.append('password', data.password)
    const response = await axios.post (`${url}/login`, data);

    if(response.data.success){
        setData({
            email: '',
            password: '',
        })
        toast.success(response.data.message)
    }else{
        toast.error(response.data.message)
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <form onSubmit={onSubmitHandler} className="bg-black bg-opacity-70 shadow-lg rounded-lg p-10 w-1/2 mx-auto max-w-lg">
        <h1 className="text-3xl font-bold text-center text-white mb-2">Scan&Dine</h1>
        <h2 className="text-xl font-semibold text-center text-white mb-4">Admin Login Portal</h2>
        <h3 className="text-center text-gray-300 mb-6">Manage your restaurant operations efficiently</h3>

        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200">Email</label>
            <input
              type="email"
              name="email"
              placeholder="tony@gmail.com"
              value={data.email}
              onChange={onChangeHandler}
              className="form-input bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={data.password}
              onChange={onChangeHandler}
              className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="•••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}

export default RestaurantLogin;
