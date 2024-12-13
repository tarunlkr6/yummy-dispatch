import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AdminProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      if (!token) {
        throw new Error('Token not found. Please log in again.');
      }

      const response = await axios.get('/me', {
        baseURL: 'https://scan-dine-backend-5qms.onrender.com/api/v1/user',
        //baseURL: 'http://localhost:8080/api/v1/user', // Update for production
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setUserProfile(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-center text-red-500 bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg p-4 rounded-lg shadow-md">Error: {error}</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white border-opacity-20 p-8"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-gray-300"
          >
            <i className="fa-solid fa-user fa-2xl"></i>
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-6">{userProfile.fullName}</h1>
          <p className="text-lg text-gray-300 mb-2">{userProfile.email}</p>
          <p className="text-md text-gray-400 mb-4">
            {userProfile.isAdmin ? 'Administrator' : 'User'}
          </p>
        </div>

        <div className="mt-6">
          <ProfileItem label="Restaurant ID" value={userProfile.restaurantId || 'N/A'} />
          <ProfileItem label="User ID" value={userProfile._id} />
          <ProfileItem label="Account Created" value={new Date(userProfile.createdAt).toLocaleDateString()} />
          <ProfileItem label="Last Updated" value={new Date(userProfile.updatedAt).toLocaleDateString()} />
        </div>
      </motion.div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex justify-between items-center bg-white bg-opacity-5 backdrop-filter backdrop-blur-sm rounded-xl p-4 shadow-md transition duration-300 ease-in-out hover:bg-opacity-10 mb-2"
  >
    <span className="text-sm font-semibold text-white text-opacity-80">{label}:</span>
    <span className="text-lg text-white">{value}</span>
  </motion.div>
);

export default AdminProfile;
