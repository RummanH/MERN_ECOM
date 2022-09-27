import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../redux-store/features/productsSlice';
// import data from '../services/data';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { products, error, loading } = useSelector((state) => state.products);

  const allProducts = Object.values(products);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <>
      <h1>Featured Products</h1>
      <div className="products">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          allProducts.map((prod) => {
            return (
              <div key={prod._id} className="product">
                <Link to={`/product/${prod.slug}`}>
                  <img src={prod.image} alt={prod.name} />
                </Link>
                <div className="product-info">
                  <Link to={`/product/${prod.slug}`}>
                    <p>{prod.name}</p>
                  </Link>
                  <p>
                    <strong>${prod.price}</strong>
                  </p>
                  <button>Add to Cart</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default HomeScreen;
