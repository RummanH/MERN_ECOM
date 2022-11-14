import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  console.log('hi', user);
  return user && user.role === 'admin' ? children : <Navigate to="/signin" />;
}

export default AdminRoute;
