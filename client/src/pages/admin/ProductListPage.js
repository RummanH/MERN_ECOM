import React, { useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/esm/Row';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  deleteProduct,
  getAllProducts,
  selectAllProducts,
} from '../../redux-store/features/productsSlice';

const ProductListPage = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const sellerMode = window.location.href.includes('/seller');

  const products = useSelector(selectAllProducts);

  let allProducts;
  if (sellerMode) {
    allProducts = products.filter((p) => p.seller._id === user._id);
  } else {
    allProducts = products;
  }

  const handleDelete = (_id) => {
    if (window.confirm('Are you sure?')) dispatch(deleteProduct(_id));
    return;
  };

  useEffect(() => {
    dispatch(getAllProducts(sellerMode ? user._id : ''));
  }, [dispatch, sellerMode, user]);
  return (
    <div>
      <Row>
        <h1>Products</h1>
        <Button variant="primary" onClick={() => navigate('/createproduct')}>
          Create Product
        </Button>
      </Row>

      {
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>STOCK</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {allProducts &&
              allProducts.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category.name}</td>
                  <td>{product.brand}</td>
                  <td>{product.countInStock}</td>
                  <td>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={() => navigate(`/product/${product._id}/edit`)}
                      style={{ marginRight: '5px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="light"
                      type="button"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      }
    </div>
  );
};

export default ProductListPage;
