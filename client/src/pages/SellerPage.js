import React, { useEffect } from 'react';
import Col from 'react-bootstrap/esm/Col';
import Row from 'react-bootstrap/esm/Row';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { MessageBox, Product, Rating } from '../components';
import {
  selectProductsBySeller,
  useGetAllProductsQuery,
} from '../redux-store/features/productSlice';
import { getOneUser } from '../redux-store/features/userSlice';

const SellerPage = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.user);

  const params = useParams();
  const { sellerId } = params;
  const user = Object.values(users).find((u) => u._id === sellerId);
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

  const currentSellerProducts = useSelector((state) =>
    selectProductsBySeller(state, sellerId)
  );

  useEffect(() => {
    dispatch(getOneUser(sellerId));
  }, [sellerId, dispatch]);
  return (
    <div>
      {user && (
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
            {currentSellerProducts.length === 0 && (
              <MessageBox>No product found</MessageBox>
            )}
            <Row>
              {currentSellerProducts.map((product) => {
                return (
                  <Col sm={6} md={4} lg={3} className="mb-3" key={product._id}>
                    <Product productId={product._id} />
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPage;
