import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminAndSeller = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  return (user && user.roles.includes('admin')) ||
    user.roles.includes('seller') ? (
    children
  ) : (
    <Navigate to="/" />
  );
};

export default AdminAndSeller;
