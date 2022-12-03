import React, { useEffect } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MessageBox, Product, Rating } from '../components';
import {
  getAllProducts,
  selectProductsBySeller,
} from '../redux-store/features/productsSlice';

const SellerPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const { sellerId } = params;

  const allProducts = useSelector((state) =>
    selectProductsBySeller(state, sellerId)
  );

  useEffect(() => {
    dispatch(getAllProducts(sellerId));
  }, [sellerId, dispatch]);
  return (
    <div className="row top">
      <div className="col-1">
        <ul className="card card-body">
          <li>
            <div className="row">
              <div>
                <img
                  className="small"
                  src={user.seller.logo}
                  alt={`Logo of ${user.seller.name}`}
                />
              </div>
              <div>
                <h1>{user.seller.name}</h1>
              </div>
            </div>
          </li>
          <li>
            <Rating
              rating={user.seller.rating}
              numReviews={user.seller.numReviews}
            />
          </li>
          <li>
            <a href={`mailto:${user.email}`}>Contact Seller</a>
          </li>
          <li>{user.seller.description}</li>
        </ul>
      </div>
      <div className="col-3">
        {allProducts.length === 0 && <MessageBox>No product found</MessageBox>}
        <Row>
          {allProducts.map((product) => {
            return (
              <Col sm={6} md={4} lg={3} className="mb-3" key={product._id}>
                <Product product={product} />
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export default SellerPage;
