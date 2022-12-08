import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectOrderById } from '../redux-store/features/orderSlice';

const AdminOrderTable = ({ orderId }) => {
  const order = useSelector((state) => selectOrderById(state, orderId));
  const navigate = useNavigate();
  const handleDelete = async (_id) => {
    try {
      // await dispatch(deleteOrder(_id)).unwrap();
    } catch (err) {}
    return;
  };
  return (
    <tr key={order._id}>
      <td>{order._id}</td>
      <td>{order.user ? order.user.name : ''}</td>
      <td>{order.createdAt.substring(0, 10)}</td>
      <td>{order.totalPrice.toFixed(2)}</td>
      <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td>
      <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
      <td>
        <Button
          type="button"
          variant="primary"
          onClick={() => {
            navigate(`/order/${order._id}`);
          }}
          style={{ marginRight: '10px' }}
        >
          Actions
        </Button>

        <Button
          type="button"
          variant="light"
          onClick={() => handleDelete(order._id)}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default AdminOrderTable;
