import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getAllProducts } from '../redux-store/features/productsSlice';
import { Product } from '../components';

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
          <Row>
            {allProducts.map((product) => {
              return (
                <Col sm={6} md={4} lg={3} className="mb-3" key={product._id}>
                  <Product product={product} />
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </>
  );
};

export default HomeScreen;
