import React, { useEffect } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Row from 'react-bootstrap/esm/Row';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoadingBox, MessageBox } from '../components';
import {
  deleteProduct,
  getAllProducts,
} from '../redux-store/features/productsSlice';

const ProductListPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);
  const allProducts = Object.values(products);
  console.log(allProducts);

  const handleDelete = (_id) => {
    dispatch(deleteProduct(_id));
  };

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);
  return (
    <div>
      <Row>
        <h1>Products</h1>
        <Button
          variant="primary"
          onClick={() => navigate('/admin/createproduct')}
        >
          Create Product
        </Button>
      </Row>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category.name}</td>
                <td>{product.brand}</td>
                <td>
                  <Button
                    variant="primary"
                    type="button"
                    onClick={() =>
                      navigate(`/admin/product/${product._id}/edit`)
                    }
                    style={{ marginRight: '5px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="primary"
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
      )}
    </div>
  );
};

export default ProductListPage;
