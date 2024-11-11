import React, { useState } from "react";
import backgroundImage from "../../assets/pexels--2.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestaurantRegistration = () => {

 const [image, setImage] = useState(false);
  const url = 'http://localhost:8080/api/v1/restaurant'
  const [data, setData] = useState({
    name: "",
    description: "",
    ownerName: "",
    ownerEmail: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    openingTime: "",
    closingTime: "",
    avatar: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(formData);
    Object.entries(data).forEach(([key, value]) => formData.append(key, value));
    formData.append("avatar", image);

    try {
      const response = await axios.post(`${url}/register`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          ownerName: "",
          ownerEmail: "",
          phoneNumber: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          openingTime: "",
          closingTime: "",
          avatar: "",
        });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to register. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-70 shadow-lg rounded-lg p-8 w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-auto h-[80vh] overflow-hidden">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Restaurant Registration
        </h2>
        
        {/* Scrollable form container */}
        <div className="h-full overflow-y-scroll scrollbar-hide p-2">
          <form onSubmit={onSubmitHandler} className="space-y-4">
            {[
              { label: "Restaurant Name", name: "name", type: "text" },
              { label: "Restaurant Description", name: "description", type: "text" },
              { label: "Owner Name", name: "ownerName", type: "text" },
              { label: "Email", name: "ownerEmail", type: "email" },
              { label: "Phone", name: "phoneNumber", type: "text" },
              { label: "Address", name: "address", type: "text" },
              { label: "Zip Code", name: "zipCode", type: "text" },
              // { label: "Avatar URL (optional)", name: "avatar", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-white">
                  {field.label}
                </label>
                <input
                  className="form-input bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type={field.type}
                  name={field.name}
                  placeholder={field.label}
                  value={data[field.name]}
                  onChange={onChangeHandler}
                />
              </div>
            ))}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">City</label>
                <input
                  className="form-input bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="text"
                  name="city"
                  placeholder="City"
                  value={data.city}
                  onChange={onChangeHandler}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">State</label>
                <select
                  className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  name="state"
                  value={data.state}
                  onChange={onChangeHandler}
                >
                  <option value="">Select State</option>
                  {[
                  "Andra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Orissa", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttaranchal", "Uttar Pradesh", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadar and Nagar Haveli", "Daman and Diu", "Delhi", "Lakshadeep", "Pondicherry"
                ].map((state) => (
                  <option key={state} value={state} className="text-gray-800">
                    {state}
                  </option>
                ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white">
                  Opening Time
                </label>
                <input
                  className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="text"
                  name="openingTime"
                  placeholder="Opening Time"
                  value={data.openingTime}
                  onChange={onChangeHandler}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  Closing Time
                </label>
                <input
                  className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  type="text"
                  name="closingTime"
                  placeholder="Closing Time"
                  value={data.closingTime}
                  onChange={onChangeHandler}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white">
                Restaurant Image
              </label>
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="bg-transparent border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
            >
              Register Restaurant
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegistration;
