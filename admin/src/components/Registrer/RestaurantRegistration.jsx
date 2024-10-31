import React, { useState } from "react";
import backgroundImage from "../../assets/pexels--2.jpg";
import axios from 'axios'

const RestaurantRegistration = () => {
  const url = 'http://localhost:8080/api/v1/restaurant'
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    ownerName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    openingTime: "",
    closingTime: "",
    avatar: "",
    password: "",
    confirmPassword: "",
    image: null,
  });

  // Update the state based on the name of the input field
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async(e) => {
    e.preventDefault()
    const formData = new FormData() //insert all form data into One formdata
    formData.append('name', data.name) //insert all data..
    formData.append('description', data.description)
    formData.append('ownerName', data.ownerName)
    formData.append('email', data.email)
    formData.append('phoneNumber', data.phoneNumber)
    formData.append('address', data.address)
    formData.append('city', data.city)
    formData.append('state', data.state)  
    formData.append('zipCode', Number(data.zipCode))
    formData.append('openingTime', data.openingTime)
    formData.append('closingTime', data.closingTime)
    formData.append('password', data.password)
    formData.append('confirmPassword', data.confirmPassword)
    formData.append('avatar', image)
    formData.append('image', image)
    const response = await axios.post (`${url}/register`, data);

    if(response.data.success){
        setData({
            name: '',
            description: '',
            ownerName: '',
            email: '',
            phoneNumber: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            openingTime: '',
            closingTime: '',
            avatar: '',
            password: '',
            confirmPassword: '',
        })
        setImage(false)
        toast.success(response.data.message)
    }else{
        toast.error(response.data.message)
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-gradient-to-r from-sky-500 to-indigo-500"
      // style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-60 shadow-lg rounded-lg p-8 w-1/2 mx-auto">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Restaurant Registration
        </h2>
        <form onSubmit={onSubmitHandler}>
          <div className="grid grid-cols-1 gap-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Restaurant Name
            </label>
            <input
              className="form-input bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              name="name"
              placeholder="Restaurant Name"
              value={data.name}
              onChange={onChangeHandler}
            />

            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Restaurant Description
            </label>
            <input
              className="form-input bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              name="description"
              placeholder="Description"
              value={data.description}
              onChange={onChangeHandler}
            />

            <label
              htmlFor="ownerName"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Owner Name
            </label>
            <input
              className="form-input bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={data.ownerName}
              onChange={onChangeHandler}
            />

            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="tony@gmail.com"
              value={data.email}
              onChange={onChangeHandler}
              className="form-input bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Phone
            </label>
            <input
              className="form-input bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              name="phoneNumber"
              placeholder="123-45-678"
              value={data.phoneNumber}
              onChange={onChangeHandler}
            />

            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Address
            </label>
            <input
              className="form-input bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              name="address"
              placeholder="Address"
              value={data.address}
              onChange={onChangeHandler}
            />

            <div className="flex gap-2">
              <div className="w-1/2">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-white"
                >
                  City
                </label>
                <input
                  className="form-input bg-transparent border border-gray-300 text-white text-sm rounded-lg w-full p-2.5"
                  type="text"
                  name="city"
                  placeholder="City"
                  value={data.city}
                  onChange={onChangeHandler}
                />
              </div>
              <div className="w-1/2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-white"
                >
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={data.state}
                  onChange={onChangeHandler}
                  className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                >
                  <option value="SelectState" className="text-sky-800">
                    Select State
                  </option>
                  <option value="Andra Pradesh" className="text-sky-800">
                    Andra Pradesh
                  </option>
                  <option value="Arunachal Pradesh" className="text-sky-800">
                    Arunachal Pradesh
                  </option>
                  <option value="Assam" className="text-sky-800">
                    Assam
                  </option>
                  <option value="Bihar" className="text-sky-800">
                    Bihar
                  </option>
                  <option value="Chhattisgarh" className="text-sky-800">
                    Chhattisgarh
                  </option>
                  <option value="Goa" className="text-sky-800">
                    Goa
                  </option>
                  <option value="Gujarat" className="text-sky-800">
                    Gujarat
                  </option>
                  <option value="Haryana" className="text-sky-800">
                    Haryana
                  </option>
                  <option value="Himachal Pradesh" className="text-sky-800">
                    Himachal Pradesh
                  </option>
                  <option value="Jammu and Kashmir" className="text-sky-800">
                    Jammu and Kashmir
                  </option>
                  <option value="Jharkhand" className="text-sky-800">
                    Jharkhand
                  </option>
                  <option value="Karnataka" className="text-sky-800">
                    Karnataka
                  </option>
                  <option value="Kerala" className="text-sky-800">
                    Kerala
                  </option>
                  <option value="Madya Pradesh" className="text-sky-800">
                    Madya Pradesh
                  </option>
                  <option value="Maharashtra" className="text-sky-800">
                    Maharashtra
                  </option>
                  <option value="Manipur" className="text-sky-800">
                    Manipur
                  </option>
                  <option value="Meghalaya" className="text-sky-800">
                    Meghalaya
                  </option>
                  <option value="Mizoram" className="text-sky-800">
                    Mizoram
                  </option>
                  <option value="Nagaland" className="text-sky-800">
                    Nagaland
                  </option>
                  <option value="Orissa" className="text-sky-800">
                    Orissa
                  </option>
                  <option value="Punjab" className="text-sky-800">
                    Punjab
                  </option>
                  <option value="Rajasthan" className="text-sky-800">
                    Rajasthan
                  </option>
                  <option value="Sikkim" className="text-sky-800">
                    Sikkim
                  </option>
                  <option value="Tamil Nadu" className="text-sky-800">
                    Tamil Nadu
                  </option>
                  <option value="Telangana" className="text-sky-800">
                    Telangana
                  </option>
                  <option value="Tripura" className="text-sky-800">
                    Tripura
                  </option>
                  <option value="Uttaranchal" className="text-sky-800">
                    Uttaranchal
                  </option>
                  <option value="Uttar Pradesh" className="text-sky-800">
                    Uttar Pradesh
                  </option>
                  <option value="West Bengal" className="text-sky-800">
                    West Bengal
                  </option>
                  <option
                    value="Andaman and Nicobar Islands"
                    className="text-sky-800"
                  >
                    Andaman and Nicobar Islands
                  </option>
                  <option value="Chandigarh" className="text-sky-800">
                    Chandigarh
                  </option>
                  <option
                    value="Dadar and Nagar Haveli"
                    className="text-sky-800"
                  >
                    Dadar and Nagar Haveli
                  </option>
                  <option value="Daman and Diu" className="text-sky-800">
                    Daman and Diu
                  </option>
                  <option value="Delhi" className="text-sky-800">
                    Delhi
                  </option>
                  <option value="Lakshadeep" className="text-sky-800">
                    Lakshadeep
                  </option>
                  <option value="Pondicherry" className="text-sky-800">
                    Pondicherry
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="openingTime"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Opening Time
                </label>
                <input
                  className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  type="text"
                  name="openingTime"
                  placeholder="Opening Time"
                  value={data.openingTime}
                  onChange={onChangeHandler}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="closingTime"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Closing Time
                </label>
                <input
                  className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  type="text"
                  name="closingTime"
                  placeholder="Closing Time"
                  value={data.closingTime}
                  onChange={onChangeHandler}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="zipCode"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Zip Code
                </label>
                <input
                  className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  type="text"
                  name="zipCode"
                  placeholder="Zip Code"
                  value={data.zipCode}
                  onChange={onChangeHandler}
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="image"
                  className="block text-sm font-medium text-gray-900 dark:text-white"
                >
                  Restaurant Image
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={(e)=> setImage(e.target.files[0])}
                  className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                />
              </div>
            </div>

            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Avatar URL (optional)
            </label>
            <input
              className="form-input bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              type="text"
              name="avatar"
              placeholder="Avatar URL"
              value={data.avatar}
              onChange={onChangeHandler}
            />

            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              id="password"
              value={data.password}
              onChange={onChangeHandler}
              className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="•••••••••"
            />

            <label
              htmlFor="confirm_password"
              className="block text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm Password
            </label>
            <input
              id="confirm_password"
              name="confirmPassword"
              type="password"
              value={data.confirmPassword}
              onChange={onChangeHandler}
              className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="•••••••••"
            />

            <button
              type="submit"
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantRegistration;
