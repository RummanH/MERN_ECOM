import Button from 'react-bootstrap/esm/Button';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectProductById,
  useDeleteProductMutation,
} from '../redux-store/features/productSlice';

const AdminProductTable = ({ productId }) => {
  const [
    deleteProduct,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteProductMutation();
  const product = useSelector((state) => selectProductById(state, productId));
  const navigate = useNavigate();

  const handleDelete = (_id) => {
    if (window.confirm('Are you sure?')) deleteProduct(_id);
    return;
  };

  return (
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
  );
};

export default AdminProductTable;
