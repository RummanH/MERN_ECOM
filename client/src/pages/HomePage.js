import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import React, { useEffect, useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

//Bootstrap
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { LoadingBox, MessageBox, Product } from '../components';
import { useGetAllProductsQuery } from '../redux-store/features/productSlice';
import { Link } from 'react-router-dom';
import { request } from '../services/axios_request';

const HomePage = () => {
  const [sellers, setSellers] = useState([]);
  const {
    isLoading,
    isSuccess,
    error,
    data: products,
  } = useGetAllProductsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let ids = [];
  if (isSuccess) {
    ids = products.ids;
  }

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const { data } = await request.get('/users/top-sellers');
        setSellers(data.data.sellers);
      } catch (err) {}
    };
    fetchSeller();
  }, []);

  return (
    <>
      <h2>Top Sellers</h2>
      {sellers && (
        <Carousel showArrows autoPlay showThumbs={false}>
          {sellers.map((seller) => (
            <div key={seller._id}>
              <Link to={`/seller/${seller._id}`}>
                <img src={seller.seller.logo} alt={seller.seller.img} />
                <p className="legend">{seller.seller.name}</p>
              </Link>
            </div>
          ))}
        </Carousel>
      )}
      <Helmet>
        <title>Rumman's Shop</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {ids && (
          <Row>
            {ids.map((productId) => {
              return (
                <Col sm={6} md={4} lg={3} className="mb-3" key={productId}>
                  <Product productId={productId} />
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </>
  );
};

export default HomePage;
