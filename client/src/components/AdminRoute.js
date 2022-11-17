import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  return user && user.roles.includes('admin') ? children : <Navigate to="/" />;
}

export default AdminRoute;
