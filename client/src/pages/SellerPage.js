import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Rating } from '../components';
import { getAllProducts } from '../redux-store/features/productsSlice';

const SellerPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { sellerId } = params;
  const { products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);

  const allProducts = Object.values(products);

  useEffect(() => {
    dispatch(getAllProducts(sellerId));
  }, [dispatch, sellerId]);
  return (
    <div className="row top">
      <div className="col-1">
        {user && (
          <ul className="card card-body">
            <li>
              <div className="row">
                {/* <div>
                  <img src={user.seller.logo} alt={user.seller.name} />
                </div> */}
                <div>
                  <h1>{user.seller.name}</h1>
                </div>
              </div>
            </li>
            <li>
              <Rating
                rating={user.seller.rating}
                numReviews={`${user.seller.numReviews} Reviews`}
              />
            </li>
            <li>
              <a href={`mailto:${user.email}`}>Contact Seller</a>
            </li>
            <li>{user.seller.description}</li>
          </ul>
        )}
      </div>
      <div className="col-3"></div>
    </div>
  );
};

export default SellerPage;
