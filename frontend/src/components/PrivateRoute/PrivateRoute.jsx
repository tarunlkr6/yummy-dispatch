// PrivateRoute.jsx
import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [hasNotified, setHasNotified] = useState(false);

  useEffect(() => {
    if (!userInfo && !hasNotified) {
      toast.warn('Please log in to access this page', { position: "top-center" });
      setHasNotified(true); // Ensures notification only shows once
    }
  }, [userInfo, hasNotified]);

  return userInfo ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
