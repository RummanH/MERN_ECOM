import React, { useEffect } from 'react';
import { store } from '../redux-store/store';
import { productApiSlice } from '../redux-store/features/productSlice';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {
  useEffect(() => {
    console.log('subscribing');
    const products = store.dispatch(
      productApiSlice.endpoints.getAllProducts.initiate()
    );
    return () => {
      console.log('Unsubscribing');
      products.unsubscribe();
    };
  }, []);
  return <Outlet />;
};

export default Prefetch;
