import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const SellerRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  return user && user.roles.includes('seller') ? children : <Navigate to="/" />;
};

export default SellerRoute;
